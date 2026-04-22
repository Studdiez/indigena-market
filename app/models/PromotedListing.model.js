const mongoose = require('mongoose');

const PromotedListingSchema = mongoose.Schema({
    promotionId: { type: String, required: true, unique: true },
    
    // Who is promoting
    promoterAddress: { type: String, required: true },
    promoterName: String,
    
    // What is being promoted
    promotedEntity: {
        entityType: {
            type: String,
            enum: ['nft', 'physical_item', 'course', 'experience', 'food', 'supply', 'freelancer', 'crowdfunding'],
            required: true
        },
        entityId: { type: String, required: true },
        entityName: String,
        entityImage: String
    },
    
    // Promotion type
    promotionType: {
        type: String,
        enum: ['daily_spotlight', 'category_boost', 'regional_feature', 'homepage_banner'],
        required: true
    },
    
    // Pricing
    price: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    duration: {
        value: Number,
        unit: { type: String, enum: ['hours', 'days', 'weeks'] }
    },
    
    // Schedule
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    // Targeting
    targeting: {
        category: String,        // For category_boost
        region: String,          // For regional_feature
        audience: [String]       // Demographics/interests
    },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    
    // Performance metrics
    metrics: {
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 },
        revenueGenerated: { type: Number, default: 0 }
    },
    
    // Payment
    payment: {
        transactionId: String,
        transactionHash: String,
        paidAt: Date,
        amount: Number
    },
    
    // Approval (for quality control)
    approved: { type: Boolean, default: false },
    approvedBy: String,
    approvedAt: Date,
    rejectionReason: String,
    
    // Ethical labeling
    isLabeled: { type: Boolean, default: true },
    labelText: { type: String, default: 'Featured' }
}, {
    timestamps: true
});

// Static pricing
PromotedListingSchema.statics.PRICING = {
    daily_spotlight: {
        price: 10,
        duration: { value: 1, unit: 'days' },
        description: 'Featured Today slot on homepage'
    },
    category_boost: {
        price: 5,
        duration: { value: 3, unit: 'days' },
        description: 'Top of category listing'
    },
    regional_feature: {
        price: 20,
        duration: { value: 1, unit: 'weeks' },
        description: 'Regional artists showcase'
    },
    homepage_banner: {
        price: 50,
        duration: { value: 1, unit: 'days' },
        description: 'Premium homepage banner'
    }
};

PromotedListingSchema.index({ promoterAddress: 1, status: 1 });
PromotedListingSchema.index({ promotionType: 1, status: 1 });
PromotedListingSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('PromotedListing', PromotedListingSchema);
