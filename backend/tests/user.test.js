const request = require('supertest');
const app = require('../server');

describe('User API Tests', () => {
  let token;

  beforeAll(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully.');
  });

  it('should login a user and return a token', async () => {
    const res = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should fail to register an existing user', async () => {
    const res = await request(app).post('/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists.');
  });
});
