import request from 'supertest';
import app from '../app';
import { setupTestDB } from './setup';
import { Website } from '../models/Website';
import { ScanResult } from '../models/ScanResult';

setupTestDB();

describe('LaunchPilot Website Launch Control Center Endpoints', () => {
  let createdWebsiteId: string;
  let testScanId: string;

  it('should retrieve list of tracked websites (and seed defaults if empty)', async () => {
    const res = await request(app).get('/api/v1/launchpilot/websites');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);

    createdWebsiteId = res.body.data[0]._id;
  });

  it('should register a new target website in the fleet', async () => {
    const payload = {
      name: 'Stripe Payment Gateway Sandbox',
      url: 'https://stripe.com',
      category: 'FinTech',
      environment: 'staging',
    };

    const res = await request(app)
      .post('/api/v1/launchpilot/websites')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Stripe Payment Gateway Sandbox');
    expect(res.body.data.domain).toBe('stripe.com');
  });

  it('should reject SSRF attempts scanning private IP addresses', async () => {
    const res = await request(app)
      .post('/api/v1/launchpilot/scans/trigger')
      .send({ url: 'http://127.0.0.1:8080' });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('private or internal network');
  });

  it('should execute live 15-point launch readiness scan on valid target', async () => {
    const res = await request(app)
      .post('/api/v1/launchpilot/scans/trigger')
      .send({ url: 'https://example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.scanResult).toBeDefined();

    const scan = res.body.data.scanResult;
    testScanId = scan._id;

    expect(scan.checks.length).toBe(15);
    expect(['GO', 'NO-GO', 'CONDITIONAL']).toContain(scan.launchStatus);
    expect(scan.readinessScore).toBeGreaterThanOrEqual(0);
    expect(scan.readinessScore).toBeLessThanOrEqual(100);

    // Verify presence of all 15 check names
    const checkNames = scan.checks.map((c: any) => c.name);
    expect(checkNames).toContain('Mobile Responsiveness');
    expect(checkNames).toContain('Internal and External Links');
    expect(checkNames).toContain('Contact Form Functionality');
    expect(checkNames).toContain('Page Loading Speed');
    expect(checkNames).toContain('Image Loading & Optimization');
    expect(checkNames).toContain('HTTPS / SSL Certificate');
    expect(checkNames).toContain('Browser Compatibility');
    expect(checkNames).toContain('Spelling & Content Errors');
    expect(checkNames).toContain('WhatsApp Integration');
    expect(checkNames).toContain('Professional Domain Email');
    expect(checkNames).toContain('Google Analytics Integration');
    expect(checkNames).toContain('Google Search Indexing');
    expect(checkNames).toContain('Social Media Link Preview / OG');
    expect(checkNames).toContain('Website Backup System');
    expect(checkNames).toContain('Payment Gateway Integration');
  });

  it('should permit manual verification for integration checks with audit notes', async () => {
    // Create a mock website and scan result to test verification
    const site = await Website.create({
      userId: 'demo_user_001',
      name: 'Test Store',
      url: 'https://teststore.com',
      domain: 'teststore.com',
      category: 'E-commerce',
      environment: 'staging',
      readinessScore: 60,
      launchStatus: 'NO-GO',
    });

    const scan = await ScanResult.create({
      websiteId: site._id,
      userId: 'demo_user_001',
      url: 'https://teststore.com',
      domain: 'teststore.com',
      readinessScore: 60,
      launchStatus: 'NO-GO',
      checks: [
        {
          checkId: 15,
          name: 'Payment Gateway Integration',
          category: 'integrations',
          isMandatory: false,
          status: 'warning',
          score: 65,
          details: 'Awaiting manual sandbox test',
          fixSuggestion: 'Run test card transaction',
          lastChecked: new Date(),
        },
      ],
    });

    const res = await request(app)
      .post(`/api/v1/launchpilot/scans/verify/${scan._id}`)
      .send({
        checkId: 15,
        note: 'Verified sandbox payment processing manually via Stripe Test Card 4242.',
        status: 'passed',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check15 = res.body.data.checks.find((c: any) => c.checkId === 15);
    expect(check15.status).toBe('passed');
    expect(check15.isManualVerified).toBe(true);
    expect(check15.verificationNote).toContain('Stripe Test Card 4242');
  });

  it('should deliver platform analytics and telemetry metrics', async () => {
    const res = await request(app).get('/api/v1/launchpilot/analytics');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.overview).toBeDefined();
    expect(res.body.data.categoryMetrics).toBeDefined();
    expect(Array.isArray(res.body.data.categoryMetrics)).toBe(true);
  });
});
