const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const {
  validate,
  validateQuery,
  schemas,
  authenticateToken,
} = require('../middleware');

/**
 * @route   POST /api/records
 * @desc    Create patient record(s)
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  validate(schemas.createPatientRecord),
  recordController.createPatientRecord
);

/**
 * @route   GET /api/records
 * @desc    Get all patient records with filtering
 * @access  Private
 */
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.paginationQuery),
  recordController.getPatientRecords
);

/**
 * @route   GET /api/records/critical
 * @desc    Get critical records from last 24 hours
 * @access  Private
 */
router.get(
  '/critical',
  authenticateToken,
  recordController.getCriticalRecords
);

/**
 * @route   GET /api/records/patient/:patientId
 * @desc    Get all records for a specific patient
 * @access  Private
 */
router.get(
  '/patient/:patientId',
  authenticateToken,
  recordController.getPatientRecordsByPatientId
);

/**
 * @route   GET /api/records/patient/:patientId/statistics
 * @desc    Get record statistics for a patient
 * @access  Private
 */
router.get(
  '/patient/:patientId/statistics',
  authenticateToken,
  recordController.getRecordStatistics
);

/**
 * @route   GET /api/records/:id
 * @desc    Get a single record by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, recordController.getRecordById);

/**
 * @route   PUT /api/records/:id
 * @desc    Update a patient record
 * @access  Private
 */
router.put('/:id', authenticateToken, recordController.updatePatientRecord);

/**
 * @route   DELETE /api/records/:id
 * @desc    Delete a patient record (soft delete)
 * @access  Private
 */
router.delete('/:id', authenticateToken, recordController.deletePatientRecord);

module.exports = router;
