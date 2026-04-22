const SevaProject = require('../models/SevaProject.model');
const SevaDonation = require('../models/SevaDonation.model');
const { v4: uuidv4 } = require('uuid');

// ============== PROJECT MANAGEMENT ==============

// Submit new project
exports.submitProject = async (req, res) => {
  try {
    const projectData = req.body;
    
    const project = new SevaProject({
      projectId: `SEVA-${uuidv4().split('-')[0].toUpperCase()}`,
      ...projectData,
      status: 'pending_review',
      submittedAt: new Date()
    });
    
    await project.save();
    
    res.status(201).json({
      success: true,
      message: 'Project submitted successfully and pending review',
      project: {
        projectId: project.projectId,
        title: project.title,
        status: project.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects with filters
exports.getProjects = async (req, res) => {
  try {
    const { 
      status, 
      projectType, 
      category, 
      country, 
      region,
      verificationTier,
      featured,
      urgent,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (projectType) query.projectType = projectType;
    if (category) query.category = category;
    if (country) query.country = country;
    if (region) query.region = region;
    if (verificationTier) query.verificationTier = verificationTier;
    if (featured !== undefined) query.isFeatured = featured === 'true';
    if (urgent !== undefined) query.isUrgent = urgent === 'true';
    
    const projects = await SevaProject.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await SevaProject.countDocuments(query);
    
    res.json({
      success: true,
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured projects
exports.getFeaturedProjects = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const projects = await SevaProject.getFeatured(parseInt(limit));
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await SevaProject.findOne({ projectId });
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Get recent donations for this project
    const recentDonations = await SevaDonation.getProjectDonations(projectId, { limit: 10 });
    
    res.json({
      success: true,
      project,
      recentDonations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve project (Advisory Council)
exports.approveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { reviewerId, reviewNotes } = req.body;
    
    const project = await SevaProject.findOneAndUpdate(
      { projectId },
      {
        status: 'active',
        reviewedBy: reviewerId,
        reviewNotes,
        reviewDate: new Date()
      },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({
      success: true,
      message: 'Project approved and is now active',
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update project progress
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;
    
    const project = await SevaProject.findOneAndUpdate(
      { projectId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add project update
exports.addProjectUpdate = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;
    
    const project = await SevaProject.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    project.updates.push(updateData);
    await project.save();
    
    res.json({ success: true, message: 'Update added', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark project as complete
exports.completeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { thankYouMessage, thankYouVideoUrl, completionPhotos, completionReport } = req.body;
    
    const project = await SevaProject.findOneAndUpdate(
      { projectId },
      {
        status: 'completed',
        actualCompletionDate: new Date(),
        thankYouMessage,
        thankYouVideoUrl,
        completionPhotos,
        completionReport
      },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Notify all donors
    // TODO: Send notifications to donors
    
    res.json({
      success: true,
      message: 'Project marked as complete. Donors will be notified.',
      project
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============== DONATION MANAGEMENT ==============

// Create donation (checkout or direct)
exports.createDonation = async (req, res) => {
  try {
    const donationData = req.body;
    
    const donation = new SevaDonation({
      donationId: `DON-${uuidv4().split('-')[0].toUpperCase()}`,
      ...donationData,
      paymentStatus: 'pending'
    });
    
    await donation.save();
    
    res.status(201).json({
      success: true,
      message: 'Donation created. Proceed to payment.',
      donation: {
        donationId: donation.donationId,
        amount: donation.amount,
        paymentStatus: donation.paymentStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Process donation payment
exports.processDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { transactionHash, paymentId } = req.body;
    
    const donation = await SevaDonation.findOne({ donationId });
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    
    // Mark donation as paid
    await donation.markAsPaid(transactionHash);
    
    // Update project raised amount
    const project = await SevaProject.findOne({ projectId: donation.projectId });
    if (project) {
      await project.addDonation(donation.amount, donation.donorWalletAddress);
    }
    
    // Assign badges based on amount
    const badges = [];
    if (donation.amount >= 5 && donation.amount < 15) {
      badges.push({ badgeType: 'supporter', badgeName: 'Community Supporter' });
    } else if (donation.amount >= 15 && donation.amount < 25) {
      badges.push({ badgeType: 'builder', badgeName: 'Community Builder' });
    } else if (donation.amount >= 25 && donation.amount < 50) {
      badges.push({ badgeType: 'guardian', badgeName: 'Community Guardian' });
    } else if (donation.amount >= 50) {
      badges.push({ badgeType: 'elder', badgeName: 'Community Elder' });
    }
    
    for (const badge of badges) {
      await donation.addBadge(badge.badgeType, badge.badgeName);
    }
    
    res.json({
      success: true,
      message: 'Donation processed successfully',
      donation,
      badgesEarned: badges
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get donation by ID
exports.getDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const donation = await SevaDonation.findOne({ donationId });
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    
    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============== CHECKOUT INTEGRATION ==============

// Get checkout prompt for Seva donation
exports.getCheckoutPrompt = async (req, res) => {
  try {
    const { nftId, artistWallet, purchaseAmount } = req.query;
    
    // Find related project (by artist's community or region)
    // For now, return featured projects
    const projects = await SevaProject.getFeatured(3);
    
    // Giving tiers
    const givingTiers = [
      { 
        id: 'supporter', 
        amount: 5, 
        label: 'Supporter',
        impact: 'Provides books for 5 children for one month'
      },
      { 
        id: 'builder', 
        amount: 15, 
        label: 'Builder',
        impact: 'Helps buy a desk for a new classroom'
      },
      { 
        id: 'guardian', 
        amount: 25, 
        label: 'Guardian',
        impact: 'Helps fund a water filtration system'
      },
      { 
        id: 'elder', 
        amount: 50, 
        label: 'Elder',
        impact: 'Supports an elder teaching language classes'
      }
    ];
    
    res.json({
      success: true,
      prompt: {
        headline: "You are about to make an artist happy. Would you like to make a community happy too?",
        body: "Your purchase supports one artist. Your gift can support an entire village.",
        givingTiers,
        featuredProjects: projects,
        customAmount: {
          enabled: true,
          min: 1,
          placeholder: "Every dollar builds something real"
        },
        optIn: {
          text: "Notify me when this project is complete. Send photos and a video from the community.",
          default: true
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============== USER DASHBOARD ==============

// Get user impact dashboard
exports.getUserImpact = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Get donor stats
    const stats = await SevaDonation.getDonorStats(walletAddress);
    
    // Get all donations
    const donations = await SevaDonation.find({ 
      donorWalletAddress: walletAddress,
      paymentStatus: 'completed'
    })
    .sort({ createdAt: -1 })
    .populate('projectId');
    
    // Get unique projects supported
    const projectIds = [...new Set(donations.map(d => d.projectId))];
    const projects = await SevaProject.find({ projectId: { $in: projectIds } });
    
    // Collect all badges
    const allBadges = donations.flatMap(d => d.badgesEarned);
    const uniqueBadges = [...new Map(allBadges.map(b => [b.badgeType, b])).values()];
    
    // Get completed projects with thank you content
    const completedProjects = projects.filter(p => p.status === 'completed');
    const impactGallery = completedProjects.map(p => ({
      projectId: p.projectId,
      title: p.title,
      communityName: p.communityName,
      completionPhotos: p.completionPhotos,
      thankYouVideoUrl: p.thankYouVideoUrl,
      thankYouMessage: p.thankYouMessage
    }));
    
    res.json({
      success: true,
      impact: {
        lifetimeGiving: stats.totalDonated,
        totalDonations: stats.totalDonations,
        projectsSupported: stats.projectsSupported,
        firstDonation: stats.firstDonation,
        lastDonation: stats.lastDonation,
        badges: uniqueBadges,
        donations: donations.map(d => ({
          donationId: d.donationId,
          amount: d.amount,
          projectId: d.projectId,
          projectName: d.projectName,
          createdAt: d.createdAt,
          badgesEarned: d.badgesEarned
        })),
        impactGallery,
        projects: projects.map(p => ({
          projectId: p.projectId,
          title: p.title,
          status: p.status,
          progressPercentage: p.progressPercentage,
          coverImage: p.coverImage
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============== STATS & ANALYTICS ==============

// Get platform-wide Seva stats
exports.getSevaStats = async (req, res) => {
  try {
    const projectStats = await SevaProject.getImpactStats();
    
    const donationStats = await SevaDonation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: null,
          totalDonated: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          uniqueDonors: { $addToSet: '$donorWalletAddress' }
        }
      }
    ]);
    
    const activeProjects = await SevaProject.countDocuments({ 
      status: { $in: ['active', 'funded', 'in_progress'] }
    });
    
    const completedProjects = await SevaProject.countDocuments({ status: 'completed' });
    
    res.json({
      success: true,
      stats: {
        totalRaised: donationStats[0]?.totalDonated || 0,
        totalDonations: donationStats[0]?.totalDonations || 0,
        uniqueDonors: donationStats[0]?.uniqueDonors?.length || 0,
        activeProjects,
        completedProjects,
        totalProjects: activeProjects + completedProjects,
        ...projectStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await SevaDonation.getLeaderboard(parseInt(limit));
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get monthly stats
exports.getMonthlyStats = async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const stats = await SevaDonation.getMonthlyStats(parseInt(months));
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============== CORPORATE MATCHING ==============

// Submit corporate match
exports.submitCorporateMatch = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { companyName, companyId } = req.body;
    
    const donation = await SevaDonation.findOneAndUpdate(
      { donationId },
      {
        'corporateMatch.companyName': companyName,
        'corporateMatch.companyId': companyId,
        'corporateMatch.matchStatus': 'pending'
      },
      { new: true }
    );
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    
    res.json({
      success: true,
      message: 'Corporate match submitted for approval',
      donation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve corporate match
exports.approveCorporateMatch = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { matchAmount } = req.body;
    
    const donation = await SevaDonation.findOneAndUpdate(
      { donationId },
      {
        'corporateMatch.matchAmount': matchAmount,
        'corporateMatch.matchStatus': 'matched',
        'corporateMatch.matchedAt': new Date()
      },
      { new: true }
    );
    
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    
    // Add match amount to project
    const project = await SevaProject.findOne({ projectId: donation.projectId });
    if (project) {
      await project.addDonation(matchAmount, null);
    }
    
    res.json({
      success: true,
      message: 'Corporate match approved and funds added to project',
      donation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
