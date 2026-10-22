import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { seedExercises } from '../src/seed/seedExercises.js';
import { Exercise } from '../src/models/Exercise.js';
import { getTodayUtcString, addUtcDays } from '../src/utils/dates.js';
import { computeStreak, computeWeeklyStreak } from '../src/services/statsService.js';

describe('Stats API: Summary, Volume, Frequency, Muscles, Exercise Progress, Personal Records', () => {
  let cookie;
  let benchEx;
  let squatEx;
  let plankEx;

  beforeEach(async () => {
    await seedExercises();
    benchEx = await Exercise.findOne({ externalId: 'Dumbbell_Bench_Press' });
    squatEx = await Exercise.findOne({ externalId: 'Goblet_Squat' });
    plankEx = await Exercise.findOne({ externalId: 'Plank' });

    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Stats User',
      email: `stats_${Date.now()}_${Math.random()}@example.com`,
      password: 'password123',
    });
    cookie = regRes.headers['set-cookie'];
  });

  it('returns zeroes and zero-filled series for an empty user', async () => {
    const sumRes = await request(app).get('/api/stats/summary').set('Cookie', cookie);
    expect(sumRes.status).toBe(200);
    expect(sumRes.body.data).toEqual({
      totalSessions: 0,
      sessionsThisWeek: 0,
      totalSets: 0,
      totalReps: 0,
      totalVolumeKg: 0,
      currentStreakDays: 0,
      weeklyStreak: 0,
      lastWorkoutDate: null,
      lastPlanDay: null,
    });

    const volRes = await request(app).get('/api/stats/volume').set('Cookie', cookie);
    expect(volRes.status).toBe(200);
    expect(volRes.body.data.length).toBe(8);
    expect(volRes.body.data.every((w) => w.volumeKg === 0 && w.sets === 0 && w.sessions === 0)).toBe(
      true,
    );

    const freqRes = await request(app).get('/api/stats/frequency').set('Cookie', cookie);
    expect(freqRes.status).toBe(200);
    expect(freqRes.body.data.length).toBe(28);
    expect(freqRes.body.data.every((d) => d.count === 0)).toBe(true);

    const muscRes = await request(app).get('/api/stats/muscles').set('Cookie', cookie);
    expect(muscRes.status).toBe(200);
    expect(muscRes.body.data.length).toBe(7);
    expect(muscRes.body.data.every((m) => m.sets === 0 && m.percentage === 0)).toBe(true);
  });

  it('validates out-of-range query parameters (e.g. weeks=13 -> 400)', async () => {
    const res = await request(app).get('/api/stats/volume?weeks=13').set('Cookie', cookie);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('computes exact summary KPIs, volume, frequency, daily & weekly streak for 3 seeded sessions', async () => {
    const today = getTodayUtcString();
    const yesterday = addUtcDays(today, -1);

    await request(app)
      .post('/api/logs')
      .set('Cookie', cookie)
      .send({
        date: yesterday,
        title: 'Session 1',
        entries: [
          {
            exercise: benchEx.id,
            sets: [
              { reps: 10, weightKg: 20 },
              { reps: 10, weightKg: 20 },
            ],
          },
        ],
      });

    await request(app)
      .post('/api/logs')
      .set('Cookie', cookie)
      .send({
        date: today,
        title: 'Session 2',
        entries: [
          {
            exercise: squatEx.id,
            sets: [
              { reps: 8, weightKg: 25 },
              { reps: 8, weightKg: 25 },
            ],
          },
        ],
      });

    await request(app)
      .post('/api/logs')
      .set('Cookie', cookie)
      .send({
        date: today,
        title: 'Session 3',
        entries: [
          {
            exercise: plankEx.id,
            sets: [{ durationSec: 45 }, { durationSec: 60 }],
          },
        ],
      });

    const sumRes = await request(app).get('/api/stats/summary').set('Cookie', cookie);
    expect(sumRes.status).toBe(200);
    expect(sumRes.body.data.totalSessions).toBe(3);
    expect(sumRes.body.data.totalSets).toBe(6);
    expect(sumRes.body.data.totalReps).toBe(36);
    expect(sumRes.body.data.totalVolumeKg).toBe(800);
    expect(sumRes.body.data.currentStreakDays).toBe(2);
    expect(sumRes.body.data.weeklyStreak).toBeGreaterThanOrEqual(1);
    expect(sumRes.body.data.lastWorkoutDate).toBe(today);
    expect(sumRes.body.data.sessionsThisWeek).toBeGreaterThanOrEqual(2);

    const streakFromYesterday = computeStreak(
      new Set([yesterday, addUtcDays(today, -2)]),
      today,
    );
    expect(streakFromYesterday).toBe(2);

    const weeklyStreakVal = computeWeeklyStreak(
      new Set([today, addUtcDays(today, -7)]),
      today,
    );
    expect(weeklyStreakVal).toBe(2);
  });

  it('computes muscle group distribution across all 7 groups summing to ~100%', async () => {
    const today = getTodayUtcString();

    await request(app)
      .post('/api/logs')
      .set('Cookie', cookie)
      .send({
        date: today,
        entries: [
          {
            exercise: benchEx.id,
            sets: [
              { reps: 10, weightKg: 20 },
              { reps: 10, weightKg: 20 },
            ],
          },
          {
            exercise: squatEx.id,
            sets: [
              { reps: 10, weightKg: 20 },
              { reps: 10, weightKg: 20 },
            ],
          },
        ],
      });

    const muscRes = await request(app).get('/api/stats/muscles?days=30').set('Cookie', cookie);
    expect(muscRes.status).toBe(200);
    expect(muscRes.body.data.length).toBe(7);

    const chest = muscRes.body.data.find((m) => m.muscleGroup === 'chest');
    const legs = muscRes.body.data.find((m) => m.muscleGroup === 'legs');
    expect(chest).toEqual({ muscleGroup: 'chest', sets: 2, percentage: 50 });
    expect(legs).toEqual({ muscleGroup: 'legs', sets: 2, percentage: 50 });

    const totalPct = muscRes.body.data.reduce((acc, m) => acc + m.percentage, 0);
    expect(totalPct).toBeCloseTo(100, 0);
  });

  it('returns per-exercise progress sorted by date asc including Epley 1RM for reps and duration for time', async () => {
    const d1 = '2026-10-01';
    const d2 = '2026-10-08';

    await request(app)
      .post('/api/logs')
      .set('Cookie', cookie)
      .send({
        date: d2,
        entries: [
          {
            exercise: benchEx.id,
            sets: [
              { reps: 8, weightKg: 25 },
              { reps: 5, weightKg: 100 }, // Epley: 100 * (1 + 5/30) = 116.67
            ],
          },
          {
            exercise: plankEx.id,
            sets: [{ durationSec: 45 }, { durationSec: 60 }],
          },
        ],
      });

    await request(app)
      .post('/api/logs')
      .set('Cookie', cookie)
      .send({
        date: d1,
        entries: [
          {
            exercise: benchEx.id,
            sets: [
              { reps: 10, weightKg: 20 },
              { reps: 10, weightKg: 22.5 }, // Epley: 22.5 * (1 + 10/30) = 30
            ],
          },
          {
            exercise: plankEx.id,
            sets: [{ durationSec: 30 }, { durationSec: 40 }],
          },
        ],
      });

    const repsProgRes = await request(app)
      .get(`/api/stats/exercise/${benchEx.id}`)
      .set('Cookie', cookie);
    expect(repsProgRes.status).toBe(200);
    expect(repsProgRes.body.data.exercise).toMatchObject({
      id: benchEx.id,
      name: 'Dumbbell Bench Press',
      trackingType: 'reps',
      muscleGroup: 'chest',
    });
    expect(repsProgRes.body.data.points).toEqual([
      {
        date: '2026-10-01',
        bestWeightKg: 22.5,
        bestEst1RM: 30,
        totalReps: 20,
        volumeKg: 425,
      },
      {
        date: '2026-10-08',
        bestWeightKg: 100,
        bestEst1RM: 116.67,
        totalReps: 13,
        volumeKg: 700,
      },
    ]);

    const timeProgRes = await request(app)
      .get(`/api/stats/exercise/${plankEx.id}`)
      .set('Cookie', cookie);
    expect(timeProgRes.status).toBe(200);
    expect(timeProgRes.body.data.exercise).toMatchObject({
      id: plankEx.id,
      name: 'Plank',
      trackingType: 'time',
      muscleGroup: 'core',
    });
    expect(timeProgRes.body.data.points).toEqual([
      {
        date: '2026-10-01',
        bestDurationSec: 40,
        totalDurationSec: 70,
      },
      {
        date: '2026-10-08',
        bestDurationSec: 60,
        totalDurationSec: 105,
      },
    ]);
  });

  it('GET /api/stats/personal-records returns per-exercise personal records with Epley 1RM', async () => {
    await request(app)
      .post('/api/logs')
      .set('Cookie', cookie)
      .send({
        date: '2026-10-10',
        entries: [
          {
            exercise: benchEx.id,
            sets: [{ reps: 5, weightKg: 100 }],
          },
          {
            exercise: plankEx.id,
            sets: [{ durationSec: 75 }],
          },
        ],
      });

    const prRes = await request(app).get('/api/stats/personal-records').set('Cookie', cookie);
    expect(prRes.status).toBe(200);
    expect(prRes.body.data.length).toBe(2);

    const benchPr = prRes.body.data.find((r) => r.exercise.name === 'Dumbbell Bench Press');
    expect(benchPr).toMatchObject({
      bestWeightKg: 100,
      bestEst1RM: 116.67,
      totalReps: 5,
      lastDate: '2026-10-10',
    });

    const plankPr = prRes.body.data.find((r) => r.exercise.name === 'Plank');
    expect(plankPr).toMatchObject({
      bestDurationSec: 75,
      lastDate: '2026-10-10',
    });
  });
});
