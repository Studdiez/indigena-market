const mongoose = require('mongoose');

const CulturalTourismModerationSchema = mongoose.Schema({
    moderationId: { type: String, required: true, unique: true, index: true },
    listingId: { type: String, required: true, index: true },
    listingTitle: { type: String, default: '' },
    issueType: { type: String, enum: ['protocol', 'authenticity', 'safety', 'content'], required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'under_review', 'resolved', 'dismissed'], default: 'open', index: true },
    priority: { type: String, enum: ['p0', 'p1', 'p2', 'p3'], default: 'p2', index: true },
    queue: { type: String, enum: ['trust_safety', 'legal_protocol', 'content_quality'], default: 'trust_safety' },
    slaDueAt: { type: Date, default: null, index: true },
    escalatedAt: { type: Date, default: null },
    escalationLevel: { type: Number, default: 0 },
    moderator: { type: String, default: '' },
    notes: { type: String, default: '' },
    auditTrail: [
        {
            at: { type: Date, default: Date.now },
            by: { type: String, default: '' },
            action: { type: String, default: '' },
            note: { type: String, default: '' }
        }
    ]
}, { timestamps: true });

CulturalTourismModerationSchema.index({ status: 1, priority: 1, slaDueAt: 1 });

module.exports = mongoose.model('CulturalTourismModeration-collection', CulturalTourismModerationSchema);
