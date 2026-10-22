import { WorkoutLog } from '../models/WorkoutLog.js';
import { Exercise } from '../models/Exercise.js';
import { ApiError } from '../utils/ApiError.js';
import {
  getTodayUtcString,
  addUtcDays,
  getMondayOfUtcWeek,
  getPastWeekStarts,
  getPastDateStrings,
} from '../utils/dates.js';

export const ALL_MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'core',
  'cardio',
];

export function computeStreak(uniqueDatesSet, todayStr = getTodayUtcString()) {
  const yesterdayStr = addUtcDays(todayStr, -1);
  let cursor = null;

  if (uniqueDatesSet.has(todayStr)) {
    cursor = todayStr;
  } else if (uniqueDatesSet.has(yesterdayStr)) {
    cursor = yesterdayStr;
  } else {
    return 0;
  }

  let streak = 0;
  while (uniqueDatesSet.has(cursor)) {
    streak += 1;
    cursor = addUtcDays(cursor, -1);
  }
  return streak;
}

export function computeWeeklyStreak(uniqueDatesSet, todayStr = getTodayUtcString()) {
  const weekStartSet = new Set();
  for (const dateStr of uniqueDatesSet) {
    weekStartSet.add(getMondayOfUtcWeek(dateStr));
  }

  const currentMonday = getMondayOfUtcWeek(todayStr);
  const lastMonday = addUtcDays(currentMonday, -7);

  let cursor = null;
  if (weekStartSet.has(currentMonday)) {
    cursor = currentMonday;
  } else if (weekStartSet.has(lastMonday)) {
    cursor = lastMonday;
  } else {
    return 0;
  }

  let streak = 0;
  while (weekStartSet.has(cursor)) {
    streak += 1;
    cursor = addUtcDays(cursor, -7);
  }
  return streak;
}

export function calculateEpley1RM(weightKg, reps) {
  if (!weightKg || weightKg <= 0 || !reps || reps <= 0 || reps > 12) {
    return null;
  }
  return Number((weightKg * (1 + reps / 30)).toFixed(2));
}

export async function getSummaryStats(userId, todayStr = getTodayUtcString()) {
  const logs = await WorkoutLog.find({ user: userId })
    .sort({ date: -1, createdAt: -1 })
    .populate('planDay.plan', 'slug name');

  const totalSessions = logs.length;
  const currentMonday = getMondayOfUtcWeek(todayStr);
  const currentSunday = addUtcDays(currentMonday, 6);

  let sessionsThisWeek = 0;
  let totalSets = 0;
  let totalReps = 0;
  let totalVolumeKg = 0;
  const uniqueDates = new Set();

  let lastWorkoutDate = logs.length > 0 ? logs[0].date : null;
  let lastPlanDay = null;

  for (const log of logs) {
    uniqueDates.add(log.date);
    if (log.date >= currentMonday && log.date <= currentSunday) {
      sessionsThisWeek += 1;
    }

    if (!lastPlanDay && log.planDay && log.planDay.plan) {
      const planDoc = log.planDay.plan;
      lastPlanDay = {
        planId: (planDoc._id || planDoc.id || planDoc).toString(),
        slug: planDoc.slug || null,
        dayNumber: log.planDay.dayNumber,
      };
    }

    for (const entry of log.entries) {
      totalSets += entry.sets.length;
      for (const s of entry.sets) {
        const reps = s.reps || 0;
        const weight = s.weightKg || 0;
        totalReps += reps;
        totalVolumeKg += reps * weight;
      }
    }
  }

  totalVolumeKg = Number(totalVolumeKg.toFixed(1));
  const currentStreakDays = computeStreak(uniqueDates, todayStr);
  const weeklyStreak = computeWeeklyStreak(uniqueDates, todayStr);

  return {
    totalSessions,
    sessionsThisWeek,
    totalSets,
    totalReps,
    totalVolumeKg,
    currentStreakDays,
    weeklyStreak,
    lastWorkoutDate,
    lastPlanDay,
  };
}

export async function getVolumeStats(userId, weeks = 8, todayStr = getTodayUtcString()) {
  const weekStarts = getPastWeekStarts(weeks, todayStr);
  const earliestDate = weekStarts[0];
  const latestDate = addUtcDays(weekStarts[weekStarts.length - 1], 6);

  const logs = await WorkoutLog.find({
    user: userId,
    date: { $gte: earliestDate, $lte: latestDate },
  });

  const bucketMap = new Map(
    weekStarts.map((ws) => [
      ws,
      {
        weekStart: ws,
        volumeKg: 0,
        sets: 0,
        sessions: 0,
      },
    ]),
  );

  for (const log of logs) {
    const ws = getMondayOfUtcWeek(log.date);
    const bucket = bucketMap.get(ws);
    if (bucket) {
      bucket.sessions += 1;
      for (const entry of log.entries) {
        bucket.sets += entry.sets.length;
        for (const s of entry.sets) {
          bucket.volumeKg += (s.reps || 0) * (s.weightKg || 0);
        }
      }
    }
  }

  return weekStarts.map((ws) => {
    const b = bucketMap.get(ws);
    return {
      weekStart: b.weekStart,
      volumeKg: Number(b.volumeKg.toFixed(1)),
      sets: b.sets,
      sessions: b.sessions,
    };
  });
}

export async function getFrequencyStats(userId, days = 28, todayStr = getTodayUtcString()) {
  const dateStrings = getPastDateStrings(days, todayStr);
  const earliestDate = dateStrings[0];

  const logs = await WorkoutLog.find({
    user: userId,
    date: { $gte: earliestDate, $lte: todayStr },
  });

  const counts = new Map();
  for (const log of logs) {
    counts.set(log.date, (counts.get(log.date) || 0) + 1);
  }

  return dateStrings.map((date) => ({
    date,
    count: counts.get(date) || 0,
  }));
}

export async function getMuscleDistributionStats(
  userId,
  days = 30,
  todayStr = getTodayUtcString(),
) {
  const earliestDate = addUtcDays(todayStr, -(days - 1));

  const logs = await WorkoutLog.find({
    user: userId,
    date: { $gte: earliestDate, $lte: todayStr },
  }).populate('entries.exercise', 'muscleGroup');

  const setsByGroup = new Map(ALL_MUSCLE_GROUPS.map((g) => [g, 0]));
  let totalSets = 0;

  for (const log of logs) {
    for (const entry of log.entries) {
      const group = entry.exercise?.muscleGroup;
      if (group && setsByGroup.has(group)) {
        const count = entry.sets.length;
        setsByGroup.set(group, setsByGroup.get(group) + count);
        totalSets += count;
      }
    }
  }

  return ALL_MUSCLE_GROUPS.map((muscleGroup) => {
    const sets = setsByGroup.get(muscleGroup) || 0;
    const percentage = totalSets > 0 ? Number(((sets / totalSets) * 100).toFixed(1)) : 0;
    return {
      muscleGroup,
      sets,
      percentage,
    };
  });
}

export async function getExerciseProgressStats(userId, exerciseId) {
  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    throw new ApiError(404, 'NOT_FOUND', 'Exercise not found');
  }

  const logs = await WorkoutLog.find({
    user: userId,
    'entries.exercise': exercise._id,
  }).sort({ date: 1, createdAt: 1 });

  const pointsByDate = new Map();

  for (const log of logs) {
    const matchingEntry = log.entries.find(
      (e) => e.exercise.toString() === exercise._id.toString(),
    );
    if (!matchingEntry) {
      continue;
    }

    if (exercise.trackingType === 'reps') {
      const existing = pointsByDate.get(log.date) || {
        date: log.date,
        bestWeightKg: 0,
        bestEst1RM: null,
        totalReps: 0,
        volumeKg: 0,
      };

      for (const s of matchingEntry.sets) {
        const reps = s.reps || 0;
        const weight = s.weightKg || 0;
        if (weight > existing.bestWeightKg) {
          existing.bestWeightKg = weight;
        }
        const epley = calculateEpley1RM(weight, reps);
        if (epley !== null && (existing.bestEst1RM === null || epley > existing.bestEst1RM)) {
          existing.bestEst1RM = epley;
        }
        existing.totalReps += reps;
        existing.volumeKg += reps * weight;
      }
      existing.volumeKg = Number(existing.volumeKg.toFixed(1));
      pointsByDate.set(log.date, existing);
    } else {
      const existing = pointsByDate.get(log.date) || {
        date: log.date,
        bestDurationSec: 0,
        totalDurationSec: 0,
      };

      for (const s of matchingEntry.sets) {
        const dur = s.durationSec || 0;
        if (dur > existing.bestDurationSec) {
          existing.bestDurationSec = dur;
        }
        existing.totalDurationSec += dur;
      }
      pointsByDate.set(log.date, existing);
    }
  }

  return {
    exercise: {
      id: exercise.id,
      name: exercise.name,
      trackingType: exercise.trackingType,
      muscleGroup: exercise.muscleGroup,
    },
    points: Array.from(pointsByDate.values()),
  };
}

export async function getPersonalRecordsStats(userId) {
  const logs = await WorkoutLog.find({ user: userId })
    .sort({ date: 1, createdAt: 1 })
    .populate('entries.exercise', 'name trackingType muscleGroup');

  const prMap = new Map();

  for (const log of logs) {
    for (const entry of log.entries) {
      const ex = entry.exercise;
      if (!ex) {
        continue;
      }
      const exId = (ex._id || ex.id).toString();
      const record = prMap.get(exId) || {
        exercise: {
          id: exId,
          name: ex.name,
          trackingType: ex.trackingType,
          muscleGroup: ex.muscleGroup,
        },
        bestWeightKg: ex.trackingType === 'reps' ? 0 : null,
        bestEst1RM: null,
        totalReps: ex.trackingType === 'reps' ? 0 : null,
        bestDurationSec: ex.trackingType === 'time' ? 0 : null,
        lastDate: log.date,
      };

      if (log.date > record.lastDate) {
        record.lastDate = log.date;
      }

      for (const s of entry.sets) {
        if (ex.trackingType === 'reps') {
          const reps = s.reps || 0;
          const weight = s.weightKg || 0;
          if (weight > record.bestWeightKg) {
            record.bestWeightKg = weight;
          }
          const epley = calculateEpley1RM(weight, reps);
          if (epley !== null && (record.bestEst1RM === null || epley > record.bestEst1RM)) {
            record.bestEst1RM = epley;
          }
          record.totalReps += reps;
        } else {
          const dur = s.durationSec || 0;
          if (dur > record.bestDurationSec) {
            record.bestDurationSec = dur;
          }
        }
      }

      prMap.set(exId, record);
    }
  }

  return Array.from(prMap.values()).sort((a, b) =>
    a.exercise.name.localeCompare(b.exercise.name),
  );
}
