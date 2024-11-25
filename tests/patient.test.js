const request = require('supertest');
const app = require('../app'); // This assumes you have exported your express app in app.js

let patientId;

describe('Patient Management APIs', () => {
  // Add a new patient
  it('should add a new patient', async () => {
    const response = await request(app)
      .post('/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        dob: '1990-01-01',
        contact: '1234567890',
        medicalHistory: 'Diabetes',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Patient added successfully.');
    patientId = response.body.patient._id;
  });

  // Get all patients
  it('should get all patients', async () => {
    const response = await request(app)
      .get('/patients')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Update patient information
  it('should update a patient', async () => {
    const response = await request(app)
      .put(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe Updated',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Patient updated successfully.');
  });

  // Delete patient
  it('should delete a patient', async () => {
    const response = await request(app)
      .delete(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Patient deleted successfully.');
  });
});
