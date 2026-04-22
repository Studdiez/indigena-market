const Freelancer = require('../models/Freelancer.model.js');
const FreelancingMarketplaceEvent = require('../models/FreelancingMarketplaceEvent.model.js');
const FreelanceBooking = require('../models/FreelanceBooking.model.js');
const FreelanceShortlist = require('../models/FreelanceShortlist.model.js');
const FreelanceReport = require('../models/FreelanceReport.model.js');

async function pushFreelanceEvent(event) {
    await FreelancingMarketplaceEvent.create({
        event: event.event,
        serviceId: event.serviceId || undefined,
        category: event.category || undefined,
        metadata: event.metadata || {}
    });
}

function toMarketplaceServiceRow(freelancer, service) {
    const min = service?.priceRange?.min ?? service?.fixedPrice?.amount ?? 0;
    const max = service?.priceRange?.max ?? service?.fixedPrice?.amount ?? min;

    return {
        serviceId: service.serviceId,
        title: service.title,
        description: service.description || '',
        category: service.category || 'other',
        freelancerAddress: freelancer.walletAddress,
        freelancerName: freelancer.profile?.displayName || freelancer.profile?.name || 'Indigenous Professional',
        freelancerAvatar: freelancer.profile?.avatar || '',
        freelancerNation: freelancer.profile?.nation || freelancer.profile?.tribalAffiliation || '',
        location: freelancer.profile?.location || '',
        verificationStatus: freelancer.verificationStatus,
        averageRating: Number(freelancer.stats?.averageRating || 0),
        reviewCount: Number(freelancer.stats?.totalReviews || 0),
        completedProjects: Number(freelancer.stats?.completedProjects || 0),
        responseTime: freelancer.stats?.responseTime || 'within 24 hours',
        languages: freelancer.profile?.languages || [],
        skills: (freelancer.skills || []).map((s) => s.subcategory || s.category).filter(Boolean),
        pricing: {
            min,
            max,
            currency: service?.priceRange?.currency || service?.fixedPrice?.currency || 'INDI',
            fixedAmount: service?.fixedPrice?.amount
        },
        deliveryTime: service.deliveryTime || '',
        featured: Boolean(freelancer.featuredUntil && new Date(freelancer.featuredUntil).getTime() > Date.now()),
        available: freelancer.availability?.status !== 'unavailable' && service.isActive !== false
    };
}

async function findFreelancerByServiceId(serviceId) {
    return Freelancer.findOne({ 'services.serviceId': serviceId });
}

// Create freelancer profile
exports.createProfile = async (req, res) => {
    try {
        const { walletAddress, profile, skills, services } = req.body;

        if (!walletAddress) {
            return res.status(400).send({
                status: false,
                message: 'Wallet address is required'
            });
        }

        const existing = await Freelancer.findOne({ 
            walletAddress: walletAddress.toLowerCase() 
        });

        if (existing) {
            return res.status(400).send({
                status: false,
                message: 'Profile already exists'
            });
        }

        const freelancer = await Freelancer.create({
            walletAddress: walletAddress.toLowerCase(),
            profile,
            skills: skills || [],
            services: services || []
        });

        return res.status(201).send({
            status: true,
            message: 'Profile created successfully',
            profile: {
                walletAddress: freelancer.walletAddress,
                name: freelancer.profile?.name,
                verificationStatus: freelancer.verificationStatus
            }
        });
    } catch (error) {
        console.error('Create freelancer profile error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to create profile'
        });
    }
};

// Get freelancer profile
exports.getProfile = async (req, res) => {
    try {
        const { address } = req.params;

        const freelancer = await Freelancer.findOne({ 
            walletAddress: address.toLowerCase() 
        });

        if (!freelancer) {
            return res.status(404).send({
                status: false,
                message: 'Profile not found'
            });
        }

        return res.status(200).send({
            status: true,
            profile: freelancer
        });
    } catch (error) {
        console.error('Get freelancer profile error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get profile'
        });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { walletAddress, profile, skills, services, availability, preferences } = req.body;
        const targetAddress = (req.params?.address || walletAddress || '').toLowerCase();

        const updateData = {};
        if (profile) updateData.profile = profile;
        if (skills) updateData.skills = skills;
        if (services) updateData.services = services;
        if (availability) updateData.availability = availability;
        if (preferences) updateData.preferences = preferences;

        const freelancer = await Freelancer.findOneAndUpdate(
            { walletAddress: targetAddress },
            { $set: updateData },
            { new: true }
        );

        if (!freelancer) {
            return res.status(404).send({
                status: false,
                message: 'Profile not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'Profile updated successfully',
            profile: freelancer
        });
    } catch (error) {
        console.error('Update freelancer profile error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to update profile'
        });
    }
};

// Search freelancers by skill
exports.searchBySkill = async (req, res) => {
    try {
        const { category, subcategory, level } = req.query;

        let query = { isActive: true };

        if (category) {
            query['skills.category'] = category;
        }
        if (subcategory) {
            query['skills.subcategory'] = subcategory;
        }
        if (level) {
            query['skills.expertiseLevel'] = level;
        }

        const freelancers = await Freelancer.find(query)
            .select('-projects')
            .sort({ 'stats.averageRating': -1 });

        return res.status(200).send({
            status: true,
            count: freelancers.length,
            freelancers
        });
    } catch (error) {
        console.error('Search freelancers error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to search freelancers'
        });
    }
};

// Submit review
exports.submitReview = async (req, res) => {
    try {
        const { freelancerAddress, reviewer, reviewerName, rating, comment, projectType } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).send({
                status: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const freelancer = await Freelancer.findOne({ 
            walletAddress: freelancerAddress.toLowerCase() 
        });

        if (!freelancer) {
            return res.status(404).send({
                status: false,
                message: 'Freelancer not found'
            });
        }

        freelancer.reviews.push({
            reviewer: reviewer.toLowerCase(),
            reviewerName,
            rating,
            comment,
            projectType,
            timestamp: new Date()
        });

        // Recalculate stats
        const total = freelancer.reviews.reduce((sum, r) => sum + r.rating, 0);
        freelancer.stats.averageRating = total / freelancer.reviews.length;
        freelancer.stats.totalReviews = freelancer.reviews.length;

        await freelancer.save();

        return res.status(200).send({
            status: true,
            message: 'Review submitted successfully',
            averageRating: freelancer.stats.averageRating
        });
    } catch (error) {
        console.error('Submit review error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to submit review'
        });
    }
};

// Request verification
exports.requestVerification = async (req, res) => {
    try {
        const { walletAddress, documents, endorsement } = req.body;

        const freelancer = await Freelancer.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            {
                $set: {
                    verificationStatus: 'pending',
                    'verificationDetails.submittedAt': new Date(),
                    'verificationDetails.documents': documents,
                    'verificationDetails.endorsement': endorsement
                }
            },
            { new: true }
        );

        if (!freelancer) {
            return res.status(404).send({
                status: false,
                message: 'Profile not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'Verification request submitted',
            status: freelancer.verificationStatus
        });
    } catch (error) {
        console.error('Request verification error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to submit verification request'
        });
    }
};

// Verify freelancer (admin/elder)
exports.verifyFreelancer = async (req, res) => {
    try {
        const { walletAddress, verifierAddress, approved, badge } = req.body;

        const updateData = {
            verificationStatus: approved ? 'verified' : 'unverified',
            'verificationDetails.verifiedAt': new Date(),
            'verificationDetails.verifiedBy': verifierAddress
        };

        if (badge) {
            updateData.$addToSet = { badges: badge };
        }

        const freelancer = await Freelancer.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            { $set: updateData },
            { new: true }
        );

        if (!freelancer) {
            return res.status(404).send({
                status: false,
                message: 'Profile not found'
            });
        }

        return res.status(200).send({
            status: true,
            message: approved ? 'Freelancer verified' : 'Verification rejected',
            verificationStatus: freelancer.verificationStatus
        });
    } catch (error) {
        console.error('Verify freelancer error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to verify freelancer'
        });
    }
};

// Get featured freelancers
exports.getFeatured = async (req, res) => {
    try {
        const freelancers = await Freelancer.find({
            isActive: true,
            verificationStatus: { $in: ['verified', 'elder_endorsed', 'premium'] },
            'stats.averageRating': { $gte: 4.5 }
        })
        .select('-projects')
        .sort({ 'stats.completedProjects': -1 })
        .limit(10);

        return res.status(200).send({
            status: true,
            count: freelancers.length,
            freelancers
        });
    } catch (error) {
        console.error('Get featured freelancers error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get featured freelancers'
        });
    }
};


// Compatibility handlers for legacy route names in ui.route.js
exports.getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await Freelancer.find({ isActive: true }).sort({ 'stats.averageRating': -1 });
        return res.status(200).send({ status: true, count: freelancers.length, freelancers });
    } catch (error) {
        console.error('Get all freelancers error:', error);
        return res.status(500).send({ status: false, message: 'Failed to get freelancers' });
    }
};

exports.getFreelancersBySkill = async (req, res) => {
    try {
        const { category } = req.params;
        req.query = { ...req.query, category };
        return exports.searchBySkill(req, res);
    } catch (error) {
        console.error('Get freelancers by skill error:', error);
        return res.status(500).send({ status: false, message: 'Failed to get freelancers by skill' });
    }
};

exports.addSkill = async (req, res) => {
    try {
        const { walletAddress, skill } = req.body;
        if (!walletAddress || !skill) {
            return res.status(400).send({ status: false, message: 'walletAddress and skill are required' });
        }
        const freelancer = await Freelancer.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            { $push: { skills: skill } },
            { new: true }
        );
        if (!freelancer) {
            return res.status(404).send({ status: false, message: 'Profile not found' });
        }
        return res.status(200).send({ status: true, message: 'Skill added successfully', profile: freelancer });
    } catch (error) {
        console.error('Add skill error:', error);
        return res.status(500).send({ status: false, message: 'Failed to add skill' });
    }
};

exports.addService = async (req, res) => {
    try {
        const { walletAddress, service } = req.body;
        if (!walletAddress || !service) {
            return res.status(400).send({ status: false, message: 'walletAddress and service are required' });
        }
        const freelancer = await Freelancer.findOneAndUpdate(
            { walletAddress: walletAddress.toLowerCase() },
            { $push: { services: service } },
            { new: true }
        );
        if (!freelancer) {
            return res.status(404).send({ status: false, message: 'Profile not found' });
        }
        return res.status(200).send({ status: true, message: 'Service added successfully', profile: freelancer });
    } catch (error) {
        console.error('Add service error:', error);
        return res.status(500).send({ status: false, message: 'Failed to add service' });
    }
};

exports.addReview = exports.submitReview;


exports.getMarketplaceServices = async (req, res) => {
    try {
        const {
            q,
            category,
            minPrice,
            maxPrice,
            verifiedOnly,
            availableOnly,
            sort = 'popular',
            page = 1,
            limit = 24
        } = req.query;

        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 24));

        const freelancers = await Freelancer.find({ isActive: true }).select('-projects');
        let services = freelancers.flatMap((freelancer) =>
            (freelancer.services || []).map((service) => toMarketplaceServiceRow(freelancer, service))
        );

        if (category && category !== 'all') {
            services = services.filter((s) => s.category === category);
        }

        if (q && String(q).trim()) {
            const regex = new RegExp(String(q).trim(), 'i');
            services = services.filter((s) =>
                regex.test(s.title || '') ||
                regex.test(s.description || '') ||
                regex.test(s.freelancerName || '') ||
                (s.skills || []).some((skill) => regex.test(skill))
            );
        }

        if (verifiedOnly) {
            services = services.filter((s) => ['verified', 'elder_endorsed', 'premium'].includes(s.verificationStatus));
        }

        if (availableOnly) {
            services = services.filter((s) => s.available);
        }

        if (minPrice || maxPrice) {
            services = services.filter((s) => {
                const value = Number(s.pricing?.fixedAmount ?? s.pricing?.min ?? 0);
                if (minPrice && value < Number(minPrice)) return false;
                if (maxPrice && value > Number(maxPrice)) return false;
                return true;
            });
        }

        if (sort === 'rating') services.sort((a, b) => b.averageRating - a.averageRating);
        if (sort === 'price-low') services.sort((a, b) => (a.pricing?.min || 0) - (b.pricing?.min || 0));
        if (sort === 'price-high') services.sort((a, b) => (b.pricing?.min || 0) - (a.pricing?.min || 0));
        if (sort === 'popular') services.sort((a, b) => b.completedProjects - a.completedProjects);

        const total = services.length;
        const pages = Math.max(1, Math.ceil(total / limitNum));
        const start = (pageNum - 1) * limitNum;
        const paged = services.slice(start, start + limitNum);

        return res.status(200).send({
            status: true,
            data: {
                services: paged,
                page: pageNum,
                pages,
                total
            }
        });
    } catch (error) {
        console.error('Get marketplace services error:', error);
        return res.status(500).send({ status: false, message: 'Failed to get marketplace services' });
    }
};

exports.bookService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { clientAddress } = req.body;

        const freelancer = await findFreelancerByServiceId(serviceId);
        if (!freelancer) return res.status(404).send({ status: false, message: 'Service not found' });

        const service = freelancer.services.find((s) => s.serviceId === serviceId);
        if (!service) return res.status(404).send({ status: false, message: 'Service not found' });

        const client = String(clientAddress || '').toLowerCase();
        if (!client || client === 'demo-wallet') {
            return res.status(400).send({ status: false, message: 'clientAddress is required' });
        }

        service.currentBookings = Number(service.currentBookings || 0) + 1;
        freelancer.stats.activeProjects = Number(freelancer.stats.activeProjects || 0) + 1;
        await freelancer.save();

        await FreelanceBooking.create({
            serviceId,
            freelancerAddress: freelancer.walletAddress,
            clientAddress: client,
            amount: Number(service.fixedPrice?.amount ?? service.priceRange?.min ?? 0),
            currency: service.fixedPrice?.currency || service.priceRange?.currency || 'INDI',
            status: 'pending',
            notes: ''
        });

        await pushFreelanceEvent({
            event: 'book',
            serviceId,
            category: service.category,
            metadata: { clientAddress: client }
        });

        return res.status(200).send({
            status: true,
            message: 'Service booking started',
            data: {
                serviceId,
                clientAddress: client,
                currentBookings: service.currentBookings
            }
        });
    } catch (error) {
        console.error('Book service error:', error);
        return res.status(500).send({ status: false, message: 'Failed to book service' });
    }
};

exports.shortlistService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { userAddress } = req.body;

        const freelancer = await findFreelancerByServiceId(serviceId);
        if (!freelancer) return res.status(404).send({ status: false, message: 'Service not found' });
        const service = freelancer.services.find((s) => s.serviceId === serviceId);
        if (!service) return res.status(404).send({ status: false, message: 'Service not found' });

        const user = String(userAddress || '').toLowerCase();
        if (!user || user === 'demo-wallet') {
            return res.status(400).send({ status: false, message: 'userAddress is required' });
        }
        const key = { serviceId, userAddress: user };
        const existing = await FreelanceShortlist.findOne(key);
        const willBeActive = !(existing && existing.active);

        await FreelanceShortlist.findOneAndUpdate(
            key,
            { $set: { active: willBeActive } },
            { upsert: true, new: true }
        );

        await pushFreelanceEvent({
            event: 'shortlist',
            serviceId,
            category: service.category,
            metadata: { userAddress: user, active: willBeActive }
        });

        return res.status(200).send({ status: true, message: 'Shortlist updated', data: { serviceId, userAddress: user, active: willBeActive } });
    } catch (error) {
        console.error('Shortlist service error:', error);
        return res.status(500).send({ status: false, message: 'Failed to update shortlist' });
    }
};

exports.shareService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { platform = 'native' } = req.body;

        const freelancer = await findFreelancerByServiceId(serviceId);
        if (!freelancer) return res.status(404).send({ status: false, message: 'Service not found' });
        const service = freelancer.services.find((s) => s.serviceId === serviceId);
        if (!service) return res.status(404).send({ status: false, message: 'Service not found' });

        await pushFreelanceEvent({
            event: 'share',
            serviceId,
            category: service.category,
            metadata: { platform }
        });

        return res.status(200).send({ status: true, message: 'Share tracked', data: { serviceId, platform } });
    } catch (error) {
        console.error('Share service error:', error);
        return res.status(500).send({ status: false, message: 'Failed to share service' });
    }
};

exports.reportService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { reason = 'unspecified', details = '', reporterAddress } = req.body;

        const freelancer = await findFreelancerByServiceId(serviceId);
        if (!freelancer) return res.status(404).send({ status: false, message: 'Service not found' });
        const service = freelancer.services.find((s) => s.serviceId === serviceId);
        if (!service) return res.status(404).send({ status: false, message: 'Service not found' });

        const reporter = reporterAddress ? String(reporterAddress).toLowerCase() : '';
        if (!reporter || reporter === 'demo-wallet') {
            return res.status(400).send({ status: false, message: 'reporterAddress is required' });
        }

        await FreelanceReport.create({
            serviceId,
            reporterAddress: reporter,
            reason,
            details,
            status: 'open'
        });

        await pushFreelanceEvent({
            event: 'report',
            serviceId,
            category: service.category,
            metadata: { reason, details, reporterAddress: reporter }
        });

        return res.status(200).send({ status: true, message: 'Report submitted', data: { serviceId, reason } });
    } catch (error) {
        console.error('Report service error:', error);
        return res.status(500).send({ status: false, message: 'Failed to report service' });
    }
};

exports.trackEvent = async (req, res) => {
    try {
        const { event, serviceId, category, metadata } = req.body;
        if (!event) return res.status(400).send({ status: false, message: 'event is required' });

        await pushFreelanceEvent({ event, serviceId, category, metadata: metadata || {} });
        return res.status(200).send({ status: true, message: 'Event tracked' });
    } catch (error) {
        console.error('Track freelance event error:', error);
        return res.status(500).send({ status: false, message: 'Failed to track event' });
    }
};

exports.getDemandHeatmap = async (req, res) => {
    try {
        const grouped = await FreelancingMarketplaceEvent.aggregate([
            {
                $group: {
                    _id: '$category',
                    events: { $push: '$event' }
                }
            }
        ]);

        const heatmap = grouped.map((row) => {
            const bucket = {
                category: row._id || 'uncategorized',
                search: 0,
                view: 0,
                shortlist: 0,
                book: 0,
                share: 0,
                report: 0
            };
            for (const evt of row.events) {
                if (evt === 'search') bucket.search += 1;
                else if (evt === 'view') bucket.view += 1;
                else if (evt === 'shortlist') bucket.shortlist += 1;
                else if (evt === 'book') bucket.book += 1;
                else if (evt === 'share') bucket.share += 1;
                else if (evt === 'report') bucket.report += 1;
            }
            return bucket;
        }).sort((a, b) => (b.search + b.view + b.shortlist + b.book) - (a.search + a.view + a.shortlist + a.book));

        return res.status(200).send({
            status: true,
            data: heatmap,
            totalEvents: heatmap.reduce((sum, row) => sum + row.search + row.view + row.shortlist + row.book + row.share + row.report, 0)
        });
    } catch (error) {
        console.error('Freelance heatmap error:', error);
        return res.status(500).send({ status: false, message: 'Failed to build heatmap' });
    }
};





exports.getModerationQueue = async (req, res) => {
    try {
        const { status = 'open', page = 1, limit = 50 } = req.query;
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));

        const filter = {};
        if (status && status !== 'all') filter.status = status;

        const reports = await FreelanceReport.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        const total = await FreelanceReport.countDocuments(filter);

        return res.status(200).send({
            status: true,
            data: {
                reports,
                page: pageNum,
                pages: Math.max(1, Math.ceil(total / limitNum)),
                total
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load freelancing moderation queue' });
    }
};

exports.decideModeration = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { decision, moderator = 'admin', notes = '' } = req.body;
        const actingModerator = req.adminWallet || moderator;

        if (!['resolve', 'dismiss', 'review'].includes(decision)) {
            return res.status(400).send({ status: false, message: 'decision must be resolve, dismiss, or review' });
        }

        const nextStatus = decision === 'resolve' ? 'resolved' : decision === 'dismiss' ? 'dismissed' : 'under_review';

        const report = await FreelanceReport.findByIdAndUpdate(
            reportId,
            {
                $set: {
                    status: nextStatus,
                    moderation: {
                        moderator: actingModerator,
                        decision,
                        notes,
                        decidedAt: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!report) return res.status(404).send({ status: false, message: 'Report not found' });

        await pushFreelanceEvent({
            event: 'moderation_decision',
            serviceId: report.serviceId,
            category: undefined,
            metadata: { reportId: report._id.toString(), decision, moderator: actingModerator }
        });

        return res.status(200).send({ status: true, message: 'Moderation decision recorded', data: report });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to apply moderation decision' });
    }
};



