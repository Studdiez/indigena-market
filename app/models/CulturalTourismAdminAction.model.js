const mongoose = require('mongoose');

const CulturalTourismAdminActionSchema = mongoose.Schema(
  {
    actionId: { type: String, required: true, unique: true, index: true },
    adminWallet: { type: String, default: '', index: true },
    action: { type: String, required: true, index: true },
    targetType: { type: String, default: '', index: true },
    targetId: { type: String, default: '', index: true },
    signed: { type: Boolean, default: false },
    signatureTimestamp: { type: String, default: '' },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CulturalTourismAdminAction-collection', CulturalTourismAdminActionSchema);
