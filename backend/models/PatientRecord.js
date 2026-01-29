const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    testType: {
      type: String,
      enum: {
        values: ['BloodPressure', 'HeartRate', 'RespiratoryRate', 'OxygenLevel'],
        message: '{VALUE} is not a valid test type',
      },
      required: [true, 'Test type is required'],
    },
    value: {
      type: String,
      required: [true, 'Test value is required'],
      trim: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    treatmentNotes: {
      type: String,
      trim: true,
    },
    isCritical: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
patientRecordSchema.index({ patientId: 1, date: -1 });
patientRecordSchema.index({ patientId: 1, testType: 1, date: -1 });
patientRecordSchema.index({ isCritical: 1, date: -1 });

// Pre-save middleware to check critical conditions
patientRecordSchema.pre('save', function (next) {
  // Determine if the reading is critical
  let critical = false;

  if (this.testType === 'BloodPressure' && this.value) {
    const [systolic, diastolic] = this.value.split('/').map(Number);
    if (!isNaN(systolic) && !isNaN(diastolic)) {
      critical = systolic >= 180 || diastolic >= 120 || systolic < 90 || diastolic < 60;
    }
  } else if (this.testType === 'HeartRate' && this.value) {
    const heartRate = parseFloat(this.value);
    critical = heartRate <= 50 || heartRate >= 120;
  } else if (this.testType === 'OxygenLevel' && this.value) {
    const oxygenLevel = parseFloat(this.value);
    critical = oxygenLevel < 90;
  } else if (this.testType === 'RespiratoryRate' && this.value) {
    const respiratoryRate = parseFloat(this.value);
    critical = respiratoryRate <= 10 || respiratoryRate >= 30;
  }

  // Check for critical symptoms
  const criticalSymptoms = ['fever', 'shortnessOfBreath'];
  const hasCriticalSymptom = this.symptoms.some((symptom) =>
    criticalSymptoms.includes(symptom.toLowerCase())
  );

  this.isCritical = critical || hasCriticalSymptom;
  next();
});

// Post-save middleware to update patient critical status
patientRecordSchema.post('save', async function () {
  try {
    const Patient = mongoose.model('Patient');
    
    // Check if any recent records are critical
    const criticalRecordCount = await mongoose.model('PatientRecord').countDocuments({
      patientId: this.patientId,
      isCritical: true,
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    });

    await Patient.findByIdAndUpdate(this.patientId, {
      isCritical: criticalRecordCount > 0,
    });
  } catch (error) {
    console.error('Error updating patient critical status:', error);
  }
});

module.exports = mongoose.model('PatientRecord', patientRecordSchema);
