const mongoose = require('mongoose');

const FreelanceBookingSchema = mongoose.Schema({
    serviceId: { type: String, required: true, index: true },
    freelancerAddress: { type: String, required: true, index: true },
    clientAddress: { type: String, required: true, index: true },
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INDI' },
    status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled', 'disputed'], default: 'pending', index: true },
    notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('FreelanceBooking-collection', FreelanceBookingSchema);
