const mongoose = require('mongoose');

const PhysicalOrderSchema = mongoose.Schema({
    itemId: { type: String, required: true, index: true },
    buyerAddress: { type: String, required: true, index: true },
    sellerAddress: { type: String, default: '' },
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'INDI' },
    status: { type: String, enum: ['pending', 'completed', 'cancelled', 'refunded'], default: 'completed', index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('PhysicalOrder-collection', PhysicalOrderSchema);
