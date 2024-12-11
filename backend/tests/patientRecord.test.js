const request = require('supertest');
const app = require('../server');


describe('Patient Record API Tests', () => {
  let token;
  let patientId;
  let recordId;

  beforeAll(async () => {
    const loginRes = await request(app).post('/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    token = loginRes.body.token;

    const patientRes = await request(app)
      .post('/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Jane Doe',
        dob: '1995-01-01',
        contact: '0987654321',
        email: 'janedoe@example.com',
        medicalHistory: 'Asthma',
      });
    patientId = patientRes.body.patient._id;
    await PatientRecord.deleteMany({});
  });

  it('should add a patient record', async () => {
    const res = await request(app)
      .post('/patient-records')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patientId,
        readings: [
          { testType: 'BloodPressure', value: '120/80' },
          { testType: 'HeartRate', value: '75' },
        ],
        symptoms: ['Fatigue'],
        treatmentNotes: 'Prescribed rest',
        isCritical: false,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.records).toHaveLength(2);
    recordId = res.body.records[0]._id;
  });

  it('should fetch all patient records', async () => {
    const res = await request(app)
      .get('/patient-records')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should delete a patient record', async () => {
    const res = await request(app)
      .delete(`/patient-records/${recordId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Patient record deleted successfully.');
  });
});
