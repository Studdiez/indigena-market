const mongoose = require('mongoose');

const CourseEnrollmentReceiptSchema = mongoose.Schema({
    receiptId: { type: String, required: true, unique: true, index: true },
    courseId: { type: String, required: true, index: true },
    studentAddress: { type: String, required: true, index: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INDI' },
    status: { type: String, enum: ['issued', 'refunded'], default: 'issued', index: true },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('CourseEnrollmentReceipt-collection', CourseEnrollmentReceiptSchema);
