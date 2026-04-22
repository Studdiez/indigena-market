const mongoose = require('mongoose');

const LegalDefenseSchema = mongoose.Schema({
    caseId: { type: String, required: true, unique: true },
    
    // Case details
    title: { type: String, required: true },
    description: String,
    caseType: {
        type: String,
        enum: [
            'cultural_appropriation',
            'ip_theft',
            'trademark_infringement',
            'sacred_site_protection',
            'land_rights',
            'environmental',
            'discrimination',
            'other'
        ]
    },
    
    // Affected party
    affectedParty: {
        name: String,
        address: String,
        community: String,
        nation: String,
        contactInfo: String
    },
    
    // Offending party
    offendingParty: {
        name: String,
        type: String,           // 'corporation', 'individual', 'organization'
        description: String
    },
    
    // Evidence
    evidence: [{
        evidenceId: String,
        type: String,           // 'image', 'document', 'video', 'testimony'
        description: String,
        url: String,
        uploadedAt: Date
    }],
    
    // Funding goal
    targetAmount: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    currentAmount: { type: Number, default: 0 },
    contributorCount: { type: Number, default: 0 },
    
    // Legal team
    legalTeam: [{
        name: String,
        firm: String,
        role: String,
        contact: String
    }],
    
    // Status
    status: {
        type: String,
        enum: ['seeking_funding', 'funded', 'in_litigation', 'won', 'lost', 'settled', 'withdrawn'],
        default: 'seeking_funding'
    },
    
    // Timeline
    incidentDate: Date,
    filingDate: Date,
    targetDate: Date,
    
    // Updates
    updates: [{
        updateId: String,
        date: Date,
        title: String,
        content: String,
        isPublic: { type: Boolean, default: true }
    }],
    
    // Contributions
    contributions: [{
        contributionId: String,
        contributorAddress: String,
        contributorName: String,
        amount: Number,
        message: String,
        isAnonymous: { type: Boolean, default: false },
        contributedAt: Date
    }],
    
    // Community support
    supporters: [{
        address: String,
        name: String,
        supportedAt: Date,
        message: String
    }],
    supportCount: { type: Number, default: 0 },
    
    // Outcome
    outcome: {
        result: String,
        settlementAmount: Number,
        precedent: String,
        impact: String
    },
    
    // Verification
    verifiedBy: [String],
    isVerified: { type: Boolean, default: false }
}, {
    timestamps: true
});

LegalDefenseSchema.index({ status: 1, caseType: 1 });
LegalDefenseSchema.index({ 'affectedParty.address': 1 });

module.exports = mongoose.model('LegalDefense', LegalDefenseSchema);
