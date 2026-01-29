require('dotenv').config();

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/healthtrackpro',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:19000', 'http://10.0.2.2:19000'],
  
  // Rate Limiting
  rateLimitWindowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  rateLimitMaxRequests: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Validation
  isProduction: () => config.nodeEnv === 'production',
  isDevelopment: () => config.nodeEnv === 'development',
};

// Validate required environment variables in production
if (config.isProduction()) {
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

module.exports = config;
