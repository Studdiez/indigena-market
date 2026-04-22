/**
 * Subscription Controller
 * API endpoints for membership and subscription management
 */

const subscriptionService = require('../services/subscription.service.js');

// Get all available plans
exports.getPlans = async (req, res) => {
    try {
        const { category } = req.query;
        
        let plans;
        if (category) {
            plans = subscriptionService.getPlansByCategory(category);
        } else {
            plans = subscriptionService.getAllPlans();
        }
        
        res.status(200).json({
            success: true,
            count: plans.length,
            plans
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single plan details
exports.getPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const plan = subscriptionService.getPlan(planId);
        
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }
        
        res.status(200).json({
            success: true,
            plan
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Calculate price with options
exports.calculatePrice = async (req, res) => {
    try {
        const { planId } = req.params;
        const { isAnnual, paymentMethod } = req.body;
        
        const pricing = subscriptionService.calculatePrice(planId, {
            isAnnual,
            paymentMethod
        });
        
        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }
        
        res.status(200).json({
            success: true,
            pricing
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create subscription
exports.createSubscription = async (req, res) => {
    try {
        const { planId } = req.params;
        const userId = req.user.id; // From auth middleware
        const { isAnnual, paymentMethod, paymentToken } = req.body;
        
        const subscription = await subscriptionService.createSubscription(
            userId,
            planId,
            { isAnnual, paymentMethod, paymentToken }
        );
        
        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's subscriptions
exports.getMySubscriptions = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptions = subscriptionService.getUserSubscriptions(userId);
        
        res.status(200).json({
            success: true,
            count: subscriptions.length,
            subscriptions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const userId = req.user.id;
        
        // Verify subscription belongs to user
        const subscription = await subscriptionService.cancelSubscription(subscriptionId);
        
        if (subscription.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Subscription cancelled successfully',
            subscription
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check feature access
exports.checkFeature = async (req, res) => {
    try {
        const userId = req.user.id;
        const { feature } = req.params;
        
        const hasAccess = subscriptionService.hasFeature(userId, feature);
        
        res.status(200).json({
            success: true,
            feature,
            hasAccess
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's fee rate (for creators)
exports.getMyFeeRate = async (req, res) => {
    try {
        const userId = req.user.id;
        const feeRate = subscriptionService.getUserFeeRate(userId);
        
        res.status(200).json({
            success: true,
            feeRate,
            message: `Your current transaction fee rate is ${feeRate}%`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check buyer fees status
exports.getBuyerFeesStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const waived = subscriptionService.hasBuyerFeesWaived(userId);
        
        res.status(200).json({
            success: true,
            buyerFeesWaived: waived,
            message: waived ? 'You have 0% buyer fees' : 'Standard buyer fees apply'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
