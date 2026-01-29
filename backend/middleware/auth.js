const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing or invalid.',
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user?.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User not found or inactive.',
      });
    }

    req.user = user;
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh your token.',
        code: 'TOKEN_EXPIRED',
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    console.error('Authentication error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

/**
 * Middleware to check user role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user?.isActive) {
        req.user = user;
        req.userId = decoded.id;
      }
    }
  } catch (err) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', err.message);
  }
  
  next();
};

module.exports = {
  authenticateToken,
  authorize,
  optionalAuth,
};
