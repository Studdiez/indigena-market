const mongoose = require('mongoose');

const DonationSchema = mongoose.Schema({
    walletAddress: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now },
    transactionHash: String,
    message: String
});

const CulturalCauseSchema = mongoose.Schema({
    causeId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    community: {
        type: String,
        required: true
    },
    nation: String,
    category: {
        type: String,
        enum: ['land_protection', 'language_preservation', 'cultural_education', 'arts_support', 'elder_care'],
        required: true
    },
    // Location for mapping/visualization
    gpsCoordinates: {
        lat: Number,
        lng: Number
    },
    region: String,
    // Funding goals
    fundingGoal: {
        type: Number,
        required: true
    },
    currentFunding: {
        type: Number,
        default: 0
    },
    // Impact metrics
    landProtected: {
        type: Number,
        default: 0
    },
    languageLessonsFunded: {
        type: Number,
        default: 0
    },
    artistsSupported: {
        type: Number,
        default: 0
    },
    // Media
    imageUrl: String,
    videoUrl: String,
    // Status
    status: {
        type: String,
        enum: ['active', 'completed', 'paused'],
        default: 'active'
    },
    // Donations
    donations: [DonationSchema],
    // Stewardship
    stewards: [{
        name: String,
        role: String,
        contact: String
    }],
    // Verification
    verifiedByElder: {
        type: Boolean,
        default: false
    },
    elderVerificationDate: Date,
    // Timestamps
    startDate: {
        type: Date,
        default: Date.now
    },
    targetCompletionDate: Date,
    actualCompletionDate: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('CulturalCause-collection', CulturalCauseSchema);
