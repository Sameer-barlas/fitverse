import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Health and Not Found routes', () => {
  it('GET /api/health returns 200 with { data: { status: "ok" } }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        status: 'ok',
      },
    });
  });

  it('GET unknown route returns 404 with NOT_FOUND error code', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toContain('Route GET /api/unknown-endpoint not found');
  });
});
