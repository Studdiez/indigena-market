const mongoose = require('mongoose');

const CulturalTourismUserActionNonceSchema = mongoose.Schema({
    nonceKey: { type: String, required: true, unique: true, index: true },
    wallet: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    targetId: { type: String, default: '' },
    timestamp: { type: Number, required: true },
    expiresAt: { type: Date, required: true, index: true }
}, { timestamps: true });

CulturalTourismUserActionNonceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('CulturalTourismUserActionNonce-collection', CulturalTourismUserActionNonceSchema);
