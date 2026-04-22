const Users = require('../models/user.model.js');
const NFT = require('../models/NFTcollection.model.js');

// Get accessibility settings for a user
exports.getAccessibilitySettings = async (req, res) => {
    try {
        const { address } = req.params;

        if (!address) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address is required'
            });
        }

        const user = await Users.findOne({ 
            WalletAddress: address.toLowerCase() 
        });

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).send({
            status: true,
            settings: {
                accessibility: user.accessibility || {},
                voicePreferences: user.voicePreferences || {},
                elderVerification: user.elderVerification || {}
            }
        });
    } catch (error) {
        console.error('Get accessibility settings error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get accessibility settings'
        });
    }
};

// Update accessibility settings
exports.updateAccessibilitySettings = async (req, res) => {
    try {
        const { walletAddress, accessibility, voicePreferences } = req.body;

        if (!walletAddress) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address is required'
            });
        }

        const updateData = {};
        
        if (accessibility) {
            updateData.accessibility = accessibility;
        }
        
        if (voicePreferences) {
            updateData.voicePreferences = voicePreferences;
        }

        const user = await Users.findOneAndUpdate(
            { WalletAddress: walletAddress.toLowerCase() },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'Accessibility settings updated successfully',
            settings: {
                accessibility: user.accessibility,
                voicePreferences: user.voicePreferences
            }
        });
    } catch (error) {
        console.error('Update accessibility settings error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to update accessibility settings'
        });
    }
};

// Toggle elder mode
exports.toggleElderMode = async (req, res) => {
    try {
        const { walletAddress, enabled, settings } = req.body;

        if (!walletAddress) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address is required'
            });
        }

        const updateData = {
            'accessibility.elderMode': enabled,
            'accessibility.simplifiedUI': enabled,
            'accessibility.largeText': enabled,
            'voicePreferences.confirmationRequired': true
        };

        // Apply additional settings if provided
        if (settings) {
            if (settings.highContrast !== undefined) {
                updateData['accessibility.highContrast'] = settings.highContrast;
            }
            if (settings.voiceNavigation !== undefined) {
                updateData['accessibility.voiceNavigation'] = settings.voiceNavigation;
            }
            if (settings.preferredInput) {
                updateData['accessibility.preferredInput'] = settings.preferredInput;
            }
        }

        const user = await Users.findOneAndUpdate(
            { WalletAddress: walletAddress.toLowerCase() },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: `Elder mode ${enabled ? 'enabled' : 'disabled'} successfully`,
            elderMode: user.accessibility.elderMode,
            settings: user.accessibility
        });
    } catch (error) {
        console.error('Toggle elder mode error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to toggle elder mode'
        });
    }
};

// Request elder verification
exports.requestElderVerification = async (req, res) => {
    try {
        const { walletAddress, community, role, verifiedBy } = req.body;

        if (!walletAddress) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address is required'
            });
        }

        const user = await Users.findOneAndUpdate(
            { WalletAddress: walletAddress.toLowerCase() },
            {
                $set: {
                    'elderVerification.verificationStatus': 'pending',
                    'elderVerification.community': community,
                    'elderVerification.role': role || 'elder',
                    'elderVerification.verifiedBy': verifiedBy
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'Elder verification request submitted',
            verification: user.elderVerification
        });
    } catch (error) {
        console.error('Request elder verification error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to submit elder verification request'
        });
    }
};

// Verify elder (by another elder or admin)
exports.verifyElder = async (req, res) => {
    try {
        const { walletAddress, verifierAddress, approved } = req.body;

        if (!walletAddress || !verifierAddress) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address and verifier address are required'
            });
        }

        // Check if verifier is authorized
        const verifier = await Users.findOne({ 
            WalletAddress: verifierAddress.toLowerCase(),
            'elderVerification.isElder': true,
            'elderVerification.verificationStatus': 'verified'
        });

        if (!verifier && !req.body.isAdmin) {
            return res.status(403).send({
                status: false,
                message: 'Only verified elders or admins can verify others'
            });
        }

        const updateData = {
            'elderVerification.verificationStatus': approved ? 'verified' : 'unverified',
            'elderVerification.verifiedBy': verifierAddress,
            'elderVerification.verificationDate': new Date(),
            'elderVerification.isElder': approved
        };

        const user = await Users.findOneAndUpdate(
            { WalletAddress: walletAddress.toLowerCase() },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: approved ? 'Elder verification approved' : 'Elder verification rejected',
            verification: user.elderVerification
        });
    } catch (error) {
        console.error('Verify elder error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to verify elder'
        });
    }
};

// Validate sacred content access
exports.validateSacredContentAccess = async (req, res) => {
    try {
        const { nftId, walletAddress } = req.body;

        if (!nftId || !walletAddress) {
            return res.status(400).send({
                status: false,
                message: 'NFT ID and wallet address are required'
            });
        }

        // Get NFT details
        const nft = await NFT.findOne({ NftId: nftId });

        if (!nft) {
            return res.status(404).send({
                status: false,
                message: 'NFT not found'
            });
        }

        // Check if content is sacred/restricted
        const sacredStatus = nft.culturalTags?.sacredStatus;
        if (sacredStatus === 'public') {
            return res.status(200).send({
                status: true,
                hasAccess: true,
                accessLevel: 'full',
                message: 'Public content - no restrictions'
            });
        }

        // Get user details
        const user = await Users.findOne({ 
            WalletAddress: walletAddress.toLowerCase() 
        });

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        // Check if user has explicit access
        const accessRecord = user.sacredContentAccess?.find(
            access => access.contentId === nftId && 
                     (!access.expiresAt || access.expiresAt > new Date())
        );

        if (accessRecord) {
            return res.status(200).send({
                status: true,
                hasAccess: true,
                accessLevel: accessRecord.accessLevel,
                grantedBy: accessRecord.grantedBy,
                expiresAt: accessRecord.expiresAt
            });
        }

        // Check if user is a verified elder
        if (user.elderVerification?.isElder && 
            user.elderVerification?.verificationStatus === 'verified') {
            return res.status(200).send({
                status: true,
                hasAccess: true,
                accessLevel: 'full',
                reason: 'verified_elder'
            });
        }

        // Check if user is the creator
        if (nft.WalletAddress?.toLowerCase() === walletAddress.toLowerCase()) {
            return res.status(200).send({
                status: true,
                hasAccess: true,
                accessLevel: 'full',
                reason: 'creator'
            });
        }

        // Access denied
        return res.status(200).send({
            status: true,
            hasAccess: false,
            restrictionLevel: sacredStatus,
            message: sacredStatus === 'sacred' 
                ? 'This content is sacred and requires elder approval to access'
                : 'This content is restricted to community members'
        });
    } catch (error) {
        console.error('Validate sacred content access error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to validate access'
        });
    }
};

// Grant sacred content access (by elder)
exports.grantSacredContentAccess = async (req, res) => {
    try {
        const { 
            contentId, 
            userAddress, 
            elderAddress, 
            accessLevel = 'view',
            expiresAt 
        } = req.body;

        if (!contentId || !userAddress || !elderAddress) {
            return res.status(400).send({
                status: false,
                message: 'Content ID, user address, and elder address are required'
            });
        }

        // Verify elder status
        const elder = await Users.findOne({ 
            WalletAddress: elderAddress.toLowerCase(),
            'elderVerification.isElder': true,
            'elderVerification.verificationStatus': 'verified'
        });

        if (!elder) {
            return res.status(403).send({
                status: false,
                message: 'Only verified elders can grant sacred content access'
            });
        }

        // Grant access
        const accessRecord = {
            contentId,
            grantedBy: elderAddress,
            grantedAt: new Date(),
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            accessLevel
        };

        const user = await Users.findOneAndUpdate(
            { WalletAddress: userAddress.toLowerCase() },
            { 
                $push: { sacredContentAccess: accessRecord }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'Sacred content access granted successfully',
            access: accessRecord
        });
    } catch (error) {
        console.error('Grant sacred content access error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to grant access'
        });
    }
};

// Revoke sacred content access
exports.revokeSacredContentAccess = async (req, res) => {
    try {
        const { contentId, userAddress, elderAddress } = req.body;

        if (!contentId || !userAddress) {
            return res.status(400).send({
                status: false,
                message: 'Content ID and user address are required'
            });
        }

        // If elderAddress provided, verify they are the one who granted access
        if (elderAddress) {
            const elder = await Users.findOne({ 
                WalletAddress: elderAddress.toLowerCase(),
                'elderVerification.isElder': true
            });

            if (!elder) {
                return res.status(403).send({
                    status: false,
                    message: 'Not authorized to revoke access'
                });
            }
        }

        const user = await Users.findOneAndUpdate(
            { WalletAddress: userAddress.toLowerCase() },
            { 
                $pull: { 
                    sacredContentAccess: { contentId } 
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'Sacred content access revoked successfully'
        });
    } catch (error) {
        console.error('Revoke sacred content access error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to revoke access'
        });
    }
};

// Get list of verified elders
exports.getVerifiedElders = async (req, res) => {
    try {
        const { community } = req.query;

        let query = {
            'elderVerification.isElder': true,
            'elderVerification.verificationStatus': 'verified'
        };

        if (community) {
            query['elderVerification.community'] = community;
        }

        const elders = await Users.find(query).select(
            'WalletAddress UserName FirstName LastName tribalAffiliation elderVerification'
        );

        return res.status(200).send({
            status: true,
            count: elders.length,
            elders: elders.map(elder => ({
                walletAddress: elder.WalletAddress,
                name: elder.FirstName && elder.LastName 
                    ? `${elder.FirstName} ${elder.LastName}` 
                    : elder.UserName,
                tribalAffiliation: elder.tribalAffiliation,
                community: elder.elderVerification?.community,
                role: elder.elderVerification?.role,
                verifiedDate: elder.elderVerification?.verificationDate
            }))
        });
    } catch (error) {
        console.error('Get verified elders error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get verified elders'
        });
    }
};


// Backward-compatible route aliases used by ui.route.js
exports.getSettings = exports.getAccessibilitySettings;
exports.updateSettings = exports.updateAccessibilitySettings;
