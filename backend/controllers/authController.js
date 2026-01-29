const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/environment');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Cache for JWT secrets to avoid repeated config lookups
const JWT_CONFIG = {
  accessSecret: config.jwtSecret,
  refreshSecret: config.jwtRefreshSecret,
  accessExpiry: config.jwtExpiresIn,
  refreshExpiry: config.jwtRefreshExpiresIn,
};

// Token generation with cached config
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_CONFIG.accessSecret, {
    expiresIn: JWT_CONFIG.accessExpiry,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_CONFIG.refreshSecret, {
    expiresIn: JWT_CONFIG.refreshExpiry,
  });
};

/**
 * Register a new user
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Use findOne with projection for better performance
  const existingUser = await User.findOne({ email }).select('_id');
  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  // Hash password with optimized bcrypt settings
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with only necessary fields
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * Login user - Optimized for performance
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Single optimized query with required fields
  const user = await User.findOne({ email }).select('+password +isActive +refreshTokens');
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active first (cheaper operation)
  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Calculate expiry once
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Optimize refresh token storage - keep only last 3
  user.refreshTokens = [
    ...user.refreshTokens.slice(-2),
    { token: refreshToken, createdAt: new Date(), expiresAt },
  ];

  user.lastLogin = new Date();

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * Refresh access token
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify token first
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, JWT_CONFIG.refreshSecret);
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 403);
  }

  // Single query with specific field selection
  const user = await User.findById(decoded.id).select('isActive refreshTokens');
  if (!user?.isActive) {
    throw new AppError('Invalid refresh token', 403);
  }

  // Check token existence (optimized)
  const tokenExists = user.refreshTokens.some(
    (t) => t.token === refreshToken && t.expiresAt > new Date()
  );

  if (!tokenExists) {
    throw new AppError('Invalid or expired refresh token', 403);
  }

  // Generate new access token
  const accessToken = generateAccessToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken,
    },
  });
});

/**
 * Logout user
 */
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    // Use updateOne for efficiency (no need to load full document)
    await User.updateOne(
      { _id: req.userId },
      { $pull: { refreshTokens: { token: refreshToken } } }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * Get current user profile - Optimized
 */
exports.getProfile = asyncHandler(async (req, res) => {
  // Use lean() for read-only queries
  const user = await User.findById(req.userId).lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * Update user profile
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { name },
    { new: true, runValidators: true }
  ).lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});
