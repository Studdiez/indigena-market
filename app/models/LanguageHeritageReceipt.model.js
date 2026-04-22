const mongoose = require('mongoose');

const LanguageHeritageReceiptSchema = mongoose.Schema({
    receiptId: { type: String, required: true, unique: true, index: true },
    listingId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['issued', 'refunded'],
        default: 'issued',
        index: true
    },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('LanguageHeritageReceipt-collection', LanguageHeritageReceiptSchema);
