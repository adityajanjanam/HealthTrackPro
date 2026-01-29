const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { User, Patient } = require('../models');

describe('Patient API Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthtrackpro_test');
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Patient.deleteMany({});

    // Create and login user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    token = loginRes.body.data.accessToken;
    userId = loginRes.body.data.user.id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'John Doe',
          dob: '1990-01-01',
          contact: '1234567890',
          email: 'john@example.com',
          medicalHistory: 'No known medical conditions',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.patient).toHaveProperty('name', 'John Doe');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/patients')
        .send({
          name: 'John Doe',
          dob: '1990-01-01',
          contact: '1234567890',
          medicalHistory: 'No known medical conditions',
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with invalid contact number', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'John Doe',
          dob: '1990-01-01',
          contact: '123', // Invalid
          medicalHistory: 'No known medical conditions',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/patients', () => {
    beforeEach(async () => {
      // Create test patients
      await Patient.create([
        {
          name: 'John Doe',
          dob: '1990-01-01',
          contact: '1234567890',
          medicalHistory: 'Test history 1',
        },
        {
          name: 'Jane Smith',
          dob: '1985-05-15',
          contact: '0987654321',
          medicalHistory: 'Test history 2',
          isCritical: true,
        },
      ]);
    });

    it('should get all patients with pagination', async () => {
      const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.patients).toHaveLength(2);
      expect(res.body.data.pagination).toHaveProperty('totalPatients', 2);
    });

    it('should filter patients by search term', async () => {
      const res = await request(app)
        .get('/api/patients?search=John')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.patients).toHaveLength(1);
      expect(res.body.data.patients[0].name).toContain('John');
    });

    it('should filter critical patients', async () => {
      const res = await request(app)
        .get('/api/patients?isCritical=true')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.patients).toHaveLength(1);
      expect(res.body.data.patients[0].isCritical).toBe(true);
    });
  });

  describe('GET /api/patients/statistics', () => {
    beforeEach(async () => {
      await Patient.create([
        {
          name: 'Patient 1',
          dob: '1990-01-01',
          contact: '1234567890',
          medicalHistory: 'Test',
          isCritical: false,
        },
        {
          name: 'Patient 2',
          dob: '1985-05-15',
          contact: '0987654321',
          medicalHistory: 'Test',
          isCritical: true,
        },
        {
          name: 'Patient 3',
          dob: '1980-03-20',
          contact: '5555555555',
          medicalHistory: 'Test',
          isCritical: true,
        },
      ]);
    });

    it('should get patient statistics', async () => {
      const res = await request(app)
        .get('/api/patients/statistics')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalPatients', 3);
      expect(res.body.data).toHaveProperty('criticalPatients', 2);
      expect(res.body.data).toHaveProperty('stablePatients', 1);
    });
  });

  describe('PUT /api/patients/:id', () => {
    let patientId;

    beforeEach(async () => {
      const patient = await Patient.create({
        name: 'John Doe',
        dob: '1990-01-01',
        contact: '1234567890',
        medicalHistory: 'Test history',
      });
      patientId = patient._id;
    });

    it('should update patient information', async () => {
      const res = await request(app)
        .put(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'John Updated',
          contact: '9999999999',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.patient.name).toBe('John Updated');
      expect(res.body.data.patient.contact).toBe('9999999999');
    });

    it('should fail with invalid patient ID', async () => {
      const res = await request(app)
        .put('/api/patients/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'John Updated',
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /api/patients/:id', () => {
    let patientId;

    beforeEach(async () => {
      const patient = await Patient.create({
        name: 'John Doe',
        dob: '1990-01-01',
        contact: '1234567890',
        medicalHistory: 'Test history',
      });
      patientId = patient._id;
    });

    it('should soft delete a patient', async () => {
      const res = await request(app)
        .delete(`/api/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify patient is soft deleted
      const patient = await Patient.findById(patientId);
      expect(patient.isActive).toBe(false);
    });
  });
});
