const mongoose = require('mongoose');

const PhysicalWatchlistSchema = mongoose.Schema({
    itemId: { type: String, required: true, index: true },
    watcherAddress: { type: String, required: true, index: true },
    active: { type: Boolean, default: true, index: true }
}, { timestamps: true });

PhysicalWatchlistSchema.index({ itemId: 1, watcherAddress: 1 }, { unique: true });

module.exports = mongoose.model('PhysicalWatchlist-collection', PhysicalWatchlistSchema);
