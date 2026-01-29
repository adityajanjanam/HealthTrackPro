const config = require('../config/environment');

// Cache status color codes to avoid recalculation
const STATUS_COLORS = {
  success: '🟢',
  warning: '🟡',
  error: '🔴',
};

const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return STATUS_COLORS.error;
  if (statusCode >= 400) return STATUS_COLORS.warning;
  return STATUS_COLORS.success;
};

/**
 * Logger middleware - Optimized to minimize allocation per request
 */
const logger = (req, res, next) => {
  // Use performance.now() for higher precision without Date overhead
  const start = process.hrtime.bigint();

  // Log after response is finished
  res.on('finish', () => {
    // Calculate duration in milliseconds
    const duration = Number(process.hrtime.bigint() - start) / 1_000_000;

    // Reuse status color lookup (cached)
    const statusColor = getStatusColor(res.statusCode);

    // Optimize logging with minimal object allocation
    console.log(
      `${statusColor} [${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration.toFixed(2)}ms`
    );

    // Extended logging only if in development
    if (config.nodeEnv === 'development') {
      const logObject = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration.toFixed(2)}ms`,
      };

      if (req.user) {
        logObject.userId = req.user._id;
        logObject.userEmail = req.user.email;
      }

      console.debug(logObject);
    }
  });

  next();
};

/**
 * Request ID middleware - Optimized
 */
const requestId = (req, res, next) => {
  // Generate unique request ID using timestamp and random string
  req.id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
};

module.exports = {
  logger,
  requestId,
};
