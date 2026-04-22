const RevenueTransaction = require('../models/RevenueTransaction.model.js');
const { v4: uuidv4 } = require('uuid');

/**
 * Revenue Controller
 * Implements the 7 Revenue Streams with Firekeeper Fee structure
 */

// Firekeeper Fee Structure (Revenue Stream #1)
const FEE_STRUCTURE = {
    // Pillar 1: Digital Arts
    nft_sale: { percentage: 0.08, feeType: 'transaction', pillar: '1' },
    
    // Pillar 2: Physical Items
    physical_sale: { percentage: 0.05, feeType: 'transaction', pillar: '2' },
    
    // Pillar 3: Courses
    course_sale: { percentage: 0.10, feeType: 'transaction', pillar: '3' },
    
    // Pillar 4: Freelancing
    freelance_contract: { percentage: 0.10, feeType: 'transaction', pillar: '4' },
    
    // Pillar 6: Tourism
    experience_booking: { percentage: 0.06, feeType: 'booking', pillar: '6' },
    
    // Pillar 8: Land & Food
    food_sale: { percentage: 0.05, feeType: 'transaction', pillar: '8' },
    
    // Pillar 10: Materials
    supply_sale: { percentage: 0.04, feeType: 'transaction', pillar: '10' }
};

// Calculate fees for a transaction
exports.calculateFees = async (req, res) => {
    try {
        const { transactionType, grossAmount } = req.body;
        
        const feeConfig = FEE_STRUCTURE[transactionType];
        if (!feeConfig) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid transaction type' 
            });
        }
        
        const platformFeeAmount = grossAmount * feeConfig.percentage;
        const artistEarnings = grossAmount - platformFeeAmount;
        
        // Additional allocations (SEVA, Legal Defense, etc.)
        const allocations = [];
        
        // SEVA allocation (2.5% of gross)
        const sevaAmount = grossAmount * 0.025;
        allocations.push({
            category: 'seva',
            amount: sevaAmount,
            percentage: 2.5,
            description: 'Cultural preservation fund'
        });
        
        // Legal Defense allocation (0.5% of gross)
        const legalAmount = grossAmount * 0.005;
        allocations.push({
            category: 'legal_defense',
            amount: legalAmount,
            percentage: 0.5,
            description: 'Community legal defense fund'
        });
        
        res.status(200).json({
            success: true,
            breakdown: {
                grossAmount,
                platformFee: {
                    amount: platformFeeAmount,
                    percentage: feeConfig.percentage * 100,
                    feeType: feeConfig.feeType
                },
                artistEarnings: {
                    amount: artistEarnings,
                    percentage: (1 - feeConfig.percentage) * 100
                },
                allocations,
                netToArtist: artistEarnings - sevaAmount - legalAmount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Process a transaction and create revenue record
exports.processTransaction = async (req, res) => {
    try {
        const {
            transactionType,
            grossAmount,
            artistAddress,
            relatedEntity,
            paymentMethod,
            transactionHash
        } = req.body;
        
        const feeConfig = FEE_STRUCTURE[transactionType];
        if (!feeConfig) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid transaction type' 
            });
        }
        
        const platformFeeAmount = grossAmount * feeConfig.percentage;
        const artistEarnings = grossAmount - platformFeeAmount;
        
        // Create revenue transaction record
        const revenueTx = new RevenueTransaction({
            transactionId: uuidv4(),
            transactionType,
            pillar: feeConfig.pillar,
            grossAmount,
            currency: 'XRP',
            platformFee: {
                percentage: feeConfig.percentage,
                amount: platformFeeAmount,
                feeType: feeConfig.feeType
            },
            artistEarnings: {
                artistAddress,
                amount: artistEarnings,
                percentage: 1 - feeConfig.percentage
            },
            allocations: [
                {
                    category: 'seva',
                    amount: grossAmount * 0.025,
                    percentage: 2.5,
                    description: 'Cultural preservation'
                },
                {
                    category: 'legal_defense',
                    amount: grossAmount * 0.005,
                    percentage: 0.5,
                    description: 'Legal defense fund'
                }
            ],
            relatedEntity,
            paymentMethod,
            transactionHash,
            status: 'completed',
            completedAt: new Date()
        });
        
        await revenueTx.save();
        
        res.status(201).json({
            success: true,
            transaction: revenueTx,
            message: 'Transaction processed successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get revenue dashboard (for platform admins)
exports.getRevenueDashboard = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        
        const startDate = new Date();
        if (period === '7d') startDate.setDate(startDate.getDate() - 7);
        else if (period === '30d') startDate.setDate(startDate.getDate() - 30);
        else if (period === '90d') startDate.setDate(startDate.getDate() - 90);
        else if (period === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
        
        // Aggregate revenue data
        const stats = await RevenueTransaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: null,
                    totalGross: { $sum: '$grossAmount' },
                    totalPlatformFees: { $sum: '$platformFee.amount' },
                    totalArtistEarnings: { $sum: '$artistEarnings.amount' },
                    totalSEVA: { 
                        $sum: { 
                            $filter: {
                                input: '$allocations',
                                cond: { $eq: ['$$this.category', 'seva'] }
                            }
                        }
                    },
                    transactionCount: { $sum: 1 }
                }
            }
        ]);
        
        // Revenue by pillar
        const revenueByPillar = await RevenueTransaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: '$pillar',
                    grossAmount: { $sum: '$grossAmount' },
                    platformFees: { $sum: '$platformFee.amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Revenue by transaction type
        const revenueByType = await RevenueTransaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: '$transactionType',
                    grossAmount: { $sum: '$grossAmount' },
                    platformFees: { $sum: '$platformFee.amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            period,
            summary: stats[0] || {
                totalGross: 0,
                totalPlatformFees: 0,
                totalArtistEarnings: 0,
                transactionCount: 0
            },
            byPillar: revenueByPillar,
            byType: revenueByType
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get artist earnings report
exports.getArtistEarnings = async (req, res) => {
    try {
        const { address } = req.params;
        const { period = '30d' } = req.query;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));
        
        const earnings = await RevenueTransaction.find({
            'artistEarnings.artistAddress': address,
            status: 'completed',
            createdAt: { $gte: startDate }
        }).sort({ createdAt: -1 });
        
        const summary = await RevenueTransaction.aggregate([
            {
                $match: {
                    'artistEarnings.artistAddress': address,
                    status: 'completed',
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalGross: { $sum: '$grossAmount' },
                    totalEarnings: { $sum: '$artistEarnings.amount' },
                    totalPlatformFees: { $sum: '$platformFee.amount' },
                    transactionCount: { $sum: 1 }
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            artistAddress: address,
            period,
            summary: summary[0] || {
                totalGross: 0,
                totalEarnings: 0,
                totalPlatformFees: 0,
                transactionCount: 0
            },
            transactions: earnings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get fee structure (public endpoint)
exports.getFeeStructure = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Firekeeper Fee Structure - Transparent and Ethical',
            fees: {
                digital_arts: { percentage: 8, description: 'NFTs, music, digital downloads' },
                physical_goods: { percentage: 5, description: 'Art, crafts, food, materials' },
                courses: { percentage: 10, description: 'Online learning, certifications' },
                freelancing: { percentage: 10, description: 'Services, consulting, contracts' },
                experiences: { percentage: 6, description: 'Tourism, homestays, workshops' }
            },
            artistKeeps: {
                digital_arts: '92%',
                physical_goods: '95%',
                courses: '90%',
                freelancing: '90%',
                experiences: '94%'
            },
            additionalAllocations: {
                seva: '2.5% - Cultural preservation',
                legal_defense: '0.5% - Community protection'
            },
            transparency: 'All fees are transparent and visible in every transaction'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get homepage placement pricing
exports.getHomepagePlacementPricing = async (req, res) => {
    try {
        const revenueModelService = require('../services/revenue/revenueModel.service.js');
        const pricing = await revenueModelService.getHomepagePlacementPricing();
        
        res.status(200).json({
            success: true,
            message: 'Homepage Premium Placement Pricing',
            ...pricing
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Compare homepage vs standalone pricing
exports.comparePlacementPricing = async (req, res) => {
    try {
        const revenueModelService = require('../services/revenue/revenueModel.service.js');
        const comparison = await revenueModelService.comparePlacementPricing();
        
        res.status(200).json({
            success: true,
            message: 'Homepage vs Standalone Marketplace Pricing Comparison',
            ...comparison
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Calculate homepage package deal
exports.calculateHomepagePackage = async (req, res) => {
    try {
        const { placements } = req.body;
        const revenueModelService = require('../services/revenue/revenueModel.service.js');
        const packageDeal = await revenueModelService.calculateHomepagePackage(placements);
        
        res.status(200).json({
            success: true,
            message: 'Homepage Placement Package Deal',
            ...packageDeal
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.FEE_STRUCTURE = FEE_STRUCTURE;

