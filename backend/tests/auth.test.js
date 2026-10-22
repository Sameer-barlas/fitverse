import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';

describe('Auth routes: Register, Login, Me, Logout, Rate limits', () => {
  it('registers a user successfully with hashed password and httpOnly cookie', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const res = await request(app).post('/api/auth/register').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.name).toBe('John Doe');
    expect(res.body.data.user.email).toBe('john@example.com');
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.id).toBeDefined();

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('token=');
    expect(cookies[0].toLowerCase()).toContain('httponly');

    const dbUser = await User.findOne({ email: 'john@example.com' }).select('+password');
    expect(dbUser).not.toBeNull();
    expect(dbUser.password).toMatch(/^\$2[aby]\$12\$/);
  });

  it('rejects duplicate email with 409 EMAIL_TAKEN', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'User 1',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'User 2',
      email: 'duplicate@example.com',
      password: 'password456',
    });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('validates invalid email and short password with 400 and field details', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      password: 'short',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toHaveProperty('name');
    expect(res.body.error.details).toHaveProperty('email');
    expect(res.body.error.details).toHaveProperty('password');
  });

  it('logs in an existing user with correct credentials and sets cookie', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login Tester',
      email: 'login@example.com',
      password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('login@example.com');
    expect(res.body.data.user.password).toBeUndefined();

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('token=');
  });

  it('returns identical 401 for wrong password and unknown email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'correctpassword',
    });

    const wrongPassRes = await request(app).post('/api/auth/login').send({
      email: 'existing@example.com',
      password: 'wrongpassword',
    });

    const unknownEmailRes = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'anypassword',
    });

    expect(wrongPassRes.status).toBe(401);
    expect(unknownEmailRes.status).toBe(401);
    expect(wrongPassRes.body).toEqual({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      },
    });
    expect(unknownEmailRes.body).toEqual(wrongPassRes.body);
  });

  it('GET /api/auth/me returns 401 without cookie, 200 with user and profile: null when authenticated', async () => {
    const unauthedRes = await request(app).get('/api/auth/me');
    expect(unauthedRes.status).toBe(401);
    expect(unauthedRes.body.error.code).toBe('UNAUTHORIZED');

    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: 'password123',
    });

    const cookie = regRes.headers['set-cookie'];

    const authedRes = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(authedRes.status).toBe(200);
    expect(authedRes.body.data.user.email).toBe('me@example.com');
    expect(authedRes.body.data.profile).toBeNull();
  });

  it('POST /api/auth/logout clears cookie and subsequent me call fails with 401', async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Logout User',
      email: 'logout@example.com',
      password: 'password123',
    });

    const cookie = regRes.headers['set-cookie'];

    const logoutRes = await request(app).post('/api/auth/logout').set('Cookie', cookie);
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.data.message).toBe('Logged out successfully');

    const clearedCookies = logoutRes.headers['set-cookie'];
    expect(clearedCookies).toBeDefined();
    expect(clearedCookies[0]).toContain('token=');

    const subsequentMe = await request(app).get('/api/auth/me').set('Cookie', 'token=');
    expect(subsequentMe.status).toBe(401);
  });

  it('rejects tampered or malformed token with 401', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', ['token=invalid_token_payload']);
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('enforces rate limit: 11th login attempt returns 429 RATE_LIMITED', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/api/auth/login')
        .set('x-test-rate-limit', 'true')
        .send({
          email: 'rate@example.com',
          password: 'wrongpassword',
        });
    }

    const res = await request(app)
      .post('/api/auth/login')
      .set('x-test-rate-limit', 'true')
      .send({
        email: 'rate@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('RATE_LIMITED');
  });
});
