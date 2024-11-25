
const request = require('supertest');
const app = require('../app'); // This assumes you have exported your express app in app.js

let patientId;

beforeAll(async () => {
  // Adding a patient to create records for testing
  const response = await request(app)
    .post('/patients')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Jane Doe',
      dob: '1992-02-02',
      contact: '0987654321',
      medicalHistory: 'Asthma',
    });
  patientId = response.body.patient._id;
});

describe('Patient Record APIs', () => {
  let recordId;

  // Add a new patient record
  it('should add a patient record', async () => {
    const response = await request(app)
      .post('/patient-records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patientId,
        testType: 'bloodPressure',
        reading: '120/80',
        symptoms: ['cough', 'fever'],
        treatmentNotes: 'Continue with current medication',
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Patient record added successfully.');
    recordId = response.body.record._id;
  });

  // Get all patient records
  it('should get all patient records', async () => {
    const response = await request(app)
      .get('/patient-records')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Clean up: Delete the test patient
  afterAll(async () => {
    await request(app)
      .delete(`/patients/${patientId}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
