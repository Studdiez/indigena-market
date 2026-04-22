const mongoose = require('mongoose');

const CulturalTourismPaymentEventSchema = mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, default: '', index: true },
    paymentIntentId: { type: String, default: '', index: true },
    provider: { type: String, default: 'simulated' },
    eventType: { type: String, default: '' },
    payload: { type: Object, default: {} },
    processed: { type: Boolean, default: false, index: true },
    processedAt: { type: Date, default: null },
    retryCount: { type: Number, default: 0 },
    nextRetryAt: { type: Date, default: null, index: true },
    lastError: { type: String, default: '' }
  },
  { timestamps: true }
);

CulturalTourismPaymentEventSchema.index({ processed: 1, nextRetryAt: 1 });

module.exports = mongoose.model('CulturalTourismPaymentEvent-collection', CulturalTourismPaymentEventSchema);
