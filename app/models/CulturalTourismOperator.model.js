const mongoose = require('mongoose');

const CulturalTourismOperatorSchema = mongoose.Schema({
    wallet: { type: String, required: true, unique: true, index: true },
    operatorName: { type: String, default: 'Community Operator' },
    nation: { type: String, default: 'Multi-Nation' },
    verificationTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
    activeListings: { type: Number, default: 0 },
    monthlyBookings: { type: Number, default: 0 },
    payoutPending: { type: Number, default: 0 },
    trust: {
        identityStatus: { type: String, enum: ['missing', 'pending', 'verified', 'rejected'], default: 'missing' },
        kycDocumentUrl: { type: String, default: '' },
        kycSubmittedAt: { type: Date, default: null },
        kycVerifiedAt: { type: Date, default: null },
        insuranceStatus: { type: String, enum: ['missing', 'pending', 'verified', 'expired', 'rejected'], default: 'missing' },
        insuranceDocUrl: { type: String, default: '' },
        insuranceExpiry: { type: Date, default: null },
        permits: [
            {
                permitId: { type: String, default: '' },
                label: { type: String, default: '' },
                expiry: { type: Date, default: null },
                status: { type: String, enum: ['pending', 'verified', 'expired', 'rejected'], default: 'pending' }
            }
        ],
        alerts: [{ type: String }]
    }
}, { timestamps: true });

module.exports = mongoose.model('CulturalTourismOperator-collection', CulturalTourismOperatorSchema);
