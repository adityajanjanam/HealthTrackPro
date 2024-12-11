const request = require('supertest');
const app = require('../server');

describe('Patient API Tests', () => {
  let token;
  let patientId;

  beforeAll(async () => {
    // Log in and get token
    const res = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    token = res.body.token;
    await Patient.deleteMany({});
  });

  it('should add a new patient', async () => {
    const res = await request(app)
      .post('/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        dob: '1990-01-01',
        contact: '1234567890',
        email: 'johndoe@example.com',
        medicalHistory: 'None',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.patient.name).toBe('John Doe');
    patientId = res.body.patient._id;
  });

  it('should fetch all patients', async () => {
    const res = await request(app)
      .get('/patients')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('should fetch a single patient by ID', async () => {
    const res = await request(app)
      .get(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('John Doe');
  });

  it('should delete a patient', async () => {
    const res = await request(app)
      .delete(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Patient deleted successfully.');
  });
});
