const Analytics = require('../models/Analytics');
const AuditLog = require('../models/AuditLog');
const PatientRecord = require('../models/PatientRecord');

/**
 * Get dashboard analytics
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const metrics = await Analytics.getDashboardMetrics(req.user.id, parseInt(days));

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get activity report
 */
exports.getActivityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const activity = await Analytics.getUserActivity(
      req.user.id,
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({
      success: true,
      data: {
        period: { startDate, endDate },
        activity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get patient statistics
 */
exports.getPatientStats = async (req, res) => {
  try {
    const stats = await PatientRecord.aggregate([
      {
        $match: {
          createdBy: req.user.id,
        },
      },
      {
        $group: {
          _id: '$patientId',
          recordCount: { $sum: 1 },
          avgBP: {
            $avg: {
              $cond: [
                { $eq: ['$testType', 'Blood Pressure'] },
                '$value',
                null,
              ],
            },
          },
          avgHeartRate: {
            $avg: {
              $cond: [
                { $eq: ['$testType', 'Heart Rate'] },
                '$value',
                null,
              ],
            },
          },
          criticalCount: {
            $sum: { $cond: ['$isCritical', 1, 0] },
          },
        },
      },
      {
        $sort: { recordCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get critical alerts summary
 */
exports.getCriticalAlertsSummary = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const alerts = await Analytics.aggregate([
      {
        $match: {
          userId: req.user.id,
          eventType: 'CRITICAL_ALERT',
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: `${days} days`,
        alerts,
        totalAlerts: alerts.reduce((sum, a) => sum + a.count, 0),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Track event
 */
exports.trackEvent = async (req, res) => {
  try {
    const { eventType, metadata } = req.body;

    await Analytics.trackEvent(req.user.id, eventType, metadata);

    res.status(201).json({
      success: true,
      message: 'Event tracked',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Export analytics report
 */
exports.exportAnalyticsReport = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    const activity = await Analytics.getUserActivity(
      req.user.id,
      new Date(startDate),
      new Date(endDate)
    );

    const metrics = await Analytics.getDashboardMetrics(req.user.id);

    const report = {
      generatedAt: new Date(),
      period: { startDate, endDate },
      metrics,
      activity,
    };

    if (format === 'csv') {
      // Generate CSV format
      let csv = 'Event Type,Count\n';
      activity.forEach((item) => {
        csv += `${item._id},${item.count}\n`;
      });

      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename=analytics.csv');
      res.send(csv);
    } else {
      res.status(200).json({
        success: true,
        data: report,
      });
    }

    // Log the export
    await AuditLog.log({
      userId: req.user.id,
      action: 'EXPORT',
      resourceType: 'REPORT',
      resourceId: 'analytics',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get performance metrics
 */
exports.getPerformanceMetrics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // API performance
    const apiMetrics = await Analytics.aggregate([
      {
        $match: {
          userId: req.user.id,
          eventType: 'API_CALL',
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalCalls: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          successCount: { $sum: { $cond: ['$success', 1, 0] } },
          errorCount: { $sum: { $cond: ['$success', 0, 1] } },
        },
      },
    ]);

    // User engagement
    const engagement = await Analytics.aggregate([
      {
        $match: {
          userId: req.user.id,
          eventType: { $in: ['USER_LOGIN', 'USER_LOGOUT'] },
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        api: apiMetrics[0] || {},
        engagement,
        period: `${days} days`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
