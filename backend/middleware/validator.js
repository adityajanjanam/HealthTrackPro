const Joi = require('joi');

/**
 * Validate request body against a Joi schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Validation schemas
 */
const schemas = {
  // User schemas
  registerUser: Joi.object({
    name: Joi.string().min(3).max(100).required().trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().min(6).max(100).required(),
  }),

  loginUser: Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  // Patient schemas
  createPatient: Joi.object({
    name: Joi.string().min(3).max(100).required().trim(),
    dob: Joi.date().max('now').required(),
    contact: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email().optional().lowercase().trim(),
    medicalHistory: Joi.string().min(10).max(1000).required(),
  }),

  updatePatient: Joi.object({
    name: Joi.string().min(3).max(100).optional().trim(),
    dob: Joi.date().max('now').optional(),
    contact: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    email: Joi.string().email().optional().lowercase().trim(),
    medicalHistory: Joi.string().min(10).max(1000).optional(),
    bloodPressure: Joi.string().optional(),
    heartRate: Joi.string().optional(),
    respiratoryRate: Joi.string().optional(),
    oxygenLevel: Joi.string().optional(),
    isCritical: Joi.boolean().optional(),
  }),

  // Patient record schemas
  createPatientRecord: Joi.object({
    patientId: Joi.string().required(),
    readings: Joi.array()
      .items(
        Joi.object({
          testType: Joi.string()
            .valid('BloodPressure', 'HeartRate', 'RespiratoryRate', 'OxygenLevel')
            .required(),
          value: Joi.string().required().trim(),
        })
      )
      .min(1)
      .required(),
    symptoms: Joi.array().items(Joi.string()).optional(),
    treatmentNotes: Joi.string().max(1000).optional().trim(),
    isCritical: Joi.boolean().optional(),
  }),

  // Query parameter schemas
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    search: Joi.string().optional(),
  }),
};

/**
 * Validate query parameters
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  schemas,
};
