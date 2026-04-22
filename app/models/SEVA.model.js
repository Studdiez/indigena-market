const mongoose = require('mongoose');

const AllocationSchema = mongoose.Schema({
    causeId: String,
    causeName: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now },
    landProtected: { type: Number, default: 0 },
    languageLessonsFunded: { type: Number, default: 0 },
    transactionHash: String
});

const SEVASchema = mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        lowercase: true
    },
    totalSEVAEarned: {
        type: Number,
        default: 0
    },
    totalSEVADonated: {
        type: Number,
        default: 0
    },
    currentBalance: {
        type: Number,
        default: 0
    },
    allocations: [AllocationSchema],
    // Impact metrics
    totalLandProtected: {
        type: Number,
        default: 0
    },
    totalLanguageLessonsFunded: {
        type: Number,
        default: 0
    },
    communitiesSupported: [{
        community: String,
        totalDonated: Number
    }],
    // SEVA earning history from NFT sales
    earnings: [{
        nftId: String,
        saleAmount: Number,
        sevaEarned: Number,
        timestamp: { type: Date, default: Date.now },
        transactionHash: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('SEVA-collection', SEVASchema);
