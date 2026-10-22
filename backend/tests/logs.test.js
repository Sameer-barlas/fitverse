import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { seedExercises } from '../src/seed/seedExercises.js';
import { Exercise } from '../src/models/Exercise.js';

describe('Workout Logs CRUD and Ownership', () => {
  let user1Cookie;
  let user2Cookie;
  let repsEx;
  let timeEx;

  beforeEach(async () => {
    await seedExercises();
    repsEx = await Exercise.findOne({ externalId: 'Pushups' });
    timeEx = await Exercise.findOne({ externalId: 'Plank' });

    const reg1 = await request(app).post('/api/auth/register').send({
      name: 'Log User One',
      email: `log1_${Date.now()}_${Math.random()}@example.com`,
      password: 'password123',
    });
    user1Cookie = reg1.headers['set-cookie'];

    const reg2 = await request(app).post('/api/auth/register').send({
      name: 'Log User Two',
      email: `log2_${Date.now()}_${Math.random()}@example.com`,
      password: 'password123',
    });
    user2Cookie = reg2.headers['set-cookie'];
  });

  it('POST /api/logs creates a session with 2 entries (reps + time) and returns 201', async () => {
    const res = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-15',
        title: 'Morning Session',
        notes: 'Felt strong',
        entries: [
          {
            exercise: repsEx.id,
            notes: 'Strict form',
            sets: [
              { reps: 12, weightKg: 0 },
              { reps: 10, weightKg: 5 },
            ],
          },
          {
            exercise: timeEx.id,
            sets: [{ durationSec: 45 }, { durationSec: 45 }],
          },
        ],
      });

    expect(res.status).toBe(201);
    const log = res.body.data.log;
    expect(log.title).toBe('Morning Session');
    expect(log.entries.length).toBe(2);
    expect(log.entries[0].exercise.name).toBe('Pushups');
    expect(log.entries[1].exercise.name).toBe('Plank');
  });

  it('enforces reps-vs-time rules per trackingType', async () => {
    // Sending reps on timed exercise (Plank) -> 400
    const badTimeRes = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-15',
        entries: [
          {
            exercise: timeEx.id,
            sets: [{ reps: 10 }],
          },
        ],
      });
    expect(badTimeRes.status).toBe(400);
    expect(badTimeRes.body.error.code).toBe('VALIDATION_ERROR');

    // Sending durationSec on reps exercise (Pushups) -> 400
    const badRepsRes = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-15',
        entries: [
          {
            exercise: repsEx.id,
            sets: [{ reps: 10, durationSec: 30 }],
          },
        ],
      });
    expect(badRepsRes.status).toBe(400);
    expect(badRepsRes.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects unknown exercise, duplicate exercise, invalid calendar date, and future date > tomorrow', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const unknownRes = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-15',
        entries: [{ exercise: fakeId, sets: [{ reps: 10 }] }],
      });
    expect(unknownRes.status).toBe(400);

    const dupRes = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-15',
        entries: [
          { exercise: repsEx.id, sets: [{ reps: 10 }] },
          { exercise: repsEx.id, sets: [{ reps: 8 }] },
        ],
      });
    expect(dupRes.status).toBe(400);

    const invalidDateRes = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-02-30',
        entries: [{ exercise: repsEx.id, sets: [{ reps: 10 }] }],
      });
    expect(invalidDateRes.status).toBe(400);

    const futureDateRes = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2099-12-31',
        entries: [{ exercise: repsEx.id, sets: [{ reps: 10 }] }],
      });
    expect(futureDateRes.status).toBe(400);
  });

  it('lists logs newest-first with pagination and from/to/exerciseId filters', async () => {
    await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-01',
        title: 'Oldest',
        entries: [{ exercise: repsEx.id, sets: [{ reps: 10 }] }],
      });

    await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-10',
        title: 'Middle',
        entries: [{ exercise: timeEx.id, sets: [{ durationSec: 30 }] }],
      });

    await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-18',
        title: 'Newest',
        entries: [{ exercise: repsEx.id, sets: [{ reps: 12 }] }],
      });

    const listRes = await request(app).get('/api/logs').set('Cookie', user1Cookie);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.map((l) => l.title)).toEqual(['Newest', 'Middle', 'Oldest']);

    const rangeRes = await request(app)
      .get('/api/logs?from=2026-10-05&to=2026-10-15')
      .set('Cookie', user1Cookie);
    expect(rangeRes.body.data.length).toBe(1);
    expect(rangeRes.body.data[0].title).toBe('Middle');

    const exFilterRes = await request(app)
      .get(`/api/logs?exerciseId=${timeEx.id}`)
      .set('Cookie', user1Cookie);
    expect(exFilterRes.body.data.length).toBe(1);
    expect(exFilterRes.body.data[0].title).toBe('Middle');
  });

  it('PUT updates and DELETE removes own log; another user gets 404 on read/update/delete', async () => {
    const createRes = await request(app)
      .post('/api/logs')
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-15',
        title: 'Original Title',
        entries: [{ exercise: repsEx.id, sets: [{ reps: 10, weightKg: 20 }] }],
      });

    const logId = createRes.body.data.log.id;

    // User 2 gets 404 on GET, PUT, DELETE
    const u2Get = await request(app).get(`/api/logs/${logId}`).set('Cookie', user2Cookie);
    expect(u2Get.status).toBe(404);

    const u2Put = await request(app)
      .put(`/api/logs/${logId}`)
      .set('Cookie', user2Cookie)
      .send({
        date: '2026-10-15',
        title: 'Hacked',
        entries: [{ exercise: repsEx.id, sets: [{ reps: 10 }] }],
      });
    expect(u2Put.status).toBe(404);

    const u2Del = await request(app).delete(`/api/logs/${logId}`).set('Cookie', user2Cookie);
    expect(u2Del.status).toBe(404);

    // User 1 updates
    const updateRes = await request(app)
      .put(`/api/logs/${logId}`)
      .set('Cookie', user1Cookie)
      .send({
        date: '2026-10-16',
        title: 'Updated Title',
        entries: [{ exercise: timeEx.id, sets: [{ durationSec: 60 }] }],
      });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.log.title).toBe('Updated Title');
    expect(updateRes.body.data.log.entries[0].exercise.name).toBe('Plank');

    // User 1 deletes -> 204
    const delRes = await request(app).delete(`/api/logs/${logId}`).set('Cookie', user1Cookie);
    expect(delRes.status).toBe(204);

    // Subsequent GET returns 404
    const getAfterDel = await request(app).get(`/api/logs/${logId}`).set('Cookie', user1Cookie);
    expect(getAfterDel.status).toBe(404);
  });
});
