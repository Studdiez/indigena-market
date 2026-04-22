const mongoose = require('mongoose');

const CulturalTourismAuthChallengeSchema = mongoose.Schema({
    challengeId: { type: String, required: true, unique: true, index: true },
    wallet: { type: String, required: true, index: true },
    nonce: { type: String, required: true },
    message: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null }
}, { timestamps: true });

CulturalTourismAuthChallengeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('CulturalTourismAuthChallenge-collection', CulturalTourismAuthChallengeSchema);
