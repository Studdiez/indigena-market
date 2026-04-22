const mongoose = require('mongoose');

const EnterpriseAccountSchema = mongoose.Schema({
    accountId: { type: String, required: true, unique: true },
    
    // Company details
    companyName: { type: String, required: true },
    companyType: {
        type: String,
        enum: ['corporation', 'museum', 'university', 'government', 'ngo', 'media', 'other'],
        required: true
    },
    
    // Contact
    primaryContact: {
        name: String,
        email: String,
        phone: String,
        title: String
    },
    
    billingContact: {
        name: String,
        email: String,
        address: String
    },
    
    // Account manager
    accountManager: {
        name: String,
        email: String
    },
    
    // Services subscribed
    services: [{
        serviceType: {
            type: String,
            enum: [
                'art_licensing',      // Pillar 1: Digital art library
                'talent_finder',      // Pillar 4: Freelance matching
                'corporate_training', // Pillar 3: Bulk course licenses
                'custom_research',    // Pillar 7,9: Data insights
                'consulting',         // Pillar 4: Cultural consulting
                'translation'         // Pillar 7: Language services
            ]
        },
        status: {
            type: String,
            enum: ['active', 'pending', 'expired', 'cancelled'],
            default: 'pending'
        },
        startDate: Date,
        endDate: Date,
        feeStructure: {
            type: String,        // 'percentage', 'flat_fee', 'per_seat'
            amount: Number,
            percentage: Number
        },
        contractValue: Number
    }],
    
    // Art Licensing Library (Pillar 1)
    licensing: {
        libraryAccess: { type: Boolean, default: false },
        licenseType: {
            type: String,
            enum: ['single_use', 'multi_use', 'unlimited', 'exclusive']
        },
        licensedWorks: [{
            workId: String,
            workType: String,
            licenseStart: Date,
            licenseEnd: Date,
            usageRights: [String],
            territory: String,
            fee: Number
        }],
        totalLicensingFees: { type: Number, default: 0 }
    },
    
    // Corporate Training (Pillar 3)
    corporateTraining: {
        seatLicenses: Number,
        coursesPurchased: [String],
        employeesEnrolled: [String],
        completionRate: { type: Number, default: 0 }
    },
    
    // Talent Finder (Pillar 4)
    talentFinder: {
        activeProjects: Number,
        completedProjects: Number,
        totalFinderFees: { type: Number, default: 0 }
    },
    
    // Billing
    billing: {
        cycle: { type: String, enum: ['monthly', 'quarterly', 'annual'], default: 'monthly' },
        paymentMethod: String,
        outstandingBalance: { type: Number, default: 0 },
        totalBilled: { type: Number, default: 0 },
        totalPaid: { type: Number, default: 0 }
    },
    
    // Contract
    contract: {
        signedDate: Date,
        contractDocument: String,
        renewalDate: Date,
        terms: String
    },
    
    // Status
    status: {
        type: String,
        enum: ['prospect', 'active', 'inactive', 'suspended'],
        default: 'prospect'
    },
    
    // Activity
    lastActivity: Date,
    notes: String
}, {
    timestamps: true
});

// Static fee structures
EnterpriseAccountSchema.statics.FEE_STRUCTURES = {
    art_licensing: {
        curationFee: 0.15,      // 15% platform fee
        artistShare: 0.85
    },
    talent_finder: {
        finderFee: 0.12,        // 12% on contract value
        paidBy: 'employer'
    },
    corporate_training: {
        adminFee: 0.20,         // 20% on bulk licenses
        perSeatDiscount: 0.10   // 10% discount for bulk
    },
    custom_research: {
        baseFee: 500,           // $500 base
        hourlyRate: 150         // $150/hour for custom queries
    }
};

EnterpriseAccountSchema.index({ companyType: 1, status: 1 });
EnterpriseAccountSchema.index({ 'services.serviceType': 1 });

module.exports = mongoose.model('EnterpriseAccount', EnterpriseAccountSchema);
