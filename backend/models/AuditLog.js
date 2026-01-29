const mongoose = require('mongoose');

/**
 * Audit Log Schema - Compliance and security tracking
 * HIPAA-compliant audit trail
 */
const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        'CREATE',
        'READ',
        'UPDATE',
        'DELETE',
        'LOGIN',
        'LOGOUT',
        'PERMISSION_CHANGE',
        'EXPORT',
        'IMPORT',
        'SHARE',
      ],
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      enum: ['USER', 'PATIENT', 'RECORD', 'SUBSCRIPTION', 'SETTINGS', 'REPORT'],
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
      required: true,
    },
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: String,
    userAgent: String,
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: String,
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });

// TTL index - keep audit logs for 7 years (HIPAA compliance)
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 220752000 });

// Static method to create audit log entry
auditLogSchema.statics.log = async function (data) {
  try {
    await this.create(data);
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

// Static method to get audit trail for a resource
auditLogSchema.statics.getResourceAudit = async function (
  resourceType,
  resourceId,
  limit = 50
) {
  return await this.find({ resourceType, resourceId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .lean();
};

// Static method to get user activity audit
auditLogSchema.statics.getUserAudit = async function (
  userId,
  startDate,
  endDate,
  limit = 100
) {
  const query = {
    userId,
  };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }

  return await this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
