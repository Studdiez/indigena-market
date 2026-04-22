const mongoose = require('mongoose');

const CulturalTourismAuthSessionSchema = mongoose.Schema({
    sessionId: { type: String, required: true, unique: true, index: true },
    wallet: { type: String, required: true, index: true },
    refreshTokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    lastUsedAt: { type: Date, default: null }
}, { timestamps: true });

CulturalTourismAuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('CulturalTourismAuthSession-collection', CulturalTourismAuthSessionSchema);
