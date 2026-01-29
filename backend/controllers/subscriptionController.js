const Subscription = require('../models/Subscription');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AuditLog = require('../models/AuditLog');

/**
 * Get subscription details
 */
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    await AuditLog.log({
      userId: req.user.id,
      action: 'READ',
      resourceType: 'SUBSCRIPTION',
      resourceId: subscription._id,
      success: true,
    });

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get available plans
 */
exports.getPlans = async (req, res) => {
  try {
    const plans = {
      FREE: Subscription.getTierLimits('FREE'),
      BASIC: Subscription.getTierLimits('BASIC'),
      PROFESSIONAL: Subscription.getTierLimits('PROFESSIONAL'),
      ENTERPRISE: Subscription.getTierLimits('ENTERPRISE'),
    };

    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Upgrade subscription
 */
exports.upgradeSubscription = async (req, res) => {
  try {
    const { tier } = req.body;

    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    const oldTier = subscription.tier;

    // Create or update Stripe customer
    let customerId = subscription.stripeCustomerId;
    const user = await User.findById(req.user.id);

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: req.user.id },
      });
      customerId = customer.id;
    }

    // Create subscription
    const tierLimits = Subscription.getTierLimits(tier);
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: process.env[`STRIPE_${tier}_PRICE_ID`],
        },
      ],
      metadata: { userId: req.user.id, tier },
    });

    // Update subscription in database
    subscription.tier = tier;
    subscription.status = 'ACTIVE';
    subscription.stripeCustomerId = customerId;
    subscription.stripeSubscriptionId = stripeSubscription.id;
    subscription.currentPeriodStart = new Date();
    subscription.currentPeriodEnd = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    );
    subscription.limits = tierLimits;

    await subscription.save();

    await AuditLog.log({
      userId: req.user.id,
      action: 'UPDATE',
      resourceType: 'SUBSCRIPTION',
      resourceId: subscription._id,
      changes: {
        before: { tier: oldTier },
        after: { tier: subscription.tier },
      },
      success: true,
      severity: 'MEDIUM',
    });

    res.status(200).json({
      success: true,
      message: `Upgraded to ${tier} plan`,
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Cancel subscription
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.del(subscription.stripeSubscriptionId);
    }

    subscription.status = 'CANCELLED';
    subscription.cancelAtPeriodEnd = false;

    await subscription.save();

    await AuditLog.log({
      userId: req.user.id,
      action: 'UPDATE',
      resourceType: 'SUBSCRIPTION',
      resourceId: subscription._id,
      changes: {
        before: { status: 'ACTIVE' },
        after: { status: 'CANCELLED' },
      },
      success: true,
      severity: 'HIGH',
    });

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled',
      data: subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Check usage against limits
 */
exports.checkUsage = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    const usage = {
      patients: {
        used: subscription.usage.currentPatients,
        limit: subscription.limits.maxPatients,
        percentage:
          (subscription.usage.currentPatients /
            subscription.limits.maxPatients) *
          100,
      },
      records: {
        used: subscription.usage.recordsThisMonth,
        limit: subscription.limits.maxRecordsPerMonth,
        percentage:
          (subscription.usage.recordsThisMonth /
            subscription.limits.maxRecordsPerMonth) *
          100,
      },
      storage: {
        used: subscription.usage.storageUsedGB,
        limit: subscription.limits.maxStorageGB,
        percentage:
          (subscription.usage.storageUsedGB /
            subscription.limits.maxStorageGB) *
          100,
      },
    };

    res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
