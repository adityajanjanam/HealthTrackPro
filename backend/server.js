// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow CORS for frontend
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Models

// User model
const UserSchema = new mongoose.Schema(
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
);

const User = mongoose.model('User', UserSchema);

// Patient model
const PatientSchema = new mongoose.Schema(
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
);

const Patient = mongoose.model('Patient', PatientSchema);

// Patient record model
const PatientRecordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    testType: {
      type: String,
      required: true,
      enum: ['Blood Pressure', 'Heart Rate', 'Oxygen Level', 'Respiratory Rate'],
      set: (value) => value.replace(/\b\w/g, (char) => char.toUpperCase()), // Normalize capitalization
    },
    reading: { type: String, required: true },
    symptoms: [String],
    treatmentNotes: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PatientRecord = mongoose.model('PatientRecord', PatientRecordSchema);

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token missing or invalid.' });

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

// User Authentication

// Register a new user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

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
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Login a user
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

// Patient Management

// Add a new patient
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

// Get all patients
app.get('/patients', authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Patient Records

// Add a patient record
app.post('/patient-records', authenticateToken, async (req, res) => {
  const { patientId, testType, reading, symptoms, treatmentNotes } = req.body;

  if (!patientId || !testType || !reading) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const record = new PatientRecord({ patientId, testType, reading, symptoms, treatmentNotes });
    await record.save();
    res.status(201).json({ message: 'Patient record added successfully.', record });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all patient records
app.get('/patient-records', authenticateToken, async (req, res) => {
  try {
    const records = await PatientRecord.find()
      .populate('patientId', 'name contact')
      .sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching patient records:', error);
    res.status(500).json({ error: 'Failed to fetch patient records.' });
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
