const request = require('supertest');
const app = require('../app'); // Assuming you export the express app from app.js
const mongoose = require('mongoose');
require('dotenv').config();

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/HealthTrackPro', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

// User Registration Test
describe('POST /register', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully.');
  });

  it('should not register an existing user', async () => {
    const response = await request(app).post('/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('User already exists.');
  });
});

// User Login Test
describe('POST /login', () => {
  it('should login with correct credentials', async () => {
    const response = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful.');
    token = response.body.accessToken;
  });

  it('should not login with incorrect credentials', async () => {
    const response = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'wrongpassword',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid credentials. Incorrect password.');
  });
});
