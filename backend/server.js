// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const Joi = require('joi');
require('dotenv').config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow CORS for frontend
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection with retry mechanism
const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
      console.error('MongoDB connection failed, retrying in 5 seconds...', error);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Models
const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      name: { type: String, required: true, minlength: 3 },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          message: 'Invalid email address!',
        },
      },
      password: { type: String, required: true, minlength: 6 },
    },
    { timestamps: true }
  )
);

const Patient = mongoose.model(
  'Patient',
  new mongoose.Schema(
    {
      name: { type: String, required: true, minlength: 3 },
      dob: { type: Date, required: true },
      contact: { type: String, required: true, match: /^[0-9]{10}$/ },
      email: { type: String, default: 'N/A' },
      medicalHistory: { type: String, required: true },
      bloodPressure: { type: String, default: 'N/A' },
      heartRate: { type: String, default: 'N/A' },
      respiratoryRate: { type: String, default: 'N/A' },
      oxygenLevel: { type: String, default: 'N/A' },
      isCritical: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

const PatientRecord = mongoose.model(
  'PatientRecord',
  new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    testType: {
      type: String,
      enum: ['BloodPressure', 'HeartRate', 'RespiratoryRate', 'OxygenLevel'], // Enum values
      required: true,
    },
    value: { type: String, required: true },
    symptoms: [String],
    treatmentNotes: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true })
);


// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
    req.user = verified;
    next();
  } catch (err) {
    console.error('Invalid token:', err.message);
    res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

// Routes

// User Routes
app.post('/register', async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', {
      expiresIn: '1h',
    });

    res.status(200).json({ token, username: user.name });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Patient Routes
app.post('/patients', authenticateToken, async (req, res) => {
  const { name, dob, contact, email, medicalHistory } = req.body;

  if (!name || !dob || !contact || !medicalHistory) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const patient = new Patient({ name, dob, contact, email, medicalHistory });
    await patient.save();
    res.status(201).json({ message: 'Patient added successfully.', patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/patients', authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/patients/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Patient ID.' });
  }

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.put('/patients/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(id, updatedData, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/patients/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Patient ID.' });
  }

  try {
    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.status(200).json({ message: 'Patient deleted successfully.', patient: deletedPatient });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// PatientRecord Routes
const normalizeTestType = {
  bloodPressure: 'BloodPressure',
  heartRate: 'HeartRate',
  oxygenLevel: 'OxygenLevel',
  respiratoryRate: 'RespiratoryRate',
};

app.post('/patient-records', async (req, res) => {
  try {
    const { patientId, readings, symptoms, treatmentNotes, isCritical } = req.body;

    if (!patientId || !Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ message: 'Invalid payload. Ensure readings are provided.' });
    }

    const records = readings.map((reading) => ({
      patientId,
      testType: reading.testType,
      value: reading.value,
      symptoms,
      treatmentNotes,
      isCritical,
    }));

    await PatientRecord.insertMany(records);
    res.status(201).json({ message: 'Patient records created successfully.', records });
  } catch (error) {
    console.error('Validation Error:', error);
    res.status(400).json({ error: error.message });
  }
});



app.get('/patient-records', authenticateToken, async (req, res) => {
  try {
    const records = await PatientRecord.find().populate('patientId');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.delete('/patient-records/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid Patient Record ID.' });
  }

  try {
    const deletedRecord = await PatientRecord.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Patient record not found.' });
    }
    res.status(200).json({ message: 'Patient record deleted successfully.', record: deletedRecord });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.get('/patients/statistics', authenticateToken, async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments({});
    const criticalPatients = await Patient.countDocuments({ isCritical: true });
    res.json({ totalPatients, criticalPatients });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
