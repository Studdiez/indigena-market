const SacredContent = require('../models/SacredContent.model.js');
const Users = require('../models/user.model.js');

// Create sacred content record
exports.createSacredContent = async (req, res) => {
    try {
        const { 
            nftId, 
            title, 
            description, 
            contentType,
            restrictionLevel,
            creator,
            culturalProtocol,
            approvers
        } = req.body;

        const contentId = 'sacred_' + Date.now();

        const content = await SacredContent.create({
            contentId,
            nftId,
            title,
            description,
            contentType,
            restrictionLevel,
            creator,
            culturalProtocol,
            approvers,
            audit: {
                createdAt: new Date(),
                createdBy: creator?.walletAddress
            }
        });

        return res.status(201).send({
            status: true,
            message: 'Sacred content record created',
            content: {
                contentId: content.contentId,
                restrictionLevel: content.restrictionLevel
            }
        });
    } catch (error) {
        console.error('Create sacred content error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to create sacred content record'
        });
    }
};

// Request access to sacred content
exports.requestAccess = async (req, res) => {
    try {
        const { contentId, user, userName, purpose, community } = req.body;

        const content = await SacredContent.findOne({ contentId });

        if (!content) {
            return res.status(404).send({
                status: false,
                message: 'Content not found'
            });
        }

        const requestId = 'req_' + Date.now();

        content.accessRequests.push({
            requestId,
            user: user.toLowerCase(),
            userName,
            purpose,
            community,
            status: 'pending'
        });

        await content.save();

        return res.status(200).send({
            status: true,
            message: 'Access request submitted',
            requestId
        });
    } catch (error) {
        console.error('Request access error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to submit access request'
        });
    }
};

// Review access request (elder only)
exports.reviewAccessRequest = async (req, res) => {
    try {
        const { contentId, requestId, elderAddress, approved, responseMessage, accessLevel } = req.body;

        // Verify elder
        const elder = await Users.findOne({
            WalletAddress: elderAddress.toLowerCase(),
            'elderVerification.isElder': true,
            'elderVerification.verificationStatus': 'verified'
        });

        if (!elder) {
            return res.status(403).send({
                status: false,
                message: 'Only verified elders can review access requests'
            });
        }

        const content = await SacredContent.findOne({ contentId });

        if (!content) {
            return res.status(404).send({
                status: false,
                message: 'Content not found'
            });
        }

        const request = content.accessRequests.find(r => r.requestId === requestId);

        if (!request) {
            return res.status(404).send({
                status: false,
                message: 'Request not found'
            });
        }

        request.status = approved ? 'approved' : 'rejected';
        request.reviewedBy = elderAddress;
        request.reviewedAt = new Date();
        request.responseMessage = responseMessage;

        if (approved) {
            request.accessLevel = accessLevel || 'view';
            request.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            // Add to approved access
            content.approvedAccess.push({
                user: request.user,
                grantedBy: elderAddress,
                grantedAt: new Date(),
                expiresAt: request.expiresAt,
                accessLevel: request.accessLevel
            });
        }

        await content.save();

        return res.status(200).send({
            status: true,
            message: approved ? 'Access approved' : 'Access denied',
            request
        });
    } catch (error) {
        console.error('Review access request error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to review request'
        });
    }
};

// Verify access
exports.verifyAccess = async (req, res) => {
    try {
        const contentId = req.params.contentId || req.body.contentId || req.query.contentId;
        const userAddress = req.query.userAddress || req.body.userAddress || req.body.user || req.query.user;

        const content = await SacredContent.findOne({ contentId });

        if (!content) {
            return res.status(404).send({
                status: false,
                message: 'Content not found'
            });
        }

        // Check if public
        if (content.restrictionLevel === 'public') {
            return res.status(200).send({
                status: true,
                hasAccess: true,
                accessLevel: 'full'
            });
        }

        // Check approved access
        const approved = content.approvedAccess.find(a => 
            a.user.toLowerCase() === userAddress.toLowerCase() &&
            (!a.expiresAt || a.expiresAt > new Date())
        );

        if (approved) {
            // Log access
            content.accessLog.push({
                user: userAddress.toLowerCase(),
                accessedAt: new Date(),
                accessMethod: 'view'
            });
            await content.save();

            return res.status(200).send({
                status: true,
                hasAccess: true,
                accessLevel: approved.accessLevel,
                expiresAt: approved.expiresAt
            });
        }

        // Check if user is an approver (elder)
        const isApprover = content.approvers.includes(userAddress.toLowerCase());

        if (isApprover) {
            return res.status(200).send({
                status: true,
                hasAccess: true,
                accessLevel: 'full',
                role: 'approver'
            });
        }

        // Check pending request
        const pendingRequest = content.accessRequests.find(r =>
            r.user.toLowerCase() === userAddress.toLowerCase() &&
            r.status === 'pending'
        );

        if (pendingRequest) {
            return res.status(200).send({
                status: true,
                hasAccess: false,
                pendingRequest: true,
                message: 'Access request pending approval'
            });
        }

        return res.status(200).send({
            status: true,
            hasAccess: false,
            restrictionLevel: content.restrictionLevel,
            message: 'Access requires approval'
        });
    } catch (error) {
        console.error('Verify access error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to verify access'
        });
    }
};

// Get access requests (for elders)
exports.getAccessRequests = async (req, res) => {
    try {
        const { contentId } = req.params;
        const { status } = req.query;

        const content = await SacredContent.findOne({ contentId });

        if (!content) {
            return res.status(404).send({
                status: false,
                message: 'Content not found'
            });
        }

        let requests = content.accessRequests;

        if (status) {
            requests = requests.filter(r => r.status === status);
        }

        return res.status(200).send({
            status: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error('Get access requests error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get access requests'
        });
    }
};

// Log content access
exports.logAccess = async (req, res) => {
    try {
        const { contentId, user, context, accessMethod, ipAddress, deviceInfo } = req.body;

        const content = await SacredContent.findOne({ contentId });

        if (!content) {
            return res.status(404).send({
                status: false,
                message: 'Content not found'
            });
        }

        content.accessLog.push({
            user: user.toLowerCase(),
            accessedAt: new Date(),
            context,
            accessMethod,
            ipAddress,
            deviceInfo
        });

        await content.save();

        return res.status(200).send({
            status: true,
            message: 'Access logged'
        });
    } catch (error) {
        console.error('Log access error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to log access'
        });
    }
};

// Get sacred content by creator
exports.getByCreator = async (req, res) => {
    try {
        const { address } = req.params;

        const contents = await SacredContent.find({
            'creator.walletAddress': address.toLowerCase()
        });

        return res.status(200).send({
            status: true,
            count: contents.length,
            contents: contents.map(c => ({
                contentId: c.contentId,
                title: c.title,
                restrictionLevel: c.restrictionLevel,
                restrictionLevel: c.restrictionLevel,
                accessRequestCount: c.accessRequests.filter(r => r.status === 'pending').length
            }))
        });
    } catch (error) {
        console.error('Get by creator error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get content'
        });
    }
};


// Compatibility handlers for legacy route names in ui.route.js
exports.registerSacredContent = exports.createSacredContent;
exports.elderApproval = exports.reviewAccessRequest;

exports.getSacredContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const content = await SacredContent.findOne({ contentId });
        if (!content) {
            return res.status(404).send({ status: false, message: 'Content not found' });
        }
        return res.status(200).send({ status: true, content });
    } catch (error) {
        console.error('Get sacred content error:', error);
        return res.status(500).send({ status: false, message: 'Failed to get sacred content' });
    }
};

exports.getUserAccessList = async (req, res) => {
    try {
        const { address } = req.params;
        const user = address.toLowerCase();
        const contents = await SacredContent.find({
            $or: [
                { 'approvedAccess.user': user },
                { 'accessRequests.user': user },
                { 'creator.walletAddress': user }
            ]
        }).select('contentId title restrictionLevel approvedAccess accessRequests creator');

        return res.status(200).send({
            status: true,
            count: contents.length,
            contents: contents.map((c) => ({
                contentId: c.contentId,
                title: c.title,
                restrictionLevel: c.restrictionLevel,
                hasApprovedAccess: c.approvedAccess.some((a) => a.user?.toLowerCase() === user),
                hasPendingRequest: c.accessRequests.some((r) => r.user?.toLowerCase() === user && r.status === 'pending'),
                isCreator: c.creator?.walletAddress?.toLowerCase() === user
            }))
        });
    } catch (error) {
        console.error('Get user access list error:', error);
        return res.status(500).send({ status: false, message: 'Failed to get user access list' });
    }
};
