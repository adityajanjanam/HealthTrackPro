const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const {
  validate,
  validateQuery,
  schemas,
  authenticateToken,
} = require('../middleware');

/**
 * @route   POST /api/patients
 * @desc    Create a new patient
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  validate(schemas.createPatient),
  patientController.createPatient
);

/**
 * @route   GET /api/patients
 * @desc    Get all patients with pagination and filtering
 * @access  Private
 */
router.get(
  '/',
  authenticateToken,
  validateQuery(schemas.paginationQuery),
  patientController.getPatients
);

/**
 * @route   GET /api/patients/statistics
 * @desc    Get patient statistics
 * @access  Private
 */
router.get(
  '/statistics',
  authenticateToken,
  patientController.getStatistics
);

/**
 * @route   GET /api/patients/critical
 * @desc    Get critical patients
 * @access  Private
 */
router.get(
  '/critical',
  authenticateToken,
  patientController.getCriticalPatients
);

/**
 * @route   GET /api/patients/:id
 * @desc    Get a single patient by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, patientController.getPatientById);

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient information
 * @access  Private
 */
router.put(
  '/:id',
  authenticateToken,
  validate(schemas.updatePatient),
  patientController.updatePatient
);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient (soft delete)
 * @access  Private
 */
router.delete('/:id', authenticateToken, patientController.deletePatient);

module.exports = router;
