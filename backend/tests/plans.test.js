import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { runSeed } from '../src/seed/index.js';
import { WorkoutPlan } from '../src/models/WorkoutPlan.js';

describe('Workout Plans Seed, API, and Recommendations', () => {
  let cookie;

  beforeEach(async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Plan Tester',
      email: `plan_${Date.now()}_${Math.random()}@example.com`,
      password: 'password123',
    });
    cookie = regRes.headers['set-cookie'];
  });

  it('seeds 36 plans idempotently by slug', async () => {
    await runSeed();
    expect(await WorkoutPlan.countDocuments()).toBe(36);

    await runSeed();
    expect(await WorkoutPlan.countDocuments()).toBe(36);
  });

  it('GET /api/plans lists all 36 summaries and supports bmiCategory, experienceLevel, and ageBand filters', async () => {
    await runSeed();

    const allRes = await request(app).get('/api/plans').set('Cookie', cookie);
    expect(allRes.status).toBe(200);
    expect(allRes.body.data.length).toBe(36);

    const bandRes = await request(app).get('/api/plans?ageBand=midlife').set('Cookie', cookie);
    expect(bandRes.status).toBe(200);
    expect(bandRes.body.data.length).toBe(12);
    expect(bandRes.body.data.every((p) => p.ageBand === 'midlife')).toBe(true);

    const specificRes = await request(app)
      .get('/api/plans?bmiCategory=overweight&experienceLevel=advanced&ageBand=senior')
      .set('Cookie', cookie);
    expect(specificRes.status).toBe(200);
    expect(specificRes.body.data.length).toBe(1);
    expect(specificRes.body.data[0].slug).toBe('overweight-advanced-senior');
  });

  it('GET /api/plans/recommended returns 400 PROFILE_REQUIRED when user has no profile', async () => {
    await runSeed();

    const res = await request(app).get('/api/plans/recommended').set('Cookie', cookie);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('PROFILE_REQUIRED');
  });

  it('GET /api/plans/recommended matches all 36 combinations and sample profiles S1–S8', async () => {
    await runSeed();

    const bmiTestWeightsAt200cm = {
      underweight: 70, // BMI 17.5
      normal: 85, // BMI 21.3
      overweight: 108, // BMI 27.0
      obese: 130, // BMI 32.5
    };

    const ageBandTestAges = {
      adult: 25,
      midlife: 45,
      senior: 60,
    };

    for (const [bmiCategory, weightKg] of Object.entries(bmiTestWeightsAt200cm)) {
      for (const experienceLevel of ['beginner', 'intermediate', 'advanced']) {
        for (const [ageBand, age] of Object.entries(ageBandTestAges)) {
          await request(app).put('/api/profile').set('Cookie', cookie).send({
            heightCm: 200,
            weightKg,
            age,
            gender: 'male',
            experienceLevel,
          });

          const recRes = await request(app).get('/api/plans/recommended').set('Cookie', cookie);
          expect(recRes.status).toBe(200);
          const expectedSlug = `${bmiCategory}-${experienceLevel}-${ageBand}`;
          expect(recRes.body.data.plan.slug).toBe(expectedSlug);
          expect(recRes.body.data.why).toMatchObject({
            bmiCategory,
            experienceLevel,
            ageBand,
          });
        }
      }
    }

    // Sample profiles S1–S8 from PLAN.md §13
    const samples = [
      { heightCm: 175, weightKg: 50, age: 25, experienceLevel: 'beginner', slug: 'underweight-beginner-adult', days: 3 },
      { heightCm: 175, weightKg: 70, age: 45, experienceLevel: 'intermediate', slug: 'normal-intermediate-midlife', days: 4 },
      { heightCm: 170, weightKg: 80, age: 60, experienceLevel: 'advanced', slug: 'overweight-advanced-senior', days: 4 },
      { heightCm: 165, weightKg: 95, age: 30, experienceLevel: 'advanced', slug: 'obese-advanced-adult', days: 4 },
      { heightCm: 180, weightKg: 100, age: 35, experienceLevel: 'intermediate', slug: 'obese-intermediate-adult', days: 4 },
      { heightCm: 160, weightKg: 45, age: 70, experienceLevel: 'beginner', slug: 'underweight-beginner-senior', days: 3 },
      { heightCm: 175, weightKg: 70, age: 30, experienceLevel: 'advanced', slug: 'normal-advanced-adult', days: 5 },
      { heightCm: 170, weightKg: 70, age: 62, experienceLevel: 'intermediate', slug: 'normal-intermediate-senior', days: 3 },
    ];

    for (const s of samples) {
      await request(app).put('/api/profile').set('Cookie', cookie).send({
        heightCm: s.heightCm,
        weightKg: s.weightKg,
        age: s.age,
        gender: 'female',
        experienceLevel: s.experienceLevel,
      });

      const res = await request(app).get('/api/plans/recommended').set('Cookie', cookie);
      expect(res.status).toBe(200);
      expect(res.body.data.plan.slug).toBe(s.slug);
      expect(res.body.data.plan.daysPerWeek).toBe(s.days);
    }
  });

  it('GET /api/plans/:id returns plan with populated exercises including name, imageUrls, trackingType, muscleGroup', async () => {
    await runSeed();
    const planDoc = await WorkoutPlan.findOne({ slug: 'normal-beginner-adult' });

    const res = await request(app).get(`/api/plans/${planDoc.id}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    const plan = res.body.data.plan;
    expect(plan.slug).toBe('normal-beginner-adult');
    const firstEx = plan.days[0].exercises[0].exercise;
    expect(firstEx).toHaveProperty('name', 'Bodyweight Squat');
    expect(firstEx).toHaveProperty('trackingType', 'reps');
    expect(firstEx).toHaveProperty('muscleGroup', 'legs');
    expect(Array.isArray(firstEx.imageUrls)).toBe(true);
    expect(firstEx.imageUrls[0]).toContain('/exercise-images/');
  });
});
