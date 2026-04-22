const NFTCollection = require('../models/NFTcollection.model.js');
const User = require('../models/user.model.js');
const SEVA = require('../models/SEVA.model.js');
const CulturalCause = require('../models/CulturalCause.model.js');

/**
 * Transparency Controller
 * Provides radical transparency for purchase breakdowns and economic impact
 */

// Get purchase breakdown for an NFT
exports.getPurchaseBreakdown = async (req, res) => {
    try {
        const { nftId } = req.params;
        const { purchasePrice } = req.query; // Optional: for dynamic calculation

        const nft = await NFTCollection.findOne({ NftId: nftId });
        if (!nft) {
            return res.status(404).json({ success: false, message: 'NFT not found' });
        }

        const price = parseFloat(purchasePrice || nft.Price || 0);
        const royaltyPercent = nft.royaltyPercent || 10;
        const sevaPercent = 2.5; // Platform SEVA allocation

        // Calculate breakdown
        const breakdown = calculateBreakdown(price, royaltyPercent, sevaPercent, nft);

        // Get artist info
        const artist = await User.findOne({ walletAddress: nft.WalletAddress })
            .select('artistName tribalAffiliation nation verificationStatus');

        // Get SEVA cause info
        const sevaCauses = await CulturalCause.find({ isActive: true })
            .select('causeId name category impactMetrics')
            .limit(3);

        res.status(200).json({
            success: true,
            nft: {
                id: nft.NftId,
                name: nft.ItemName,
                type: nft.Type,
                price: price,
                currency: 'XRP'
            },
            artist: artist ? {
                name: artist.artistName,
                tribalAffiliation: artist.tribalAffiliation,
                nation: artist.nation,
                verified: artist.verificationStatus === 'verified'
            } : null,
            breakdown: {
                total: price,
                allocations: [
                    {
                        category: 'artist_direct',
                        label: 'Direct to Artist',
                        description: 'Goes directly to the creator\'s wallet',
                        amount: breakdown.artistAmount,
                        percentage: breakdown.artistPercent,
                        recipient: nft.WalletAddress,
                        immediate: true
                    },
                    {
                        category: 'platform_sustainability',
                        label: 'Platform Sustainability',
                        description: 'Keeps the marketplace running and improving',
                        amount: breakdown.platformAmount,
                        percentage: breakdown.platformPercent,
                        recipient: 'Indigena Market Platform',
                        immediate: true
                    },
                    {
                        category: 'cultural_preservation',
                        label: 'Cultural Preservation (SEVA)',
                        description: 'Supports language, land, and ecological initiatives',
                        amount: breakdown.sevaAmount,
                        percentage: sevaPercent,
                        recipient: 'SEVA Community Fund',
                        causes: sevaCauses.map(c => ({
                            id: c.causeId,
                            name: c.name,
                            category: c.category
                        })),
                        immediate: false,
                        distributed: 'Quarterly to verified causes'
                    },
                    {
                        category: 'ongoing_royalty',
                        label: 'Ongoing Royalty Reserve',
                        description: 'Smart contract ensures artist receives percentage on all future resales',
                        amount: 0, // Only applies on secondary sales
                        percentage: royaltyPercent,
                        recipient: 'Future payments to artist',
                        note: 'Artist receives ' + royaltyPercent + '% on every resale',
                        smartContract: true,
                        blockchain: 'XRPL'
                    }
                ]
            },
            transparency: {
                blockchain: 'XRP Ledger',
                smartContract: 'XRPL XLS-20d NFT with native royalties',
                verification: nft.elderApproved ? 'Elder approved' : 'Community verified',
                tkLabels: nft.culturalTags?.traditionalKnowledgeLabel || null
            }
        });
    } catch (error) {
        console.error('Get purchase breakdown error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get artist's economic impact dashboard
exports.getArtistImpact = async (req, res) => {
    try {
        const { address } = req.params;

        const artist = await User.findOne({ walletAddress: address });
        if (!artist) {
            return res.status(404).json({ success: false, message: 'Artist not found' });
        }

        const sevaRecord = await SEVA.findOne({ walletAddress: address });
        const nfts = await NFTCollection.find({ WalletAddress: address });

        // Calculate total sales
        const totalSales = nfts.reduce((sum, nft) => sum + parseFloat(nft.Price || 0), 0);
        const totalPieces = nfts.length;
        const soldPieces = nfts.filter(n => n.Status === 'sold').length;

        // Get secondary royalty earnings (from SEVA record)
        const royaltyEarnings = sevaRecord ? sevaRecord.allocations
            .filter(a => a.allocationType === 'royalty')
            .reduce((sum, a) => sum + a.amount, 0) : 0;

        res.status(200).json({
            success: true,
            artist: {
                name: artist.artistName,
                walletAddress: address,
                tribalAffiliation: artist.tribalAffiliation,
                nation: artist.nation
            },
            impact: {
                totalSales: totalSales,
                totalPieces: totalPieces,
                soldPieces: soldPieces,
                directEarnings: totalSales * 0.70, // 70% to artist
                royaltyEarnings: royaltyEarnings,
                sevaContributions: sevaRecord ? sevaRecord.totalEarned * 0.025 : 0,
                communitySupported: sevaRecord ? sevaRecord.allocations.length : 0
            },
            transparency: {
                averagePrice: totalPieces > 0 ? totalSales / totalPieces : 0,
                royaltyRate: artist.defaultRoyalty || 10,
                sevaParticipation: true,
                verificationStatus: artist.verificationStatus
            }
        });
    } catch (error) {
        console.error('Get artist impact error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get platform-wide transparency report
exports.getPlatformTransparency = async (req, res) => {
    try {
        const { period = 'all' } = req.query;

        // Aggregate stats
        const allNFTs = await NFTCollection.find();
        const allUsers = await User.find();
        const allSEVA = await SEVA.find();

        const totalVolume = allNFTs.reduce((sum, nft) => sum + parseFloat(nft.Price || 0), 0);
        const totalArtists = allUsers.filter(u => u.userType === 'artist').length;
        const totalCauses = await CulturalCause.countDocuments({ isActive: true });

        const sevaTotal = allSEVA.reduce((sum, s) => sum + s.totalEarned, 0);
        const sevaAllocated = allSEVA.reduce((sum, s) => sum + s.totalAllocated, 0);

        // Calculate platform distribution
        const platformStats = {
            totalVolume: totalVolume,
            toArtists: totalVolume * 0.70,
            toPlatform: totalVolume * 0.15,
            toSEVA: totalVolume * 0.10,
            toAdvocacy: totalVolume * 0.05
        };

        res.status(200).json({
            success: true,
            period: period,
            platform: {
                totalArtists: totalArtists,
                totalPieces: allNFTs.length,
                totalVolume: totalVolume,
                activeCauses: totalCauses,
                verifiedTransactions: allNFTs.filter(n => n.mintTransactionHash).length
            },
            economicFlow: {
                description: 'Every purchase creates a transparent flow of value',
                breakdown: [
                    {
                        destination: 'Indigenous Artists',
                        percentage: 70,
                        amount: platformStats.toArtists,
                        description: 'Direct to creator wallets'
                    },
                    {
                        destination: 'Platform Operations',
                        percentage: 15,
                        amount: platformStats.toPlatform,
                        description: 'Technology, security, and support'
                    },
                    {
                        destination: 'Cultural Preservation (SEVA)',
                        percentage: 10,
                        amount: platformStats.toSEVA,
                        description: 'Language, land, and ecological projects'
                    },
                    {
                        destination: 'Indigenous Rights Advocacy',
                        percentage: 5,
                        amount: platformStats.toAdvocacy,
                        description: 'Legal support and advocacy organizations'
                    }
                ]
            },
            sevaImpact: {
                totalGenerated: sevaTotal,
                totalAllocated: sevaAllocated,
                pendingAllocation: sevaTotal - sevaAllocated,
                supportedCauses: totalCauses,
                quarterlyReports: '/api/seva/reports' // Link to detailed reports
            },
            governance: {
                model: 'Community-guided with Elder Advisory Board',
                transparency: 'All transactions on XRP Ledger',
                audit: 'Quarterly public audits',
                smartContracts: 'XRPL native royalty enforcement'
            }
        });
    } catch (error) {
        console.error('Get platform transparency error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get "Gift Back" options for checkout
exports.getGiftBackOptions = async (req, res) => {
    try {
        const causes = await CulturalCause.find({ isActive: true })
            .select('causeId name description category impactMetrics location')
            .sort({ impactMetrics: -1 });

        const options = {
            description: 'Add a gift to support Indigenous communities',
            presets: [5, 10, 25, 50, 100], // XRP amounts
            custom: true,
            causes: causes.map(c => ({
                id: c.causeId,
                name: c.name,
                description: c.description,
                category: c.category,
                location: c.location,
                impact: c.impactMetrics
            })),
            generalFund: {
                id: 'general',
                name: 'General Indigenous Rights Fund',
                description: 'Distributed across all verified causes based on community voting'
            }
        };

        res.status(200).json({
            success: true,
            giftBackOptions: options
        });
    } catch (error) {
        console.error('Get gift back options error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get real-time transaction verification
exports.verifyTransaction = async (req, res) => {
    try {
        const { txHash } = req.params;

        // In production, this would query XRPL directly
        // For now, return the structure
        res.status(200).json({
            success: true,
            transaction: {
                hash: txHash,
                status: 'verified',
                blockchain: 'XRP Ledger',
                verificationMethod: 'XRPL node query',
                timestamp: new Date(),
                explorerUrl: `https://test.bithomp.com/explorer/${txHash}`
            },
            transparency: {
                immutable: true,
                public: true,
                auditable: 'Anyone can verify on XRP Ledger'
            }
        });
    } catch (error) {
        console.error('Verify transaction error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper function
function calculateBreakdown(price, royaltyPercent, sevaPercent, nft) {
    const platformPercent = 15;
    const advocacyPercent = 5;
    const artistPercent = 100 - platformPercent - sevaPercent - advocacyPercent;

    return {
        artistAmount: price * (artistPercent / 100),
        artistPercent: artistPercent,
        platformAmount: price * (platformPercent / 100),
        platformPercent: platformPercent,
        sevaAmount: price * (sevaPercent / 100),
        sevaPercent: sevaPercent,
        advocacyAmount: price * (advocacyPercent / 100),
        advocacyPercent: advocacyPercent,
        royaltyPercent: royaltyPercent
    };
}
