const mongoose = require('mongoose');

const CoursePaymentIntentSchema = mongoose.Schema({
    intentId: { type: String, required: true, unique: true, index: true },
    courseId: { type: String, required: true, index: true },
    studentAddress: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INDI' },
    clientSecret: { type: String, required: true },
    status: {
        type: String,
        enum: ['requires_confirmation', 'confirmed', 'failed', 'expired'],
        default: 'requires_confirmation',
        index: true
    },
    confirmedAt: Date,
    expiresAt: { type: Date, required: true, index: true },
    receiptId: { type: String, default: '' },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('CoursePaymentIntent-collection', CoursePaymentIntentSchema);
