const mongoose = require('mongoose');

const LanguageHeritageAccessRequestSchema = mongoose.Schema({
    requestId: { type: String, required: true, unique: true, index: true },
    listingId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },
    note: { type: String, default: '' },
    metadata: { type: Object, default: {} },
    reviewedBy: { type: String, default: '' },
    reviewedAt: { type: Date, default: null }
}, { timestamps: true });

LanguageHeritageAccessRequestSchema.index({ listingId: 1, walletAddress: 1 }, { unique: true });

module.exports = mongoose.model('LanguageHeritageAccessRequest-collection', LanguageHeritageAccessRequestSchema);
