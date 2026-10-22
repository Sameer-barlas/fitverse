import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { Profile } from '../src/models/Profile.js';

describe('Profile routes', () => {
  let cookie;

  beforeEach(async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Profile Tester',
      email: `profile_${Date.now()}@example.com`,
      password: 'password123',
    });
    cookie = regRes.headers['set-cookie'];
  });

  it('GET /api/profile returns 404 PROFILE_NOT_FOUND before creation', async () => {
    const res = await request(app).get('/api/profile').set('Cookie', cookie);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('PROFILE_NOT_FOUND');
  });

  it('PUT /api/profile creates a profile and ignores client-supplied bmi and bmiCategory', async () => {
    const payload = {
      heightCm: 175,
      weightKg: 70,
      age: 28,
      gender: 'male',
      experienceLevel: 'intermediate',
      bmi: 99.9, // Should be ignored
      bmiCategory: 'obese', // Should be ignored
    };

    const res = await request(app).put('/api/profile').set('Cookie', cookie).send(payload);

    expect(res.status).toBe(200);
    const profile = res.body.data.profile;
    expect(profile.heightCm).toBe(175);
    expect(profile.weightKg).toBe(70);
    expect(profile.bmi).toBe(22.9);
    expect(profile.bmiCategory).toBe('normal');
    expect(profile.ageBand).toBe('adult');
    expect(profile.healthyWeightRangeKg).toEqual({ min: 56.7, max: 76.3 });

    // Ensure only 1 document in DB
    const count = await Profile.countDocuments();
    expect(count).toBe(1);
  });

  it('PUT /api/profile updates the existing profile on second call without duplicate docs', async () => {
    await request(app).put('/api/profile').set('Cookie', cookie).send({
      heightCm: 180,
      weightKg: 80,
      age: 35,
      gender: 'male',
      experienceLevel: 'beginner',
    });

    const updateRes = await request(app).put('/api/profile').set('Cookie', cookie).send({
      heightCm: 180,
      weightKg: 75,
      age: 42,
      gender: 'male',
      experienceLevel: 'intermediate',
    });

    expect(updateRes.status).toBe(200);
    const profile = updateRes.body.data.profile;
    expect(profile.weightKg).toBe(75);
    expect(profile.age).toBe(42);
    expect(profile.ageBand).toBe('midlife');

    const count = await Profile.countDocuments();
    expect(count).toBe(1);
  });

  it('rejects out of range inputs with 400 VALIDATION_ERROR', async () => {
    const res = await request(app).put('/api/profile').set('Cookie', cookie).send({
      heightCm: 50, // min 100
      weightKg: 500, // max 300
      age: 15, // min 18
      gender: 'alien',
      experienceLevel: 'ninja',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toHaveProperty('heightCm');
    expect(res.body.error.details).toHaveProperty('weightKg');
    expect(res.body.error.details).toHaveProperty('age');
    expect(res.body.error.details).toHaveProperty('gender');
    expect(res.body.error.details).toHaveProperty('experienceLevel');
  });

  it('GET /api/auth/me includes profile after creation', async () => {
    await request(app).put('/api/profile').set('Cookie', cookie).send({
      heightCm: 170,
      weightKg: 65,
      age: 26,
      gender: 'female',
      experienceLevel: 'beginner',
    });

    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(meRes.status).toBe(200);
    expect(meRes.body.data.profile).not.toBeNull();
    expect(meRes.body.data.profile.bmi).toBe(22.5);
    expect(meRes.body.data.profile.ageBand).toBe('adult');
  });
});
