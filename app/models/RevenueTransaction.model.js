const mongoose = require('mongoose');

const RevenueTransactionSchema = mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    
    // Transaction type
    transactionType: {
        type: String,
        enum: [
            'nft_sale',              // Pillar 1: Digital
            'physical_sale',         // Pillar 2: Physical
            'course_sale',           // Pillar 3: Courses
            'freelance_contract',    // Pillar 4: Freelancing
            'experience_booking',    // Pillar 6: Tourism
            'food_sale',             // Pillar 8: Land & Food
            'supply_sale',           // Pillar 10: Materials
            'subscription',          // Pillar 2,5,7: Membership
            'promoted_listing',      // Pillar All: Featured
            'enterprise_license',    // Pillar 1,3,4,7: B2B
            'data_report'            // Pillar 7,9: Insights
        ],
        required: true
    },
    
    // Pillar reference
    pillar: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true
    },
    
    // Financial details
    grossAmount: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    
    // Fee structure (Firekeeper Fee)
    platformFee: {
        percentage: Number,
        amount: Number,
        feeType: {
            type: String,
            enum: ['transaction', 'booking', 'subscription', 'promotion', 'enterprise', 'curation']
        }
    },
    
    // Artist/Creator earnings
    artistEarnings: {
        artistAddress: String,
        amount: Number,
        percentage: Number
    },
    
    // Additional allocations
    allocations: [{
        category: String,        // 'seva', 'legal_defense', 'archive', 'community'
        amount: Number,
        percentage: Number,
        description: String
    }],
    
    // Related entity
    relatedEntity: {
        entityType: String,      // 'nft', 'physical_item', 'course', 'experience', etc.
        entityId: String
    },
    
    // Payment details
    paymentMethod: String,
    transactionHash: String,     // XRPL transaction hash
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'completed', 'refunded', 'disputed'],
        default: 'pending'
    },
    
    // Timestamps
    processedAt: Date,
    completedAt: Date,
    
    // For refunds/disputes
    refundAmount: { type: Number, default: 0 },
    refundReason: String,
    
    // Metadata
    metadata: mongoose.Schema.Types.Mixed
}, {
    timestamps: true
});

// Indexes for reporting
RevenueTransactionSchema.index({ transactionType: 1, status: 1 });
RevenueTransactionSchema.index({ pillar: 1, createdAt: -1 });
RevenueTransactionSchema.index({ 'artistEarnings.artistAddress': 1 });
RevenueTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('RevenueTransaction', RevenueTransactionSchema);
