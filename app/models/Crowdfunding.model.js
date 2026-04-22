const mongoose = require('mongoose');

const CrowdfundingSchema = mongoose.Schema({
    campaignId: { type: String, required: true, unique: true },
    
    // Campaign creator
    creatorAddress: { type: String, required: true },
    creatorName: String,
    community: String,
    nation: String,
    
    // Campaign details
    title: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: [
            'equipment',           // loom, tools, cameras
            'infrastructure',      // community center, workshop
            'education',           // scholarships, training
            'preservation',        // language, cultural documentation
            'emergency',           // disaster relief, urgent needs
            'event',               // festival, gathering
            'land',                // land purchase, conservation
            'health',              // health initiatives
            'other'
        ]
    },
    
    // Funding goal
    targetAmount: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    minimumContribution: { type: Number, default: 1 },
    
    // Current status
    currentAmount: { type: Number, default: 0 },
    contributorCount: { type: Number, default: 0 },
    
    // Timeline
    startDate: Date,
    endDate: Date,
    
    // Status
    status: {
        type: String,
        enum: ['draft', 'active', 'funded', 'expired', 'cancelled'],
        default: 'draft'
    },
    
    // Media
    coverImage: String,
    images: [String],
    videoUrl: String,
    
    // Rewards for contributors
    rewards: [{
        tierId: String,
        minContribution: Number,
        title: String,
        description: String,
        rewardType: String,      // 'digital', 'physical', 'experience', 'recognition'
        estimatedDelivery: Date,
        quantity: Number,        // Limited quantity or null for unlimited
        claimed: { type: Number, default: 0 }
    }],
    
    // Updates
    updates: [{
        updateId: String,
        date: Date,
        title: String,
        content: String,
        images: [String],
        isPublic: { type: Boolean, default: true }
    }],
    
    // Contributions
    contributions: [{
        contributionId: String,
        contributorAddress: String,
        contributorName: String,
        amount: Number,
        currency: String,
        message: String,
        isAnonymous: { type: Boolean, default: false },
        rewardTierId: String,
        contributedAt: Date,
        transactionHash: String
    }],
    
    // Fund usage tracking
    fundUsage: [{
        expenseId: String,
        date: Date,
        category: String,
        description: String,
        amount: Number,
        receiptUrl: String,
        isPublic: { type: Boolean, default: true }
    }],
    
    // Verification
    verifiedBy: [String],      // Elder/community leader addresses
    isVerified: { type: Boolean, default: false },
    
    // Impact metrics
    impactMetrics: {
        peopleBenefited: Number,
        itemsPurchased: Number,
        outcomes: String
    }
}, {
    timestamps: true
});

CrowdfundingSchema.index({ status: 1, endDate: 1 });
CrowdfundingSchema.index({ category: 1, status: 1 });
CrowdfundingSchema.index({ creatorAddress: 1 });

module.exports = mongoose.model('Crowdfunding', CrowdfundingSchema);
