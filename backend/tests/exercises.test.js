import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { seedExercises } from '../src/seed/seedExercises.js';
import { Exercise } from '../src/models/Exercise.js';

describe('Exercises API and Seed', () => {
  let cookie;

  beforeEach(async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Exercise Tester',
      email: `exercise_${Date.now()}@example.com`,
      password: 'password123',
    });
    cookie = regRes.headers['set-cookie'];
  });

  it('seeds exercises idempotently with 76 total records', async () => {
    await seedExercises();
    expect(await Exercise.countDocuments()).toBe(76);

    await seedExercises();
    expect(await Exercise.countDocuments()).toBe(76);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/exercises');
    expect(res.status).toBe(401);
  });

  it('lists exercises with query search, muscleGroup filter, and pagination', async () => {
    await seedExercises();

    const res = await request(app)
      .get('/api/exercises?q=squat&muscleGroup=legs&page=1&limit=10')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 10,
    });

    for (const ex of res.body.data) {
      expect(ex.name.toLowerCase()).toContain('squat');
      expect(ex.muscleGroup).toBe('legs');
      expect(Array.isArray(ex.imageUrls)).toBe(true);
      expect(ex.imageUrls[0]).toMatch(/^\/exercise-images\//);
    }
  });

  it('GET /api/exercises/filters returns distinct filter values', async () => {
    await seedExercises();

    const res = await request(app).get('/api/exercises/filters').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('muscleGroups');
    expect(res.body.data).toHaveProperty('categories');
    expect(res.body.data).toHaveProperty('equipments');
    expect(res.body.data).toHaveProperty('levels');
    expect(res.body.data.muscleGroups).toContain('legs');
    expect(res.body.data.levels).toEqual(['advanced', 'beginner', 'intermediate']);
  });

  it('GET /api/exercises/:id returns exercise with imageUrls and static image is served', async () => {
    await seedExercises();
    const pushups = await Exercise.findOne({ externalId: 'Pushups' });

    const res = await request(app).get(`/api/exercises/${pushups.id}`).set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.exercise.name).toBe('Pushups');
    expect(res.body.data.exercise.imageUrls).toContain('/exercise-images/Pushups/0.jpg');

    // Static image route works without auth cookie
    const imgRes = await request(app).get('/exercise-images/Pushups/0.jpg');
    expect(imgRes.status).toBe(200);
    expect(imgRes.headers['content-type']).toContain('image/jpeg');
  });

  it('returns 400 on invalid ObjectId for /:id', async () => {
    const res = await request(app).get('/api/exercises/not-an-id').set('Cookie', cookie);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
