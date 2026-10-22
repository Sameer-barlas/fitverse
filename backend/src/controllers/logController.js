import { WorkoutLog } from '../models/WorkoutLog.js';
import { Exercise } from '../models/Exercise.js';
import { ApiError } from '../utils/ApiError.js';

const LOG_EXERCISE_SELECT = 'name images trackingType muscleGroup externalId equipment level';

async function validateAndNormalizeEntries(entries) {
  const exerciseIds = entries.map((e) => e.exercise);
  const foundExercises = await Exercise.find({ _id: { $in: exerciseIds } });
  const exMap = new Map(foundExercises.map((e) => [e._id.toString(), e]));

  const details = {};
  const normalizedEntries = [];

  entries.forEach((entry, entryIdx) => {
    const exDoc = exMap.get(entry.exercise);
    if (!exDoc) {
      details[`entries.${entryIdx}.exercise`] = 'Unknown exercise';
      return;
    }

    const normalizedSets = [];
    entry.sets.forEach((s, setIdx) => {
      const pathPrefix = `entries.${entryIdx}.sets.${setIdx}`;

      if (exDoc.trackingType === 'reps') {
        if (s.reps === null || s.reps === undefined) {
          details[`${pathPrefix}.reps`] = 'Reps are required for rep-tracked exercises';
        }
        if (s.durationSec !== null && s.durationSec !== undefined) {
          details[`${pathPrefix}.durationSec`] =
            'durationSec must not be provided for rep-tracked exercises';
        }
        normalizedSets.push({
          reps: s.reps,
          weightKg: s.weightKg ?? 0,
          durationSec: null,
        });
      } else {
        if (s.durationSec === null || s.durationSec === undefined) {
          details[`${pathPrefix}.durationSec`] =
            'durationSec is required for time-tracked exercises';
        }
        if (s.reps !== null && s.reps !== undefined) {
          details[`${pathPrefix}.reps`] = 'reps must not be provided for time-tracked exercises';
        }
        if (s.weightKg !== undefined && s.weightKg !== null && s.weightKg !== 0) {
          details[`${pathPrefix}.weightKg`] = 'weightKg must be 0 for time-tracked exercises';
        }
        normalizedSets.push({
          reps: null,
          weightKg: 0,
          durationSec: s.durationSec,
        });
      }
    });

    normalizedEntries.push({
      exercise: entry.exercise,
      notes: entry.notes || '',
      sets: normalizedSets,
    });
  });

  if (Object.keys(details).length > 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Workout entry validation failed', details);
  }

  return normalizedEntries;
}

export async function createLog(req, res) {
  const { date, title, notes, planDay, entries } = req.validated.body;

  const normalizedEntries = await validateAndNormalizeEntries(entries);

  const created = await WorkoutLog.create({
    user: req.user.id,
    date,
    title,
    notes,
    planDay,
    entries: normalizedEntries,
  });

  const populated = await WorkoutLog.findById(created._id).populate(
    'entries.exercise',
    LOG_EXERCISE_SELECT,
  );

  res.status(201).json({
    data: {
      log: populated.toJSON(),
    },
  });
}

export async function listLogs(req, res) {
  const { from, to, exerciseId, page, limit } = req.validated.query;

  const filter = { user: req.user.id };

  if (from || to) {
    filter.date = {};
    if (from) {
      filter.date.$gte = from;
    }
    if (to) {
      filter.date.$lte = to;
    }
  }

  if (exerciseId) {
    filter['entries.exercise'] = exerciseId;
  }

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    WorkoutLog.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('entries.exercise', LOG_EXERCISE_SELECT),
    WorkoutLog.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  res.status(200).json({
    data: docs.map((d) => d.toJSON()),
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

export async function getLogById(req, res) {
  const { id } = req.validated.params;

  const log = await WorkoutLog.findOne({ _id: id, user: req.user.id }).populate(
    'entries.exercise',
    LOG_EXERCISE_SELECT,
  );

  if (!log) {
    throw new ApiError(404, 'NOT_FOUND', 'Workout log not found');
  }

  res.status(200).json({
    data: {
      log: log.toJSON(),
    },
  });
}

export async function updateLog(req, res) {
  const { id } = req.validated.params;
  const { date, title, notes, planDay, entries } = req.validated.body;

  const existing = await WorkoutLog.findOne({ _id: id, user: req.user.id });
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Workout log not found');
  }

  const normalizedEntries = await validateAndNormalizeEntries(entries);

  existing.date = date;
  existing.title = title;
  existing.notes = notes;
  existing.planDay = planDay;
  existing.entries = normalizedEntries;

  await existing.save();

  const populated = await WorkoutLog.findById(existing._id).populate(
    'entries.exercise',
    LOG_EXERCISE_SELECT,
  );

  res.status(200).json({
    data: {
      log: populated.toJSON(),
    },
  });
}

export async function deleteLog(req, res) {
  const { id } = req.validated.params;

  const deleted = await WorkoutLog.findOneAndDelete({ _id: id, user: req.user.id });
  if (!deleted) {
    throw new ApiError(404, 'NOT_FOUND', 'Workout log not found');
  }

  res.status(204).send();
}
