const OfflineSync = require('../models/OfflineSync.model.js');
const User = require('../models/user.model.js');
const NFTCollection = require('../models/NFTcollection.model.js');
const PhysicalItem = require('../models/PhysicalItem.model.js');
const { v4: uuidv4 } = require('uuid');

/**
 * Community Hub Controller
 * Manages the "Digital Champion" facilitator workflow for offline-first creator onboarding
 */

// Register a new pending upload from offline creator
exports.registerPendingUpload = async (req, res) => {
    try {
        const {
            creatorAddress,
            facilitatorAddress,
            uploadType,
            localData,
            nftData
        } = req.body;

        // Validate creator exists or create minimal profile
        let creator = await User.findOne({ walletAddress: creatorAddress });
        if (!creator) {
            // Create minimal profile for offline creators
            creator = new User({
                walletAddress: creatorAddress,
                createdViaHub: true,
                hubFacilitator: facilitatorAddress,
                verificationStatus: 'pending_community'
            });
            await creator.save();
        }

        const uploadId = uuidv4();
        const pendingUpload = new OfflineSync({
            uploadId,
            creatorAddress,
            facilitatorAddress,
            uploadType,
            localData: {
                ...localData,
                capturedAt: new Date()
            },
            nftData,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        });

        await pendingUpload.save();

        res.status(201).json({
            success: true,
            uploadId,
            message: 'Upload registered for sync when connectivity available',
            status: 'pending'
        });
    } catch (error) {
        console.error('Register pending upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all pending uploads for a creator
exports.getPendingUploads = async (req, res) => {
    try {
        const { address } = req.params;
        const { status } = req.query;

        let query = { creatorAddress: address };
        if (status) query.status = status;

        const uploads = await OfflineSync.find(query)
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            count: uploads.length,
            uploads
        });
    } catch (error) {
        console.error('Get pending uploads error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Sync pending upload when connectivity available
exports.syncUpload = async (req, res) => {
    try {
        const { uploadId } = req.params;
        const { ipfsHashes, transactionHash, xrplTokenId } = req.body;

        const upload = await OfflineSync.findOne({ uploadId });
        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload not found' });
        }

        if (upload.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Upload already completed' });
        }

        // Record sync attempt
        upload.syncAttempts.push({
            attemptedAt: new Date(),
            status: 'uploading',
            networkType: req.body.networkType || 'wifi'
        });

        upload.status = 'uploading';
        await upload.save();

        // Create the actual NFT record if this is an NFT listing
        if (upload.uploadType === 'nft_listing' && xrplTokenId) {
            const nftData = upload.nftData;
            const newNFT = new NFTCollection({
                NftId: uuidv4(),
                ItemName: nftData.itemName,
                Description: nftData.description,
                Type: nftData.type,
                Price: nftData.price,
                WalletAddress: upload.creatorAddress,
                xrplTokenId: xrplTokenId,
                mintTransactionHash: transactionHash,
                Pinatahash: ipfsHashes?.metadata,
                Imageurl: ipfsHashes?.image,
                voiceStoryUrl: ipfsHashes?.voiceMemo,
                voiceStory: nftData.voiceStory,
                royaltyPercent: nftData.royaltyPercent,
                culturalTags: nftData.culturalTags,
                IsActive: 'true',
                createdViaHub: true,
                hubFacilitator: upload.facilitatorAddress
            });

            await newNFT.save();

            // Update upload with results
            upload.uploadResult = {
                nftId: newNFT.NftId,
                transactionHash,
                xrplTokenId,
                ipfsHash: ipfsHashes?.metadata,
                uploadedAt: new Date()
            };
        }

        upload.status = 'completed';
        await upload.save();

        res.status(200).json({
            success: true,
            message: 'Upload synced successfully',
            uploadId,
            result: upload.uploadResult
        });
    } catch (error) {
        console.error('Sync upload error:', error);
        
        // Record failed attempt
        const upload = await OfflineSync.findOne({ uploadId: req.params.uploadId });
        if (upload) {
            upload.syncAttempts.push({
                attemptedAt: new Date(),
                status: 'failed',
                errorMessage: error.message
            });
            upload.status = 'failed';
            await upload.save();
        }

        res.status(500).json({ success: false, message: error.message });
    }
};

// Get hub dashboard for facilitator
exports.getHubDashboard = async (req, res) => {
    try {
        const { facilitatorAddress } = req.params;

        const stats = await OfflineSync.aggregate([
            { $match: { facilitatorAddress } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentUploads = await OfflineSync.find({ facilitatorAddress })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('uploadId creatorAddress uploadType status createdAt');

        const creators = await User.find({ hubFacilitator: facilitatorAddress })
            .select('walletAddress artistName verificationStatus createdAt');

        res.status(200).json({
            success: true,
            stats: {
                total: stats.reduce((acc, s) => acc + s.count, 0),
                pending: stats.find(s => s._id === 'pending')?.count || 0,
                completed: stats.find(s => s._id === 'completed')?.count || 0,
                failed: stats.find(s => s._id === 'failed')?.count || 0
            },
            recentUploads,
            creatorsSupported: creators.length,
            creators
        });
    } catch (error) {
        console.error('Get hub dashboard error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Batch sync multiple uploads
exports.batchSync = async (req, res) => {
    try {
        const { uploadIds } = req.body;
        const results = [];

        for (const uploadId of uploadIds) {
            try {
                const upload = await OfflineSync.findOne({ uploadId });
                if (!upload || upload.status === 'completed') {
                    results.push({ uploadId, status: 'skipped', reason: 'Not found or already completed' });
                    continue;
                }

                // Mark for processing
                upload.status = 'uploading';
                await upload.save();

                results.push({ uploadId, status: 'queued' });
            } catch (err) {
                results.push({ uploadId, status: 'error', error: err.message });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Batch sync initiated',
            results
        });
    } catch (error) {
        console.error('Batch sync error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel pending upload
exports.cancelUpload = async (req, res) => {
    try {
        const { uploadId } = req.params;

        const upload = await OfflineSync.findOneAndUpdate(
            { uploadId, status: { $in: ['pending', 'failed'] } },
            { status: 'cancelled' },
            { new: true }
        );

        if (!upload) {
            return res.status(404).json({ success: false, message: 'Upload not found or cannot be cancelled' });
        }

        res.status(200).json({
            success: true,
            message: 'Upload cancelled',
            uploadId
        });
    } catch (error) {
        console.error('Cancel upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
