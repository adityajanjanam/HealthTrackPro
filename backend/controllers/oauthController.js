const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');

// Generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new AppError('Authentication failed', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(req.user._id);
  const refreshToken = generateRefreshToken(req.user._id);

  // Store refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  req.user.refreshTokens.push({
    token: refreshToken,
    expiresAt,
  });
  await req.user.save();

  // For mobile app, return tokens as JSON
  // For web, you might redirect with tokens in query params or set cookies
  res.json({
    success: true,
    message: 'Google authentication successful',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profilePicture: req.user.profilePicture,
        authProvider: req.user.authProvider,
      },
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Mobile OAuth login (exchange code for tokens)
// @route   POST /api/auth/oauth/google
// @access  Public
exports.mobileGoogleAuth = asyncHandler(async (req, res) => {
  const { email, name, picture, googleId } = req.body;

  if (!googleId || !email) {
    throw new AppError('Google ID and email are required', 400);
  }

  // Find or create user
  let user = await User.findOne({ googleId });

  if (user) {
    // Update existing user
    user.lastLogin = new Date();
    if (picture) user.profilePicture = picture;
    if (name) user.name = name;
    await user.save();
  } else {
    // Check if user exists with same email
    user = await User.findOne({ email });

    if (user) {
      // Link Google account
      user.googleId = googleId;
      user.authProvider = 'google';
      user.profilePicture = picture;
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        googleId,
        email,
        name: name || email.split('@')[0],
        profilePicture: picture,
        authProvider: 'google',
        isVerified: true,
        role: 'user',
        lastLogin: new Date(),
      });
    }
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  user.refreshTokens.push({
    token: refreshToken,
    expiresAt,
  });
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Google authentication successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
      },
      accessToken,
      refreshToken,
    },
  });
});
