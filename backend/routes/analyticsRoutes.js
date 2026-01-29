const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All analytics routes require authentication
router.use(auth);

/**
 * GET /api/analytics/dashboard
 * Get dashboard analytics and metrics
 */
router.get('/dashboard', analyticsController.getDashboardAnalytics);

/**
 * GET /api/analytics/activity
 * Get activity report for a date range
 */
router.get('/activity', analyticsController.getActivityReport);

/**
 * GET /api/analytics/patients
 * Get patient statistics
 */
router.get('/patients', analyticsController.getPatientStats);

/**
 * GET /api/analytics/alerts
 * Get critical alerts summary
 */
router.get('/alerts', analyticsController.getCriticalAlertsSummary);

/**
 * GET /api/analytics/performance
 * Get performance metrics
 */
router.get('/performance', analyticsController.getPerformanceMetrics);

/**
 * POST /api/analytics/event
 * Track custom event
 */
router.post('/event', analyticsController.trackEvent);

/**
 * GET /api/analytics/export
 * Export analytics report
 */
router.get('/export', analyticsController.exportAnalyticsReport);

module.exports = router;
