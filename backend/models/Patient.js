const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
      trim: true,
      index: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function (v) {
          return v < new Date();
        },
        message: 'Date of birth must be in the past',
      },
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      match: [/^[0-9]{10}$/, 'Contact must be a 10-digit number'],
    },
    email: {
      type: String,
      default: 'N/A',
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v === 'N/A' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email address format',
      },
    },
    medicalHistory: {
      type: String,
      required: [true, 'Medical history is required'],
    },
    bloodPressure: {
      type: String,
      default: 'N/A',
    },
    heartRate: {
      type: String,
      default: 'N/A',
    },
    respiratoryRate: {
      type: String,
      default: 'N/A',
    },
    oxygenLevel: {
      type: String,
      default: 'N/A',
    },
    isCritical: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for age
patientSchema.virtual('age').get(function () {
  if (!this.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for patient records
patientSchema.virtual('records', {
  ref: 'PatientRecord',
  localField: '_id',
  foreignField: 'patientId',
});

// Indexes for performance
patientSchema.index({ name: 1 });
patientSchema.index({ isCritical: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });

// Pre-save middleware to update critical status
patientSchema.pre('save', function (next) {
  // Critical condition logic can be added here if needed
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
