const mongoose = require('mongoose');

const CulturalTourismCommsJobSchema = mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, default: '', index: true },
    experienceId: { type: String, default: '', index: true },
    channel: { type: String, enum: ['email', 'sms'], required: true },
    type: {
      type: String,
      enum: ['pre_trip_briefing', 'booking_reminder_24h', 'booking_reminder_2h', 'post_trip_review_nudge'],
      required: true
    },
    recipient: { type: String, default: '' },
    payload: { type: Object, default: {} },
    status: { type: String, enum: ['queued', 'sent', 'failed'], default: 'queued', index: true },
    attempts: { type: Number, default: 0 },
    scheduledFor: { type: Date, required: true, index: true },
    sentAt: { type: Date, default: null },
    lastError: { type: String, default: '' }
  },
  { timestamps: true }
);

CulturalTourismCommsJobSchema.index({ status: 1, scheduledFor: 1 });

module.exports = mongoose.model('CulturalTourismCommsJob-collection', CulturalTourismCommsJobSchema);
