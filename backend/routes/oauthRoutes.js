const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { googleCallback, mobileGoogleAuth } = require('../controllers/oauthController');

// Google OAuth routes (for web/testing)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  googleCallback
);

// Mobile OAuth route (React Native/Expo)
router.post('/google/mobile', mobileGoogleAuth);

module.exports = router;
