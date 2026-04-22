const mongoose = require('mongoose');

const CourseReportSchema = mongoose.Schema({
    courseId: { type: String, required: true, index: true },
    reporterAddress: { type: String, default: '' },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: {
        type: String,
        enum: ['open', 'under_review', 'resolved', 'dismissed'],
        default: 'open',
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CourseReport-collection', CourseReportSchema);
