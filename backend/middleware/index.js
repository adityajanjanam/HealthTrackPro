const { authenticateToken, authorize, optionalAuth } = require('./auth');
const { validate, validateQuery, schemas } = require('./validator');
const { errorHandler, notFound, AppError, asyncHandler } = require('./errorHandler');
const { generalLimiter, authLimiter, passwordResetLimiter } = require('./rateLimiter');
const { logger, requestId } = require('./logger');

module.exports = {
  // Auth
  authenticateToken,
  authorize,
  optionalAuth,
  
  // Validation
  validate,
  validateQuery,
  schemas,
  
  // Error handling
  errorHandler,
  notFound,
  AppError,
  asyncHandler,
  
  // Rate limiting
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  
  // Logging
  logger,
  requestId,
};
