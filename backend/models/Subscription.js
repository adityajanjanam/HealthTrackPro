const mongoose = require('mongoose');

/**
 * Subscription Schema - Monetization & Business Model
 * Tiers: FREE, BASIC, PROFESSIONAL, ENTERPRISE
 */
const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    tier: {
      type: String,
      enum: ['FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE'],
      default: 'FREE',
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'TRIAL', 'PAST_DUE'],
      default: 'ACTIVE',
      required: true,
    },
    stripeCustomerId: {
      type: String,
      sparse: true,
    },
    stripeSubscriptionId: {
      type: String,
      sparse: true,
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now,
    },
    currentPeriodEnd: {
      type: Date,
      default: function () {
        const now = new Date();
        return new Date(now.setMonth(now.getMonth() + 1));
      },
    },
    trialEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    limits: {
      maxPatients: {
        type: Number,
        default: 10, // FREE tier limit
      },
      maxRecordsPerMonth: {
        type: Number,
        default: 100,
      },
      maxUsers: {
        type: Number,
        default: 1,
      },
      maxStorageGB: {
        type: Number,
        default: 1,
      },
      apiRateLimit: {
        type: Number,
        default: 100, // requests per hour
      },
    },
    usage: {
      currentPatients: {
        type: Number,
        default: 0,
      },
      recordsThisMonth: {
        type: Number,
        default: 0,
      },
      storageUsedGB: {
        type: Number,
        default: 0,
      },
      lastResetDate: {
        type: Date,
        default: Date.now,
      },
    },
    paymentHistory: [
      {
        amount: Number,
        currency: String,
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
        invoiceId: String,
      },
    ],
    features: {
      analytics: {
        type: Boolean,
        default: false,
      },
      advancedReporting: {
        type: Boolean,
        default: false,
      },
      multiUser: {
        type: Boolean,
        default: false,
      },
      apiAccess: {
        type: Boolean,
        default: false,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
      customBranding: {
        type: Boolean,
        default: false,
      },
      dataExport: {
        type: Boolean,
        default: true,
      },
      mobileApp: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ tier: 1, status: 1 });
subscriptionSchema.index({ currentPeriodEnd: 1 });
subscriptionSchema.index({ stripeCustomerId: 1 });

// Static method to get tier limits
subscriptionSchema.statics.getTierLimits = function (tier) {
  const limits = {
    FREE: {
      maxPatients: 10,
      maxRecordsPerMonth: 100,
      maxUsers: 1,
      maxStorageGB: 1,
      apiRateLimit: 100,
      price: 0,
      features: {
        analytics: false,
        advancedReporting: false,
        multiUser: false,
        apiAccess: false,
        prioritySupport: false,
        customBranding: false,
        dataExport: true,
        mobileApp: true,
      },
    },
    BASIC: {
      maxPatients: 50,
      maxRecordsPerMonth: 1000,
      maxUsers: 3,
      maxStorageGB: 5,
      apiRateLimit: 500,
      price: 29.99,
      features: {
        analytics: true,
        advancedReporting: false,
        multiUser: true,
        apiAccess: false,
        prioritySupport: false,
        customBranding: false,
        dataExport: true,
        mobileApp: true,
      },
    },
    PROFESSIONAL: {
      maxPatients: 200,
      maxRecordsPerMonth: 5000,
      maxUsers: 10,
      maxStorageGB: 20,
      apiRateLimit: 2000,
      price: 79.99,
      features: {
        analytics: true,
        advancedReporting: true,
        multiUser: true,
        apiAccess: true,
        prioritySupport: true,
        customBranding: false,
        dataExport: true,
        mobileApp: true,
      },
    },
    ENTERPRISE: {
      maxPatients: -1, // unlimited
      maxRecordsPerMonth: -1,
      maxUsers: -1,
      maxStorageGB: 100,
      apiRateLimit: 10000,
      price: 299.99,
      features: {
        analytics: true,
        advancedReporting: true,
        multiUser: true,
        apiAccess: true,
        prioritySupport: true,
        customBranding: true,
        dataExport: true,
        mobileApp: true,
      },
    },
  };
  return limits[tier] || limits.FREE;
};

// Instance method to check if limit exceeded
subscriptionSchema.methods.checkLimit = function (limitType) {
  const limit = this.limits[limitType];
  const usage = this.usage[limitType.replace('max', 'current')];
  
  if (limit === -1) return true; // Unlimited
  return usage < limit;
};

// Instance method to update usage
subscriptionSchema.methods.incrementUsage = async function (usageType) {
  this.usage[usageType] += 1;
  await this.save();
};

// Reset monthly usage
subscriptionSchema.methods.resetMonthlyUsage = async function () {
  this.usage.recordsThisMonth = 0;
  this.usage.lastResetDate = new Date();
  await this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
