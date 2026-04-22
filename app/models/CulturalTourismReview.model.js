const mongoose = require('mongoose');

const CulturalTourismReviewSchema = mongoose.Schema({
    reviewId: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, required: true, unique: true, index: true },
    experienceId: { type: String, required: true, index: true },
    travelerWallet: { type: String, default: '', index: true },
    travelerEmail: { type: String, default: '', index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '', maxlength: 1200 }
}, { timestamps: true });

CulturalTourismReviewSchema.index({ experienceId: 1, createdAt: -1 });

module.exports = mongoose.model('CulturalTourismReview-collection', CulturalTourismReviewSchema);
