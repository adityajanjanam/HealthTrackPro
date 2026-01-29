const { PatientRecord, Patient } = require('../models');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

/**
 * Create patient record(s)
 */
exports.createPatientRecord = asyncHandler(async (req, res) => {
  const { patientId, readings, symptoms, treatmentNotes, isCritical } = req.body;

  // Verify patient exists - Use lean() for read-only verification
  const patient = await Patient.findById(patientId).lean().select('_id');
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Create records for each reading
  const records = readings.map((reading) => ({
    patientId,
    testType: reading.testType,
    value: reading.value,
    symptoms: symptoms || [],
    treatmentNotes: treatmentNotes || '',
    isCritical: isCritical || false,
    recordedBy: req.userId,
  }));

  const createdRecords = await PatientRecord.insertMany(records);

  res.status(201).json({
    success: true,
    message: 'Patient records created successfully',
    data: {
      records: createdRecords,
      count: createdRecords.length,
    },
  });
});

/**
 * Get all patient records with filtering - Optimized for performance
 */
exports.getPatientRecords = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    patientId,
    testType,
    isCritical,
    startDate,
    endDate,
  } = req.query;

  // Build query
  const query = { isActive: true };

  if (patientId) {
    query.patientId = patientId;
  }

  if (testType) {
    query.testType = testType;
  }

  if (isCritical !== undefined) {
    query.isCritical = isCritical === 'true';
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Execute query with optimized populate (use lean in nested documents)
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    PatientRecord.find(query)
      .populate({
        path: 'patientId',
        select: 'name contact',
        options: { lean: true },
      })
      .populate({
        path: 'recordedBy',
        select: 'name email',
        options: { lean: true },
      })
      .lean() // Performance: Use lean() for read-only list queries
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit, 10)),
    PatientRecord.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      records,
      pagination: {
        currentPage: Number.parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: Number.parseInt(limit, 10),
      },
    },
  });
});

/**
 * Get patient records by patient ID - Optimized to prevent N+1 queries
 */
exports.getPatientRecordsByPatientId = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const records = await PatientRecord.find({
    patientId,
    isActive: true,
  })
    .populate({
      path: 'recordedBy',
      select: 'name email',
      options: { lean: true },
    })
    .lean() // Performance: Optimize for read-only operations
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: {
      records,
      count: records.length,
    },
  });
});

/**
 * Get a single record by ID
 */
exports.getRecordById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await PatientRecord.findById(id)
    .populate({
      path: 'patientId',
      select: 'name contact email',
      options: { lean: true },
    })
    .populate({
      path: 'recordedBy',
      select: 'name email',
      options: { lean: true },
    })
    .lean();

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      record,
    },
  });
});

/**
 * Update a patient record
 */
exports.updatePatientRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await PatientRecord.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Record updated successfully',
    data: {
      record,
    },
  });
});

/**
 * Delete a patient record (soft delete)
 */
exports.deletePatientRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await PatientRecord.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!record) {
    throw new AppError('Record not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Record deleted successfully',
  });
});

/**
 * Get critical records
 */
exports.getCriticalRecords = asyncHandler(async (req, res) => {
  const records = await PatientRecord.find({
    isCritical: true,
    isActive: true,
    date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
  })
    .populate('patientId', 'name contact')
    .sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: {
      records,
      count: records.length,
    },
  });
});

/**
 * Get patient record statistics
 */
exports.getRecordStatistics = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const stats = await PatientRecord.aggregate([
    {
      $match: {
        patientId: require('mongoose').Types.ObjectId(patientId),
        isActive: true,
      },
    },
    {
      $group: {
        _id: '$testType',
        count: { $sum: 1 },
        latestDate: { $max: '$date' },
        criticalCount: {
          $sum: { $cond: ['$isCritical', 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      statistics: stats,
    },
  });
});
