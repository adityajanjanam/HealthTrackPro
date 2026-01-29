const mongoose = require('mongoose');

/**
 * Analytics Schema - Track usage metrics and business intelligence
 */
const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        'USER_LOGIN',
        'USER_LOGOUT',
        'PATIENT_CREATED',
        'PATIENT_VIEWED',
        'PATIENT_UPDATED',
        'PATIENT_DELETED',
        'RECORD_CREATED',
        'RECORD_VIEWED',
        'RECORD_UPDATED',
        'RECORD_DELETED',
        'CRITICAL_ALERT',
        'REPORT_GENERATED',
        'DATA_EXPORT',
        'API_CALL',
        'ERROR_OCCURRED',
      ],
      required: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    duration: Number, // milliseconds
    success: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for analytics queries
analyticsSchema.index({ userId: 1, eventType: 1, timestamp: -1 });
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1, timestamp: -1 });

// TTL index - auto-delete analytics older than 1 year
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

// Static method to track event
analyticsSchema.statics.trackEvent = async function (userId, eventType, metadata = {}) {
  try {
    await this.create({
      userId,
      eventType,
      metadata,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Static method to get user activity summary
analyticsSchema.statics.getUserActivity = async function (userId, startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId.isValid(userId)
          ? new mongoose.Types.ObjectId(String(userId))
          : null,
        timestamp: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// Static method for dashboard metrics
analyticsSchema.statics.getDashboardMetrics = async function (userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [activity, criticalAlerts, totalEvents] = await Promise.all([
    this.getUserActivity(userId, startDate, new Date()),
    this.countDocuments({
      userId,
      eventType: 'CRITICAL_ALERT',
      timestamp: { $gte: startDate },
    }),
    this.countDocuments({
      userId,
      timestamp: { $gte: startDate },
    }),
  ]);

  return {
    totalEvents,
    criticalAlerts,
    activityBreakdown: activity,
    period: `${days} days`,
  };
};

module.exports = mongoose.model('Analytics', analyticsSchema);
