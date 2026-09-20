import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Let\'s Talk Super App Full API Suite', () => {
  let authToken = '';
  const testPhone = '9876543210';
  const testCountryCode = '+91';

  it('GET /health should return 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain("Let's Talk");
  });

  it('POST /api/auth/request-otp should return 200 and sandbox OTP', async () => {
    const res = await request(app)
      .post('/api/auth/request-otp')
      .send({ phoneNumber: testPhone, countryCode: testCountryCode });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.sandboxCode).toBe('123456');
  });

  it('POST /api/auth/verify-otp should issue JWT token upon valid OTP', async () => {
    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phoneNumber: testPhone, countryCode: testCountryCode, code: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
    authToken = res.body.token;
  });

  it('GET /api/chats should list user chats', async () => {
    const res = await request(app)
      .get('/api/chats')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.chats)).toBe(true);
  });

  it('POST /api/chats should create a direct chat', async () => {
    const res = await request(app)
      .post('/api/chats')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ targetUserId: 'usr_sarah_02' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.chat).toBeDefined();
  });

  it('POST /api/messages should send a text message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        chatId: 'chat_demo_01',
        content: 'Hello from automated test suite!',
        type: 'TEXT',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message.content).toBe('Hello from automated test suite!');
  });

  it('POST /api/polls should create an interactive poll', async () => {
    const res = await request(app)
      .post('/api/polls')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        chatId: 'chat_demo_01',
        question: 'What is our launch strategy?',
        options: ['Direct Launch', 'Phased Beta', 'Community Preview'],
        isMultipleChoice: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.poll).toBeDefined();
  });

  it('POST /api/events should schedule a chat event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        chatId: 'chat_demo_01',
        title: 'SuperApp Global Launch Keynote',
        description: 'Global presentation of Let\'s Talk features',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        location: 'Virtual Stage / Space Alpha',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.event).toBeDefined();
  });

  it('GET /api/status should retrieve active 24h stories', async () => {
    const res = await request(app)
      .get('/api/status')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.feed)).toBe(true);
  });

  it('GET /api/channels/discover should return public broadcast channels', async () => {
    const res = await request(app)
      .get('/api/channels/discover')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.channels)).toBe(true);
  });

  it('POST /api/payments/vpa/verify should validate UPI VPA address', async () => {
    const res = await request(app)
      .post('/api/payments/vpa/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ vpa: 'rahul.sharma@okaxis' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.isValid).toBe(true);
    expect(res.body.verifiedName).toContain('RAHUL SHARMA');
  });

  it('POST /api/payments/transfer should execute sandboxed UPI transfer with zero PIN storage', async () => {
    const res = await request(app)
      .post('/api/payments/transfer')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        receiverVpa: 'sarah.jenkins@okhdfc',
        amount: 250.00,
        note: 'Team Dinner split',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payment.status).toBe('COMPLETED');
    expect(res.body.payment.referenceId).toBeDefined();
  });

  it('POST /api/ai/chat should generate response from Aura AI Assistant', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        message: 'Give me a 1-sentence welcome message for Let\'s Talk super app.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.reply).toBeDefined();
  });

  it('GET /api/admin/metrics should return real-time system metrics', async () => {
    const res = await request(app)
      .get('/api/admin/metrics')
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-admin-token', 'super_admin_dev_secret_2026');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.metrics.totalUsers).toBeGreaterThan(0);
    expect(res.body.metrics.systemHealth).toBe('OPTIMAL');
  });
});
