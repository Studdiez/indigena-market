const SEVA = require('../models/SEVA.model.js');
const CulturalCause = require('../models/CulturalCause.model.js');
const Users = require('../models/user.model.js');
const NFT = require('../models/NFTcollection.model.js');

// Get SEVA dashboard for a user
exports.getDashboard = async (req, res) => {
    try {
        const { address } = req.params;

        if (!address) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address is required'
            });
        }

        const walletAddress = address.toLowerCase();

        // Get or create SEVA record
        let sevaRecord = await SEVA.findOne({ walletAddress });

        if (!sevaRecord) {
            sevaRecord = await SEVA.create({
                walletAddress,
                totalSEVAEarned: 0,
                totalSEVADonated: 0,
                currentBalance: 0,
                allocations: [],
                earnings: []
            });
        }

        // Get user's impact metrics from user record
        const user = await Users.findOne({ WalletAddress: walletAddress });

        return res.status(200).send({
            status: true,
            dashboard: {
                walletAddress: sevaRecord.walletAddress,
                balance: sevaRecord.currentBalance,
                totalEarned: sevaRecord.totalSEVAEarned,
                totalDonated: sevaRecord.totalSEVADonated,
                impact: {
                    landProtected: user?.landProtected || sevaRecord.totalLandProtected || 0,
                    languageLessonsFunded: user?.languageLessonsFunded || sevaRecord.totalLanguageLessonsFunded || 0,
                    communitiesSupported: sevaRecord.communitiesSupported || []
                },
                recentAllocations: sevaRecord.allocations.slice(-5).reverse(),
                recentEarnings: sevaRecord.earnings.slice(-5).reverse()
            }
        });
    } catch (error) {
        console.error('Get SEVA dashboard error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get SEVA dashboard',
            error: error.message
        });
    }
};

// Allocate SEVA percentage for an NFT
exports.allocateSEVA = async (req, res) => {
    try {
        const { nftId, sevaAllocation, walletAddress } = req.body;

        if (!nftId || sevaAllocation === undefined || !walletAddress) {
            return res.status(400).send({
                status: false,
                message: 'NFT ID, SEVA allocation percentage, and wallet address are required'
            });
        }

        // Validate SEVA allocation (0-100%)
        if (sevaAllocation < 0 || sevaAllocation > 100) {
            return res.status(400).send({
                status: false,
                message: 'SEVA allocation must be between 0% and 100%'
            });
        }

        const address = walletAddress.toLowerCase();

        // Update NFT with SEVA allocation
        const updatedNFT = await NFT.findOneAndUpdate(
            { NftId: nftId, WalletAddress: address },
            { sevaAllocation: sevaAllocation },
            { new: true }
        );

        if (!updatedNFT) {
            return res.status(404).send({
                status: false,
                message: 'NFT not found or you do not own this NFT'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'SEVA allocation updated successfully',
            nft: {
                nftId: updatedNFT.NftId,
                sevaAllocation: updatedNFT.sevaAllocation,
                royaltyPercent: updatedNFT.royaltyPercent
            }
        });
    } catch (error) {
        console.error('Allocate SEVA error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to allocate SEVA',
            error: error.message
        });
    }
};

// Donate SEVA to a cultural cause
exports.donateSEVA = async (req, res) => {
    try {
        const { walletAddress, causeId, amount, message } = req.body;

        if (!walletAddress || !causeId || !amount) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address, cause ID, and amount are required'
            });
        }

        const address = walletAddress.toLowerCase();

        // Get user's SEVA record
        const sevaRecord = await SEVA.findOne({ walletAddress: address });

        if (!sevaRecord || sevaRecord.currentBalance < amount) {
            return res.status(400).send({
                status: false,
                message: 'Insufficient SEVA balance'
            });
        }

        // Get cause details
        const cause = await CulturalCause.findOne({ causeId });

        if (!cause) {
            return res.status(404).send({
                status: false,
                message: 'Cultural cause not found'
            });
        }

        if (cause.status !== 'active') {
            return res.status(400).send({
                status: false,
                message: 'This cause is not currently accepting donations'
            });
        }

        // Create allocation record
        const allocation = {
            causeId: cause.causeId,
            causeName: cause.name,
            amount: amount,
            landProtected: cause.category === 'land_protection' ? amount / 100 : 0,
            languageLessonsFunded: cause.category === 'language_preservation' ? Math.floor(amount / 50) : 0,
            message: message || ''
        };

        // Update SEVA record
        sevaRecord.allocations.push(allocation);
        sevaRecord.totalSEVADonated += amount;
        sevaRecord.currentBalance -= amount;
        sevaRecord.totalLandProtected += allocation.landProtected;
        sevaRecord.totalLanguageLessonsFunded += allocation.languageLessonsFunded;

        // Update communities supported
        const existingCommunity = sevaRecord.communitiesSupported.find(
            c => c.community === cause.community
        );
        if (existingCommunity) {
            existingCommunity.totalDonated += amount;
        } else {
            sevaRecord.communitiesSupported.push({
                community: cause.community,
                totalDonated: amount
            });
        }

        await sevaRecord.save();

        // Update cause funding
        cause.currentFunding += amount;
        cause.donations.push({
            walletAddress: address,
            amount: amount,
            message: message || ''
        });

        // Update cause impact metrics
        if (cause.category === 'land_protection') {
            cause.landProtected += amount / 100;
        } else if (cause.category === 'language_preservation') {
            cause.languageLessonsFunded += Math.floor(amount / 50);
        }

        await cause.save();

        // Update user's impact metrics
        await Users.findOneAndUpdate(
            { WalletAddress: address },
            {
                $inc: {
                    totalSEVADonated: amount,
                    landProtected: allocation.landProtected,
                    languageLessonsFunded: allocation.languageLessonsFunded
                }
            }
        );

        return res.status(200).send({
            status: true,
            message: 'SEVA donated successfully',
            donation: {
                cause: cause.name,
                amount: amount,
                impact: {
                    landProtected: allocation.landProtected,
                    languageLessonsFunded: allocation.languageLessonsFunded
                }
            },
            remainingBalance: sevaRecord.currentBalance
        });
    } catch (error) {
        console.error('Donate SEVA error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to donate SEVA',
            error: error.message
        });
    }
};

// Get all cultural causes
exports.getCulturalCauses = async (req, res) => {
    try {
        const { category, status, community } = req.query;

        let query = {};
        if (category) query.category = category;
        if (status) query.status = status;
        if (community) query.community = community;

        const causes = await CulturalCause.find(query).sort({ createdAt: -1 });

        return res.status(200).send({
            status: true,
            count: causes.length,
            causes: causes.map(cause => ({
                causeId: cause.causeId,
                name: cause.name,
                description: cause.description,
                community: cause.community,
                nation: cause.nation,
                category: cause.category,
                fundingGoal: cause.fundingGoal,
                currentFunding: cause.currentFunding,
                progress: (cause.currentFunding / cause.fundingGoal * 100).toFixed(2),
                impact: {
                    landProtected: cause.landProtected,
                    languageLessonsFunded: cause.languageLessonsFunded,
                    artistsSupported: cause.artistsSupported
                },
                status: cause.status,
                imageUrl: cause.imageUrl,
                verifiedByElder: cause.verifiedByElder,
                gpsCoordinates: cause.gpsCoordinates
            }))
        });
    } catch (error) {
        console.error('Get cultural causes error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get cultural causes',
            error: error.message
        });
    }
};

// Get single cultural cause details
exports.getCulturalCause = async (req, res) => {
    try {
        const { causeId } = req.params;

        const cause = await CulturalCause.findOne({ causeId });

        if (!cause) {
            return res.status(404).send({
                status: false,
                message: 'Cultural cause not found'
            });
        }

        return res.status(200).send({
            status: true,
            cause: {
                causeId: cause.causeId,
                name: cause.name,
                description: cause.description,
                community: cause.community,
                nation: cause.nation,
                category: cause.category,
                region: cause.region,
                gpsCoordinates: cause.gpsCoordinates,
                fundingGoal: cause.fundingGoal,
                currentFunding: cause.currentFunding,
                progress: (cause.currentFunding / cause.fundingGoal * 100).toFixed(2),
                impact: {
                    landProtected: cause.landProtected,
                    languageLessonsFunded: cause.languageLessonsFunded,
                    artistsSupported: cause.artistsSupported
                },
                status: cause.status,
                imageUrl: cause.imageUrl,
                videoUrl: cause.videoUrl,
                stewards: cause.stewards,
                verifiedByElder: cause.verifiedByElder,
                elderVerificationDate: cause.elderVerificationDate,
                startDate: cause.startDate,
                targetCompletionDate: cause.targetCompletionDate,
                recentDonations: cause.donations.slice(-5).reverse()
            }
        });
    } catch (error) {
        console.error('Get cultural cause error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get cultural cause',
            error: error.message
        });
    }
};

// Record SEVA earnings from NFT sale
exports.recordSEVAEarnings = async (req, res) => {
    try {
        const { walletAddress, nftId, saleAmount, sevaEarned, transactionHash } = req.body;

        if (!walletAddress || !nftId || !saleAmount || sevaEarned === undefined) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address, NFT ID, sale amount, and SEVA earned are required'
            });
        }

        const address = walletAddress.toLowerCase();

        // Get or create SEVA record
        let sevaRecord = await SEVA.findOne({ walletAddress: address });

        if (!sevaRecord) {
            sevaRecord = new SEVA({
                walletAddress: address,
                totalSEVAEarned: 0,
                totalSEVADonated: 0,
                currentBalance: 0,
                allocations: [],
                earnings: []
            });
        }

        // Record earning
        const earning = {
            nftId,
            saleAmount,
            sevaEarned,
            transactionHash: transactionHash || '',
            timestamp: new Date()
        };

        sevaRecord.earnings.push(earning);
        sevaRecord.totalSEVAEarned += sevaEarned;
        sevaRecord.currentBalance += sevaEarned;

        await sevaRecord.save();

        // Update user's SEVA totals
        await Users.findOneAndUpdate(
            { WalletAddress: address },
            {
                $inc: { totalSEVAEarned: sevaEarned }
            }
        );

        return res.status(200).send({
            status: true,
            message: 'SEVA earnings recorded successfully',
            earning: earning,
            newBalance: sevaRecord.currentBalance,
            totalEarned: sevaRecord.totalSEVAEarned
        });
    } catch (error) {
        console.error('Record SEVA earnings error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to record SEVA earnings',
            error: error.message
        });
    }
};

// Get SEVA allocation history
exports.getAllocationHistory = async (req, res) => {
    try {
        const { address } = req.params;
        const { page = 1, limit = 20 } = req.query;

        if (!address) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address is required'
            });
        }

        const walletAddress = address.toLowerCase();
        const sevaRecord = await SEVA.findOne({ walletAddress });

        if (!sevaRecord) {
            return res.status(200).send({
                status: true,
                allocations: [],
                total: 0
            });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedAllocations = sevaRecord.allocations
            .slice(startIndex, endIndex)
            .reverse();

        return res.status(200).send({
            status: true,
            allocations: paginatedAllocations,
            total: sevaRecord.allocations.length,
            page: parseInt(page),
            totalPages: Math.ceil(sevaRecord.allocations.length / limit)
        });
    } catch (error) {
        console.error('Get allocation history error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get allocation history',
            error: error.message
        });
    }
};

// Get platform-wide SEVA impact statistics
exports.getPlatformStats = async (req, res) => {
    try {
        const stats = await SEVA.aggregate([
            {
                $group: {
                    _id: null,
                    totalSEVAEarned: { $sum: '$totalSEVAEarned' },
                    totalSEVADonated: { $sum: '$totalSEVADonated' },
                    totalUsers: { $sum: 1 }
                }
            }
        ]);

        const causeStats = await CulturalCause.aggregate([
            {
                $group: {
                    _id: null,
                    totalCauses: { $sum: 1 },
                    totalFunding: { $sum: '$currentFunding' },
                    totalLandProtected: { $sum: '$landProtected' },
                    totalLanguageLessons: { $sum: '$languageLessonsFunded' }
                }
            }
        ]);

        return res.status(200).send({
            status: true,
            stats: {
                seva: stats[0] || {
                    totalSEVAEarned: 0,
                    totalSEVADonated: 0,
                    totalUsers: 0
                },
                causes: causeStats[0] || {
                    totalCauses: 0,
                    totalFunding: 0,
                    totalLandProtected: 0,
                    totalLanguageLessons: 0
                }
            }
        });
    } catch (error) {
        console.error('Get platform stats error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get platform stats',
            error: error.message
        });
    }
};
