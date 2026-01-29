const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const recordRoutes = require('./recordRoutes');
const oauthRoutes = require('./oauthRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
const analyticsRoutes = require('./analyticsRoutes');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/oauth', oauthRoutes);
router.use('/patients', patientRoutes);
router.use('/records', recordRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
