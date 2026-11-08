import request from 'supertest';
import app from '../app';
import { setupTestDB } from './setup';
import { Company } from '../models/Company';

setupTestDB();

describe('Jobs & Role-Based Access Control Endpoints', () => {
  let referrerToken: string;
  let seekerToken: string;

  beforeEach(async () => {
    // 1. Create a company
    await Company.create({
      name: 'Stripe',
      slug: 'stripe',
      website: 'https://stripe.com',
      industry: 'FinTech',
      size: '5000+ employees',
      headquarters: 'San Francisco, CA',
      description: 'Financial infrastructure for the internet',
    });

    // 2. Register a Referrer
    const refRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Alice Referrer',
      email: 'alice@stripe.com',
      password: 'Password123!',
      role: 'referrer',
    });
    referrerToken = refRes.body.data.token;

    // 3. Register a Seeker
    const seekRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Bob Seeker',
      email: 'bob@example.com',
      password: 'Password123!',
      role: 'seeker',
    });
    seekerToken = seekRes.body.data.token;
  });

  it('should allow a referrer to post a new job', async () => {
    const jobData = {
      title: 'Senior Frontend Engineer',
      company: 'Stripe',
      department: 'Engineering',
      location: 'San Francisco, CA',
      workMode: 'Hybrid',
      jobType: 'Full-time',
      experienceLevel: 'Senior',
      salary: '$160,000 - $200,000',
      description: 'Build user-facing payment checkout experiences using React and TypeScript.',
      requirements: ['5+ years React', 'TypeScript expertise', 'Design systems'],
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
    };

    const res = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send(jobData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(jobData.title);
  });

  it('should reject job posting from a seeker due to RBAC', async () => {
    const res = await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        title: 'Unauthorized Job',
        company: 'Stripe',
        location: 'Remote',
        description: 'Should fail',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Forbidden/i);
  });

  it('should list published jobs publicly without authentication', async () => {
    // Create one job first
    await request(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({
        title: 'Backend Platform Engineer',
        company: 'Stripe',
        location: 'Remote, US',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: '$150,000 - $190,000',
        description: 'Scale distributed event queues with Node.js and MongoDB.',
        skills: ['Node.js', 'MongoDB', 'Docker'],
      });

    const res = await request(app).get('/api/v1/jobs');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
  });
});
