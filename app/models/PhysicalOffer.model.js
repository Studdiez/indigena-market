const mongoose = require('mongoose');

const PhysicalOfferSchema = mongoose.Schema({
    itemId: { type: String, required: true, index: true },
    buyerAddress: { type: String, required: true, index: true },
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'INDI' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'withdrawn'], default: 'pending', index: true }
}, { timestamps: true });

module.exports = mongoose.model('PhysicalOffer-collection', PhysicalOfferSchema);
