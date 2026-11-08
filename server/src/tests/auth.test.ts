import request from 'supertest';
import app from '../app';
import { setupTestDB } from './setup';

setupTestDB();

describe('Authentication & User Management Endpoints', () => {
  const testSeeker = {
    name: 'Jane Doe',
    email: 'jane.seeker@example.com',
    password: 'Password123!',
    role: 'seeker',
  };

  it('should register a new seeker successfully and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testSeeker);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testSeeker.email);
    expect(res.body.data.user.role).toBe('seeker');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should reject registration if email is already registered', async () => {
    // First registration
    await request(app).post('/api/v1/auth/register').send(testSeeker);

    // Second registration with same email
    const res = await request(app).post('/api/v1/auth/register').send(testSeeker);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should reject registration with invalid email format or short password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Short User',
      email: 'not-an-email',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('should authenticate user and return token on valid login', async () => {
    await request(app).post('/api/v1/auth/register').send(testSeeker);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: testSeeker.email,
      password: testSeeker.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testSeeker.email);
  });

  it('should reject login with wrong credentials', async () => {
    await request(app).post('/api/v1/auth/register').send(testSeeker);

    const res = await request(app).post('/api/v1/auth/login').send({
      email: testSeeker.email,
      password: 'WrongPassword999!',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return current authenticated user profile on /api/v1/auth/me', async () => {
    const regRes = await request(app).post('/api/v1/auth/register').send(testSeeker);
    const token = regRes.body.data.token;

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testSeeker.email);
  });
});
