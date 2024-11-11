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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// User model with enhanced validation
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
});

const User = mongoose.model('User', UserSchema);

// Patient model with enhanced validation
const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
  },
  dob: {
    type: Date,
    required: [true, 'Date of Birth is required'],
    validate: {
      validator: function (v) {
        return !isNaN(Date.parse(v));
      },
      message: props => `${props.value} is not a valid date!`
    },
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    validate: {
      validator: function (v) {
        return /^[0-9\-+() ]+$/.test(v); // Simple validation for contact number
      },
      message: props => `${props.value} is not a valid contact number!`
    },
  },
  medicalHistory: {
    type: String,
    required: [true, 'Medical history is required'],
  },
});

const Patient = mongoose.model('Patient', PatientSchema);

// Patient record model with enhanced validation
const PatientRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  testType: { type: String, required: [true, 'Test type is required'] },
  reading: { type: String, required: [true, 'Reading value is required'] },
  symptoms: { type: [String] },
  treatmentNotes: { type: String },
  date: { type: Date, default: Date.now },
});

const PatientRecord = mongoose.model('PatientRecord', PatientRecordSchema);

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route with validation
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot Password route (simplified)
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found' });

    // Placeholder for actual email-sending logic
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('Error during password reset:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add patient route with validation
app.post('/patients', async (req, res) => {
  try {
    const { name, dob, contact, medicalHistory } = req.body;

    // Create a new patient
    const newPatient = new Patient({ name, dob, contact, medicalHistory });

    // Save the patient
    await newPatient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (err) {
    console.error('Error adding patient:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all patients
app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add patient record route with validation
app.post('/patient-records', async (req, res) => {
  try {
    const { patientId, testType, reading, symptoms, treatmentNotes } = req.body;

    // Create a new patient record
    const newRecord = new PatientRecord({ patientId, testType, reading, symptoms, treatmentNotes });

    // Save the patient record
    await newRecord.save();
    res.status(201).json({ message: 'Patient record added successfully', record: newRecord });
  } catch (err) {
    console.error('Error adding patient record:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this route to handle GET requests for patient records
app.get('/patient-records', async (req, res) => {
  try {
    const patientRecords = await PatientRecord.find().populate('patientId'); // Adjust the query if needed
    res.status(200).json(patientRecords);
  } catch (err) {
    console.error('Error fetching patient records:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      console.error('Invalid patient ID format:', patientId);
      return res.status(400).json({ message: 'Invalid patient ID format' });
    }

    console.log('Fetching patient with ID:', patientId);
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(200).json(patient);
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Base route
app.get('/', (req, res) => {
  res.send('Welcome to the HealthTrackPro API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
