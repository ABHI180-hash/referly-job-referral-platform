import request from 'supertest';
import app from '../app';
import { setupTestDB } from './setup';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { ReferrerProfile } from '../models/ReferrerProfile';
import { SubscriptionPlan } from '../models/SubscriptionPlan';

setupTestDB();

describe('Referral Requests & Workflow Business Logic Endpoints', () => {
  let referrerToken: string;
  let referrerUserId: string;
  let seekerToken: string;
  let jobId: string;

  beforeEach(async () => {
    // 0. Create free plan
    await SubscriptionPlan.create({
      planId: 'free',
      name: 'Free',
      tagline: 'Casual tier',
      monthlyPrice: 0,
      yearlyPrice: 0,
      limits: { referralsPerMonth: 2, applicationTracking: '10' },
      features: ['2 referrals/month'],
    });

    // 1. Create company
    const company = await Company.create({
      name: 'Google',
      slug: 'google',
      website: 'https://google.com',
      industry: 'Technology',
    });

    // 2. Register Referrer
    const refRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Sundar Referrer',
      email: 'sundar@google.com',
      password: 'Password123!',
      role: 'referrer',
    });
    referrerToken = refRes.body.data.token;
    referrerUserId = refRes.body.data.user.id || refRes.body.data.user._id;

    // Attach referrer profile company
    await ReferrerProfile.findOneAndUpdate(
      { user: referrerUserId },
      { company: company._id, jobTitle: 'Principal Engineer', isAvailableForReferrals: true }
    );

    // 3. Register Seeker
    const seekRes = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Job Candidate',
      email: 'candidate@example.com',
      password: 'Password123!',
      role: 'seeker',
    });
    seekerToken = seekRes.body.data.token;

    // 4. Create Job
    const job = await Job.create({
      title: 'Full Stack Staff Engineer',
      company: 'Google',
      companyRef: company._id,
      postedBy: referrerUserId,
      department: 'Cloud',
      location: 'Mountain View, CA',
      workMode: 'Hybrid',
      jobType: 'Full-time',
      experienceLevel: 'Lead / Staff',
      description: 'Help build scalable distributed cloud services.',
    });
    jobId = (job._id as any).toString();
  });

  it('should allow a seeker to request a referral', async () => {
    const res = await request(app)
      .post('/api/v1/referrals')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        referrerId: referrerUserId,
        jobId: jobId,
        resumeUrl: 'https://example.com/resumes/candidate.pdf',
        customNote: 'Hi Sundar, I have 8 years of React/Node cloud architecture experience.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    const data = res.body.data;
    expect(data.status).toBe('Pending');
  });

  it('should block duplicate referral requests for the same job and referrer', async () => {
    // First request
    await request(app)
      .post('/api/v1/referrals')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        referrerId: referrerUserId,
        jobId: jobId,
        resumeUrl: 'https://example.com/resumes/candidate.pdf',
        customNote: 'First attempt note',
      });

    // Duplicate request
    const duplicateRes = await request(app)
      .post('/api/v1/referrals')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        referrerId: referrerUserId,
        jobId: jobId,
        resumeUrl: 'https://example.com/resumes/candidate.pdf',
        customNote: 'Second attempt note',
      });

    expect(duplicateRes.status).toBe(400);
    expect(duplicateRes.body.success).toBe(false);
    expect(duplicateRes.body.message).toMatch(/already/i);
  });

  it('should allow the referrer to accept or reject the referral request', async () => {
    // Seeker submits referral
    const submitRes = await request(app)
      .post('/api/v1/referrals')
      .set('Authorization', `Bearer ${seekerToken}`)
      .send({
        referrerId: referrerUserId,
        jobId: jobId,
        resumeUrl: 'https://example.com/resumes/candidate.pdf',
        customNote: 'Please refer me!',
      });

    const referralId = submitRes.body.data._id;

    // Referrer reviews and accepts
    const reviewRes = await request(app)
      .patch(`/api/v1/referrals/${referralId}/status`)
      .set('Authorization', `Bearer ${referrerToken}`)
      .send({
        status: 'accepted',
        feedbackNotes: 'Profile looks very strong. Forwarded to Google Cloud hiring team!',
      });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.success).toBe(true);
    expect(reviewRes.body.data.status).toBe('Accepted');
  });
});
