const mongoose = require('mongoose');

const FreelanceShortlistSchema = mongoose.Schema({
    serviceId: { type: String, required: true, index: true },
    userAddress: { type: String, required: true, index: true },
    active: { type: Boolean, default: true, index: true }
}, { timestamps: true });

FreelanceShortlistSchema.index({ serviceId: 1, userAddress: 1 }, { unique: true });

module.exports = mongoose.model('FreelanceShortlist-collection', FreelanceShortlistSchema);
