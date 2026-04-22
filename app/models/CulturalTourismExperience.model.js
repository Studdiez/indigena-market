const mongoose = require('mongoose');

const ProtocolSchema = mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: true }
}, { _id: false });

const SessionSchema = mongoose.Schema({
    sessionId: { type: String, required: true },
    label: { type: String, required: true },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    capacity: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    virtual: { type: Boolean, default: false }
}, { _id: false });

const CulturalTourismExperienceSchema = mongoose.Schema({
    experienceId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    kind: {
        type: String,
        enum: [
            'lodging',
            'guided-tours',
            'workshops',
            'performances',
            'festivals',
            'wellness',
            'culinary',
            'adventure',
            'virtual',
            'arts-crafts',
            'voluntourism',
            'transport',
            'specialty'
        ],
        required: true
    },
    nation: { type: String, default: '' },
    community: { type: String, default: '' },
    region: { type: String, default: '', index: true },
    coordinates: {
        lat: { type: Number, default: null, index: true },
        lng: { type: Number, default: null, index: true }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: undefined
        }
    },
    summary: { type: String, default: '' },
    image: { type: String, default: '' },
    priceFrom: { type: Number, default: 0, index: true },
    currency: { type: String, default: 'USD' },
    durationLabel: { type: String, default: 'Half Day' },
    groupSize: { type: String, default: 'Up to 10' },
    maxCapacity: { type: Number, default: 0 },
    rating: { type: Number, default: 0, index: true },
    reviews: { type: Number, default: 0 },
    verificationTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze', index: true },
    elderApproved: { type: Boolean, default: false },
    sacredContent: { type: Boolean, default: false, index: true },
    virtual: { type: Boolean, default: false, index: true },
    availableNextDate: { type: String, default: '' },
    blackoutDates: [{ type: String, index: true }],
    protocols: [ProtocolSchema],
    sessions: [SessionSchema],
    consentChecklist: [{ type: String }],
    mediaRestrictions: {
        photoAllowed: { type: Boolean, default: true },
        audioAllowed: { type: Boolean, default: true },
        videoAllowed: { type: Boolean, default: true }
    },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ['draft', 'active', 'paused', 'archived'], default: 'active', index: true },
    createdByWallet: { type: String, default: 'demo-operator-wallet', index: true }
}, { timestamps: true });

CulturalTourismExperienceSchema.index({ title: 'text', summary: 'text', nation: 'text', community: 'text', region: 'text' });
CulturalTourismExperienceSchema.index({ status: 1, kind: 1, featured: -1, rating: -1, createdAt: -1 });
CulturalTourismExperienceSchema.index({ status: 1, region: 1, priceFrom: 1, createdAt: -1 });
CulturalTourismExperienceSchema.index({ status: 1, virtual: 1, sacredContent: 1, verificationTier: 1, createdAt: -1 });
CulturalTourismExperienceSchema.index({ location: '2dsphere' });

CulturalTourismExperienceSchema.pre('save', function setGeoLocation(next) {
    const lat = Number(this.coordinates?.lat);
    const lng = Number(this.coordinates?.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
        this.location = {
            type: 'Point',
            coordinates: [lng, lat]
        };
    } else {
        this.location = undefined;
    }
    next();
});

module.exports = mongoose.model('CulturalTourismExperience-collection', CulturalTourismExperienceSchema);
