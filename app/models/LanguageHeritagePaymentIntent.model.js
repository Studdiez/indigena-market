const mongoose = require('mongoose');

const LanguageHeritagePaymentIntentSchema = mongoose.Schema({
    intentId: { type: String, required: true, unique: true, index: true },
    listingId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    clientSecret: { type: String, required: true },
    status: {
        type: String,
        enum: ['requires_confirmation', 'confirmed', 'failed', 'expired'],
        default: 'requires_confirmation',
        index: true
    },
    expiresAt: { type: Date, required: true, index: true },
    confirmedAt: { type: Date, default: null },
    receiptId: { type: String, default: '' },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('LanguageHeritagePaymentIntent-collection', LanguageHeritagePaymentIntentSchema);
