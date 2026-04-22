const mongoose = require('mongoose');

const CulturalTourismSlotLockSchema = mongoose.Schema(
  {
    lockKey: { type: String, required: true, unique: true, index: true },
    experienceId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    sessionId: { type: String, default: 'default', index: true },
    owner: { type: String, default: '' },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

CulturalTourismSlotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('CulturalTourismSlotLock-collection', CulturalTourismSlotLockSchema);
