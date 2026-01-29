const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

// All subscription routes require authentication
router.use(auth);

/**
 * GET /api/subscriptions
 * Get user's subscription details
 */
router.get('/', subscriptionController.getSubscription);

/**
 * GET /api/subscriptions/plans
 * Get available plans
 */
router.get('/plans', subscriptionController.getPlans);

/**
 * POST /api/subscriptions/upgrade
 * Upgrade subscription to a new tier
 */
router.post('/upgrade', subscriptionController.upgradeSubscription);

/**
 * POST /api/subscriptions/cancel
 * Cancel subscription
 */
router.post('/cancel', subscriptionController.cancelSubscription);

/**
 * GET /api/subscriptions/usage
 * Check usage against limits
 */
router.get('/usage', subscriptionController.checkUsage);

module.exports = router;
