const mongoose = require('mongoose');

const CourseWatchlistSchema = mongoose.Schema({
    courseId: { type: String, required: true, index: true },
    watcherAddress: { type: String, required: true, index: true },
    active: { type: Boolean, default: true, index: true }
}, { timestamps: true });

CourseWatchlistSchema.index({ courseId: 1, watcherAddress: 1 }, { unique: true });

module.exports = mongoose.model('CourseWatchlist-collection', CourseWatchlistSchema);
