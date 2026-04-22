const mongoose = require('mongoose');

const CourseShareSchema = mongoose.Schema({
    courseId: { type: String, required: true, index: true },
    sharerAddress: { type: String, default: '', index: true },
    platform: { type: String, default: 'native' },
    shareUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CourseShare-collection', CourseShareSchema);
