const mongoose = require('mongoose');

const CulturalTourismBookingSchema = mongoose.Schema({
    bookingId: { type: String, required: true, unique: true, index: true },
    experienceId: { type: String, required: true, index: true },
    experienceTitle: { type: String, default: '' },
    date: { type: String, required: true },
    sessionId: { type: String, default: 'default', index: true },
    sessionLabel: { type: String, default: '' },
    guests: { type: Number, default: 1 },
    baseFare: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending', index: true },
    paymentStatus: {
        type: String,
        enum: ['requires_payment', 'requires_confirmation', 'captured', 'failed', 'refunded'],
        default: 'requires_payment',
        index: true
    },
    paymentIntentId: { type: String, default: '', index: true },
    paymentProvider: { type: String, default: 'simulated' },
    paymentReference: { type: String, default: '' },
    paymentCapturedAt: { type: Date, default: null },
    receiptId: { type: String, default: '' },
    travelerWallet: { type: String, default: '', index: true },
    travelerName: { type: String, default: '' },
    travelerEmail: { type: String, default: '', index: true },
    notes: { type: String, default: '' },
    protocolAccepted: { type: Boolean, default: false },
    protocolAcknowledgements: [{ type: String }],
    protocolSnapshot: [{ type: String }],
    mediaRestrictions: {
        photoAllowed: { type: Boolean, default: true },
        audioAllowed: { type: Boolean, default: true },
        videoAllowed: { type: Boolean, default: true }
    },
    idempotencyKey: { type: String, default: '', index: true },
    paymentDueAt: { type: Date, default: null, index: true },
    paymentRetryCount: { type: Number, default: 0 },
    lastPaymentRetryAt: { type: Date, default: null },
    cancellationReason: { type: String, default: '' },
    cancelledAt: { type: Date, default: null },
    cancelledByWallet: { type: String, default: '' },
    rescheduledFromDate: { type: String, default: '' },
    rescheduledAt: { type: Date, default: null },
    rescheduledByWallet: { type: String, default: '' },
    refundReason: { type: String, default: '' },
    refundedAt: { type: Date, default: null },
    refundedByWallet: { type: String, default: '' },
    ticketId: { type: String, default: '' },
    reviewPromptSentAt: { type: Date, default: null },
    preTripBriefSentAt: { type: Date, default: null }
}, { timestamps: true });

CulturalTourismBookingSchema.index({ travelerWallet: 1, createdAt: -1 });
CulturalTourismBookingSchema.index({ travelerEmail: 1, createdAt: -1 });
CulturalTourismBookingSchema.index({ experienceId: 1, date: 1, sessionId: 1, status: 1 });
CulturalTourismBookingSchema.index({ status: 1, paymentStatus: 1, paymentDueAt: 1 });
CulturalTourismBookingSchema.index(
    { idempotencyKey: 1 },
    { unique: true, sparse: true, partialFilterExpression: { idempotencyKey: { $type: 'string', $ne: '' } } }
);

module.exports = mongoose.model('CulturalTourismBooking-collection', CulturalTourismBookingSchema);
