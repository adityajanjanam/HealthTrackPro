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
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/HealthTrackPro';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas or Local Database'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: { type: String, required: true, minlength: 6 },
});
const User = mongoose.model('User', UserSchema);

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  dob: { type: Date, required: true },
  contact: { type: String, required: true },
  medicalHistory: { type: String, required: true },
});
const Patient = mongoose.model('Patient', PatientSchema);

// Helper Functions
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// Routes

// Register User
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login User
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({ message: 'Login successful.', accessToken });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add Patient
app.post('/patients', authenticateToken, async (req, res) => {
  try {
    const { name, dob, contact, medicalHistory } = req.body;
    if (!name || !dob || !contact || !medicalHistory) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const patient = new Patient({ name, dob, contact, medicalHistory });
    await patient.save();
    res.status(201).json({ message: 'Patient added successfully.', patient });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get All Patients
app.get('/patients', authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    if (patients.length === 0) {
      return res.status(200).json({ message: 'No patients found.' });
    }
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.put('/patients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const patient = await Patient.findByIdAndUpdate(id, updates, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found.' });
    res.status(200).json({ message: 'Patient updated successfully.', patient });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.delete('/patients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found.' });
    res.status(200).json({ message: 'Patient deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Patient Record Management
app.post('/patient-records', authenticateToken, async (req, res) => {
  try {
    const { patientId, testType, reading, symptoms, treatmentNotes } = req.body;
    const record = new PatientRecord({ patientId, testType, reading, symptoms, treatmentNotes });
    await record.save();
    res.status(201).json({ message: 'Patient record added successfully.', record });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/patient-records', authenticateToken, async (req, res) => {
  try {
    const records = await PatientRecord.find().populate('patientId');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.send('Welcome to the HealthTrackPro API');
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
