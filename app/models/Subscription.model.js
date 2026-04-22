const mongoose = require('mongoose');

const SubscriptionSchema = mongoose.Schema({
    subscriptionId: { type: String, required: true, unique: true },
    
    // Subscriber
    subscriberAddress: { type: String, required: true },
    subscriberName: String,
    subscriberEmail: String,
    
    // Tier (Circle of Support)
    tier: {
        type: String,
        enum: ['friend', 'guardian', 'elders_circle'],
        required: true
    },
    
    // Tier details
    tierDetails: {
        name: String,
        monthlyPrice: Number,
        annualPrice: Number,
        currency: { type: String, default: 'XRP' },
        benefits: [String]
    },
    
    // Billing
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
        default: 'monthly'
    },
    
    amount: { type: Number, required: true },
    
    // Allocations (where the money goes)
    allocations: {
        platformOperations: Number,
        legalDefenseFund: Number,      // $5 for Guardian+
        digitalArchive: Number,        // Portion for Pillar 7
        communityGrants: Number
    },
    
    // Status
    status: {
        type: String,
        enum: ['active', 'cancelled', 'paused', 'expired'],
        default: 'active'
    },
    
    // Dates
    startDate: Date,
    endDate: Date,
    nextBillingDate: Date,
    cancelledAt: Date,
    
    // Payment history
    payments: [{
        paymentId: String,
        amount: Number,
        date: Date,
        status: String,
        transactionHash: String
    }],
    
    // Benefits tracking
    benefitsUsed: {
        archiveViews: { type: Number, default: 0 },
        earlyAccessUsed: [{ type: String }],  // Entity IDs
        liveStreamsAttended: { type: Number, default: 0 },
        customVideosReceived: { type: Number, default: 0 }
    },
    
    // Gift subscription
    isGift: { type: Boolean, default: false },
    giftFrom: String,
    giftMessage: String,
    
    // Auto-renew
    autoRenew: { type: Boolean, default: true },
    
    // Cancellation reason
    cancellationReason: String
}, {
    timestamps: true
});

// Static fee structure
SubscriptionSchema.statics.TIERS = {
    friend: {
        name: 'Friend of the Circle',
        monthlyPrice: 5,
        annualPrice: 50,
        benefits: [
            'Ad-free browsing',
            'Basic archive access',
            'Monthly newsletter'
        ],
        allocations: {
            platformOperations: 0.70,
            legalDefenseFund: 0,
            digitalArchive: 0.20,
            communityGrants: 0.10
        }
    },
    guardian: {
        name: 'Guardian',
        monthlyPrice: 15,
        annualPrice: 150,
        benefits: [
            'Ad-free browsing',
            'Full archive access',
            'Monthly newsletter',
            'Early access (24h)',
            'Quarterly live streams',
            'Legal Defense contribution'
        ],
        allocations: {
            platformOperations: 0.50,
            legalDefenseFund: 0.33,  // $5 of $15
            digitalArchive: 0.10,
            communityGrants: 0.07
        }
    },
    elders_circle: {
        name: "Elder's Circle",
        monthlyPrice: 50,
        annualPrice: 500,
        benefits: [
            'Ad-free browsing',
            'Full archive access',
            'Monthly newsletter',
            'Early access (24h)',
            'Quarterly live streams',
            'Exclusive documentaries',
            'Virtual event invitations',
            'Personalized thank-you video'
        ],
        allocations: {
            platformOperations: 0.40,
            legalDefenseFund: 0.20,
            digitalArchive: 0.20,
            communityGrants: 0.20
        }
    }
};

SubscriptionSchema.index({ subscriberAddress: 1, status: 1 });
SubscriptionSchema.index({ tier: 1, status: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);
