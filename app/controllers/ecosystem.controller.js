const Sponsor = require('../models/Sponsor.model.js');
const Crowdfunding = require('../models/Crowdfunding.model.js');
const Experience = require('../models/Experience.model.js');
const LanguageArchive = require('../models/LanguageArchive.model.js');
const IndigenousFood = require('../models/IndigenousFood.model.js');
const LegalDefense = require('../models/LegalDefense.model.js');
const SupplyMarketplace = require('../models/SupplyMarketplace.model.js');
const { v4: uuidv4 } = require('uuid');

/**
 * Ecosystem Controller
 * Manages all 10 economic pillars of the Indigena Market platform
 */

// ==================== PILLAR 5: GIVING & STEWARDSHIP ====================

// Create sponsorship
exports.createSponsorship = async (req, res) => {
    try {
        const sponsorship = new Sponsor({
            sponsorId: uuidv4(),
            ...req.body,
            status: 'pending'
        });
        await sponsorship.save();
        res.status(201).json({ success: true, sponsorship });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get sponsorships
exports.getSponsorships = async (req, res) => {
    try {
        const { address, status } = req.query;
        let query = {};
        if (address) query.sponsorAddress = address;
        if (status) query.status = status;
        
        const sponsorships = await Sponsor.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, sponsorships });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create crowdfunding campaign
exports.createCrowdfunding = async (req, res) => {
    try {
        const campaign = new Crowdfunding({
            campaignId: uuidv4(),
            ...req.body,
            status: 'draft'
        });
        await campaign.save();
        res.status(201).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get crowdfunding campaigns
exports.getCrowdfunding = async (req, res) => {
    try {
        const { category, status } = req.query;
        let query = { status: 'active' };
        if (category) query.category = category;
        if (status) query.status = status;
        
        const campaigns = await Crowdfunding.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, campaigns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Contribute to campaign
exports.contributeToCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const contribution = req.body;
        
        const campaign = await Crowdfunding.findOne({ campaignId });
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        
        campaign.contributions.push({
            contributionId: uuidv4(),
            ...contribution,
            contributedAt: new Date()
        });
        
        campaign.currentAmount += contribution.amount;
        campaign.contributorCount = campaign.contributions.length;
        
        await campaign.save();
        res.status(200).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PILLAR 6: CULTURAL TOURISM ====================

// Create experience
exports.createExperience = async (req, res) => {
    try {
        const experience = new Experience({
            experienceId: uuidv4(),
            ...req.body,
            status: 'draft'
        });
        await experience.save();
        res.status(201).json({ success: true, experience });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get experiences
exports.getExperiences = async (req, res) => {
    try {
        const { category, country, status } = req.query;
        let query = { status: 'active' };
        if (category) query.category = category;
        if (country) query['location.country'] = country;
        if (status) query.status = status;
        
        const experiences = await Experience.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, experiences });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PILLAR 7: LANGUAGE & HERITAGE ====================

// Create archive item
exports.createArchiveItem = async (req, res) => {
    try {
        const item = new LanguageArchive({
            archiveId: uuidv4(),
            ...req.body
        });
        await item.save();
        res.status(201).json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get archive items
exports.getArchiveItems = async (req, res) => {
    try {
        const { language, contentType, accessLevel } = req.query;
        let query = {};
        if (language) query.languageName = language;
        if (contentType) query.contentType = contentType;
        if (accessLevel) query.accessLevel = accessLevel;
        
        const items = await LanguageArchive.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PILLAR 8: LAND & FOOD ====================

// Create food product
exports.createFoodProduct = async (req, res) => {
    try {
        const product = new IndigenousFood({
            productId: uuidv4(),
            ...req.body,
            status: 'available'
        });
        await product.save();
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get food products
exports.getFoodProducts = async (req, res) => {
    try {
        const { category, nation, status } = req.query;
        let query = { status: 'available' };
        if (category) query.category = category;
        if (nation) query.nation = nation;
        if (status) query.status = status;
        
        const products = await IndigenousFood.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PILLAR 9: ADVOCACY & LEGAL ====================

// Create legal defense case
exports.createLegalCase = async (req, res) => {
    try {
        const caseItem = new LegalDefense({
            caseId: uuidv4(),
            ...req.body,
            status: 'seeking_funding'
        });
        await caseItem.save();
        res.status(201).json({ success: true, case: caseItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get legal cases
exports.getLegalCases = async (req, res) => {
    try {
        const { caseType, status } = req.query;
        let query = {};
        if (caseType) query.caseType = caseType;
        if (status) query.status = status;
        
        const cases = await LegalDefense.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, cases });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Contribute to legal defense
exports.contributeToLegal = async (req, res) => {
    try {
        const { caseId } = req.params;
        const contribution = req.body;
        
        const legalCase = await LegalDefense.findOne({ caseId });
        if (!legalCase) {
            return res.status(404).json({ success: false, message: 'Case not found' });
        }
        
        legalCase.contributions.push({
            contributionId: uuidv4(),
            ...contribution,
            contributedAt: new Date()
        });
        
        legalCase.currentAmount += contribution.amount;
        legalCase.contributorCount = legalCase.contributions.length;
        
        await legalCase.save();
        res.status(200).json({ success: true, case: legalCase });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PILLAR 10: MATERIALS & TOOLS ====================

// Create supply listing
exports.createSupplyListing = async (req, res) => {
    try {
        const listing = new SupplyMarketplace({
            listingId: uuidv4(),
            ...req.body,
            status: 'available'
        });
        await listing.save();
        res.status(201).json({ success: true, listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get supply listings
exports.getSupplyListings = async (req, res) => {
    try {
        const { category, isRental, sellerAddress } = req.query;
        let query = { status: 'available' };
        if (category) query.category = category;
        if (isRental !== undefined) query.isRental = isRental === 'true';
        if (sellerAddress) query.sellerAddress = sellerAddress;
        
        const listings = await SupplyMarketplace.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== ECOSYSTEM DASHBOARD ====================

// Get ecosystem overview
exports.getEcosystemOverview = async (req, res) => {
    try {
        const stats = await Promise.all([
            Sponsor.countDocuments({ status: 'active' }),
            Crowdfunding.countDocuments({ status: 'active' }),
            Experience.countDocuments({ status: 'active' }),
            LanguageArchive.countDocuments(),
            IndigenousFood.countDocuments({ status: 'available' }),
            LegalDefense.countDocuments({ status: { $in: ['seeking_funding', 'in_litigation'] } }),
            SupplyMarketplace.countDocuments({ status: 'available' })
        ]);

        res.status(200).json({
            success: true,
            overview: {
                activeSponsorships: stats[0],
                activeCrowdfunding: stats[1],
                availableExperiences: stats[2],
                archiveItems: stats[3],
                foodProducts: stats[4],
                legalCases: stats[5],
                supplyListings: stats[6]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
