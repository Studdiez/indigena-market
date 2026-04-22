/**
 * 10 Pillars Controller
 * Unified controller for all marketplace pillars
 */

const digitalArts = require('../services/pillars/digitalArts.service.js');
const physicalItems = require('../services/pillars/physicalItems.service.js');
const courses = require('../services/pillars/courses.service.js');
const freelancing = require('../services/pillars/freelancing.service.js');
const seva = require('../services/pillars/seva.service.js');
const culturalTourism = require('../services/pillars/culturalTourism.service.js');
const languageHeritage = require('../services/pillars/languageHeritage.service.js');
const landFood = require('../services/pillars/landFood.service.js');
const advocacyLegal = require('../services/pillars/advocacyLegal.service.js');
const materialsTools = require('../services/pillars/materialsTools.service.js');

// ==================== PILLAR 1: DIGITAL ARTS ====================

exports.createDigitalArtListing = async (req, res) => {
  try {
    const { artist, ...data } = req.body;
    const result = await digitalArts.createListing(artist, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.mintDigitalArtNFT = async (req, res) => {
  try {
    const { listingId } = req.params;
    const result = await digitalArts.mintNFT(listingId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDigitalArtListings = async (req, res) => {
  try {
    const result = await digitalArts.getListings(req.query);
    res.status(200).json({ success: true, listings: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 2: PHYSICAL ITEMS ====================

exports.createPhysicalProduct = async (req, res) => {
  try {
    const { seller, ...data } = req.body;
    const result = await physicalItems.createProduct(seller, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPhysicalOrder = async (req, res) => {
  try {
    const { buyer, ...data } = req.body;
    const result = await physicalItems.createOrder(buyer, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPhysicalProducts = async (req, res) => {
  try {
    const result = await physicalItems.getProducts(req.query);
    res.status(200).json({ success: true, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 3: COURSES ====================

exports.createCourse = async (req, res) => {
  try {
    const { instructor, ...data } = req.body;
    const result = await courses.createCourse(instructor, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { student, ...data } = req.body;
    const result = await courses.enrollStudent(courseId, student, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeLesson = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lessonId } = req.body;
    const result = await courses.completeLesson(enrollmentId, lessonId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const result = await courses.getCourses(req.query);
    res.status(200).json({ success: true, courses: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 4: FREELANCING ====================

exports.createFreelancerProfile = async (req, res) => {
  try {
    const { user, ...data } = req.body;
    const result = await freelancing.createProfile(user, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGig = async (req, res) => {
  try {
    const { freelancer, ...data } = req.body;
    const result = await freelancing.createGig(freelancer, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createContract = async (req, res) => {
  try {
    const { client, ...data } = req.body;
    const result = await freelancing.createContract(client, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.fundEscrow = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { client, ...data } = req.body;
    const result = await freelancing.fundEscrow(contractId, client, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { freelancer } = req.body;
    const result = await freelancing.completeContract(contractId, freelancer);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { reviewer, ...data } = req.body;
    const result = await freelancing.submitReview(contractId, reviewer, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const result = await freelancing.getGigs(req.query);
    res.status(200).json({ success: true, gigs: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFreelancers = async (req, res) => {
  try {
    const result = await freelancing.getFreelancers(req.query);
    res.status(200).json({ success: true, freelancers: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 5: SEVA ====================

exports.createCampaign = async (req, res) => {
  try {
    const { creator, ...data } = req.body;
    const result = await seva.createCampaign(creator, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.donate = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { donor, ...data } = req.body;
    const result = await seva.donate(donor, campaignId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSponsorship = async (req, res) => {
  try {
    const { sponsor, ...data } = req.body;
    const result = await seva.createSponsorship(sponsor, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHonorarium = async (req, res) => {
  try {
    const { donor, ...data } = req.body;
    const result = await seva.createHonorarium(donor, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const result = await seva.getCampaigns(req.query);
    res.status(200).json({ success: true, campaigns: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDonationHistory = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await seva.getDonationHistory(address);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 6: CULTURAL TOURISM ====================

exports.createExperience = async (req, res) => {
  try {
    const { host, ...data } = req.body;
    const result = await culturalTourism.createExperience(host, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAccommodation = async (req, res) => {
  try {
    const { host, ...data } = req.body;
    const result = await culturalTourism.createAccommodation(host, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFestival = async (req, res) => {
  try {
    const { organizer, ...data } = req.body;
    const result = await culturalTourism.createFestival(organizer, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bookExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { user, ...data } = req.body;
    const result = await culturalTourism.bookExperience(user, experienceId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bookAccommodation = async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const { user, ...data } = req.body;
    const result = await culturalTourism.bookAccommodation(user, accommodationId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.buyFestivalTicket = async (req, res) => {
  try {
    const { festivalId } = req.params;
    const { user, ...data } = req.body;
    const result = await culturalTourism.buyFestivalTicket(user, festivalId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExperiences = async (req, res) => {
  try {
    const result = await culturalTourism.getExperiences(req.query);
    res.status(200).json({ success: true, experiences: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 7: LANGUAGE & HERITAGE ====================

exports.createArchive = async (req, res) => {
  try {
    const { creator, ...data } = req.body;
    const result = await languageHeritage.createArchive(creator, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.subscribeToArchive = async (req, res) => {
  try {
    const { archiveId } = req.params;
    const { user, ...data } = req.body;
    const result = await languageHeritage.subscribeToArchive(user, archiveId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLanguageTool = async (req, res) => {
  try {
    const { creator, ...data } = req.body;
    const result = await languageHeritage.createLanguageTool(creator, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestTranslation = async (req, res) => {
  try {
    const { requester, ...data } = req.body;
    const result = await languageHeritage.requestTranslation(requester, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArchives = async (req, res) => {
  try {
    const result = await languageHeritage.getArchives(req.query);
    res.status(200).json({ success: true, archives: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLanguageTools = async (req, res) => {
  try {
    const result = await languageHeritage.getTools(req.query);
    res.status(200).json({ success: true, tools: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 8: LAND & FOOD ====================

exports.createLandFoodProduct = async (req, res) => {
  try {
    const { seller, ...data } = req.body;
    const result = await landFood.createProduct(seller, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSeedListing = async (req, res) => {
  try {
    const { grower, ...data } = req.body;
    const result = await landFood.createSeedListing(grower, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStewardshipProject = async (req, res) => {
  try {
    const { creator, ...data } = req.body;
    const result = await landFood.createStewardshipProject(creator, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.contributeToStewardship = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { contributor, ...data } = req.body;
    const result = await landFood.contributeToStewardship(contributor, projectId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLandFoodOrder = async (req, res) => {
  try {
    const { buyer, ...data } = req.body;
    const result = await landFood.createOrder(buyer, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLandFoodProducts = async (req, res) => {
  try {
    const result = await landFood.getProducts(req.query);
    res.status(200).json({ success: true, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeeds = async (req, res) => {
  try {
    const result = await landFood.getSeeds(req.query);
    res.status(200).json({ success: true, seeds: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStewardshipProjects = async (req, res) => {
  try {
    const result = await landFood.getStewardshipProjects(req.query);
    res.status(200).json({ success: true, projects: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 9: ADVOCACY & LEGAL ====================

exports.createDefenseCase = async (req, res) => {
  try {
    const { creator, ...data } = req.body;
    const result = await advocacyLegal.createDefenseCase(creator, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.contributeToDefense = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { contributor, ...data } = req.body;
    const result = await advocacyLegal.contributeToDefense(contributor, caseId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerLegalProfessional = async (req, res) => {
  try {
    const { professional, ...data } = req.body;
    const result = await advocacyLegal.registerProfessional(professional, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPolicyAlert = async (req, res) => {
  try {
    const { creator, ...data } = req.body;
    const result = await advocacyLegal.createPolicyAlert(creator, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestLegalAssistance = async (req, res) => {
  try {
    const { requester, ...data } = req.body;
    const result = await advocacyLegal.requestAssistance(requester, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDefenseCases = async (req, res) => {
  try {
    const result = await advocacyLegal.getDefenseCases(req.query);
    res.status(200).json({ success: true, cases: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLegalProfessionals = async (req, res) => {
  try {
    const result = await advocacyLegal.getProfessionals(req.query);
    res.status(200).json({ success: true, professionals: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPolicyAlerts = async (req, res) => {
  try {
    const result = await advocacyLegal.getPolicyAlerts(req.query);
    res.status(200).json({ success: true, alerts: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PILLAR 10: MATERIALS & TOOLS ====================

exports.createMaterialsProduct = async (req, res) => {
  try {
    const { seller, ...data } = req.body;
    const result = await materialsTools.createProduct(seller, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToolToLibrary = async (req, res) => {
  try {
    const { owner, ...data } = req.body;
    const result = await materialsTools.addToToolLibrary(owner, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rentTool = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { renter, ...data } = req.body;
    const result = await materialsTools.rentTool(renter, toolId, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBulkOrder = async (req, res) => {
  try {
    const { buyer, ...data } = req.body;
    const result = await materialsTools.createBulkOrder(buyer, data);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMaterialsProducts = async (req, res) => {
  try {
    const result = await materialsTools.getProducts(req.query);
    res.status(200).json({ success: true, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getToolLibrary = async (req, res) => {
  try {
    const result = await materialsTools.getToolLibrary(req.query);
    res.status(200).json({ success: true, tools: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
