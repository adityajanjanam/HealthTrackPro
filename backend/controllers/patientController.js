const { Patient } = require('../models');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

/**
 * Create a new patient
 */
exports.createPatient = asyncHandler(async (req, res) => {
  const patientData = {
    ...req.body,
    createdBy: req.userId,
  };

  const patient = new Patient(patientData);
  await patient.save();

  res.status(201).json({
    success: true,
    message: 'Patient created successfully',
    data: {
      patient,
    },
  });
});

/**
 * Get all patients with pagination and filtering - Optimized for performance
 */
exports.getPatients = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
    isCritical,
  } = req.query;

  // Build query
  const query = { isActive: true };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (isCritical !== undefined) {
    query.isCritical = isCritical === 'true';
  }

  // Execute query with pagination - Optimize with lean() for read-only operations
  const skip = (page - 1) * limit;
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [patients, total] = await Promise.all([
    Patient.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number.parseInt(limit, 10))
      .lean() // Performance: Don't hydrate Mongoose documents for read-only queries
      .select('-__v'),
    Patient.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      patients,
      pagination: {
        currentPage: Number.parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        totalPatients: total,
        limit: Number.parseInt(limit, 10),
      },
    },
  });
});

/**
 * Get a single patient by ID - Optimized to avoid N+1 queries
 */
exports.getPatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Optimize with lean() for read-only and avoid unnecessary hydration
  const patient = await Patient.findById(id)
    .populate({
      path: 'records',
      select: '-__v', // Only select needed fields
      options: {
        lean: true, // Performance: Get plain objects, not full Mongoose documents
      },
    })
    .lean()
    .select('-__v');

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      patient,
    },
  });
});

/**
 * Update patient information
 */
exports.updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findByIdAndUpdate(
    id,
    {
      ...req.body,
      updatedBy: req.userId,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Patient updated successfully',
    data: {
      patient,
    },
  });
});

/**
 * Delete patient (soft delete)
 */
exports.deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const patient = await Patient.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Patient deleted successfully',
  });
});

/**
 * Get critical patients
 */
exports.getCriticalPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({
    isCritical: true,
    isActive: true,
  })
    .sort({ updatedAt: -1 })
    .select('-__v');

  res.status(200).json({
    success: true,
    data: {
      patients,
      count: patients.length,
    },
  });
});

/**
 * Get patient statistics
 */
exports.getStatistics = asyncHandler(async (req, res) => {
  const [totalPatients, criticalPatients, activePatients] = await Promise.all([
    Patient.countDocuments({ isActive: true }),
    Patient.countDocuments({ isCritical: true, isActive: true }),
    Patient.countDocuments({ isActive: true }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalPatients,
      criticalPatients,
      activePatients,
      stablePatients: activePatients - criticalPatients,
    },
  });
});
