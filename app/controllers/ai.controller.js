/**
 * AI Controller
 * Provides endpoints for AI-powered features:
 * - Art Authentication
 * - Smart Pricing
 * - Voice Transcription
 * - Content Moderation
 */

const artAuthService = require('../services/ai/artAuthentication.service.js');
const pricingEngine = require('../services/ai/pricingEngine.service.js');
const voiceTranscription = require('../services/ai/voiceTranscription.service.js');
const contentModeration = require('../services/ai/contentModeration.service.js');

// ==================== ART AUTHENTICATION ====================

exports.authenticateArtwork = async (req, res) => {
  try {
    const { nftId } = req.params;
    const { imageData, metadata } = req.body;

    // In production, fetch NFT data from database
    const nftData = metadata || {
      NftId: nftId,
      ItemName: 'Sample Artwork',
      nation: 'Navajo',
      Type: 'weaving'
    };

    // Convert base64 image to buffer if provided
    let imageBuffer = null;
    if (imageData) {
      imageBuffer = Buffer.from(imageData, 'base64');
    }

    const result = await artAuthService.authenticateArtwork(imageBuffer, nftData);

    res.status(200).json({
      success: true,
      nftId,
      authentication: result
    });
  } catch (error) {
    console.error('Authenticate artwork error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuthenticPatterns = async (req, res) => {
  try {
    const { nation } = req.query;
    
    // Return patterns for specific nation or all
    const patterns = nation 
      ? artAuthService.authenticPatterns.get(nation.toLowerCase())
      : Object.fromEntries(artAuthService.authenticPatterns);

    res.status(200).json({
      success: true,
      nation: nation || 'all',
      patterns
    });
  } catch (error) {
    console.error('Get patterns error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerAuthenticPattern = async (req, res) => {
  try {
    const { nation, patternData } = req.body;
    
    artAuthService.addAuthenticPattern(nation, patternData);

    res.status(200).json({
      success: true,
      message: `Pattern added for ${nation}`,
      pattern: patternData
    });
  } catch (error) {
    console.error('Register pattern error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SMART PRICING ====================

exports.getPricingRecommendation = async (req, res) => {
  try {
    const { nftId } = req.params;
    const artworkData = req.body;

    const recommendation = await pricingEngine.getPricingRecommendation(artworkData);

    res.status(200).json({
      success: true,
      nftId,
      recommendation
    });
  } catch (error) {
    console.error('Pricing recommendation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBatchPricing = async (req, res) => {
  try {
    const { artworks } = req.body;

    if (!Array.isArray(artworks) || artworks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of artwork data'
      });
    }

    const batchRecommendation = await pricingEngine.getBatchPricing(artworks);

    res.status(200).json({
      success: true,
      batchRecommendation
    });
  } catch (error) {
    console.error('Batch pricing error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMarketAnalysis = async (req, res) => {
  try {
    const { category } = req.params;
    
    const analysis = await pricingEngine.getMarketAnalysis(category);

    res.status(200).json({
      success: true,
      category,
      analysis
    });
  } catch (error) {
    console.error('Market analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMarketData = async (req, res) => {
  try {
    const { salesData } = req.body;

    await pricingEngine.updateMarketData(salesData);

    res.status(200).json({
      success: true,
      message: 'Market data updated',
      lastUpdated: pricingEngine.marketData.lastUpdated
    });
  } catch (error) {
    console.error('Update market data error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== VOICE TRANSCRIPTION ====================

exports.transcribeAudio = async (req, res) => {
  try {
    const { audioData } = req.body;
    const options = req.body.options || {};

    if (!audioData) {
      return res.status(400).json({
        success: false,
        message: 'Audio data is required'
      });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');

    const result = await voiceTranscription.transcribe(audioBuffer, options);

    res.status(200).json({
      success: true,
      transcription: result
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.translateTranscription = async (req, res) => {
  try {
    const { transcription, targetLanguage } = req.body;

    if (!transcription || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: 'Transcription and target language are required'
      });
    }

    const translation = await voiceTranscription.translate(transcription, targetLanguage);

    res.status(200).json({
      success: true,
      translation
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateTagsFromAudio = async (req, res) => {
  try {
    const { transcription } = req.body;

    if (!transcription) {
      return res.status(400).json({
        success: false,
        message: 'Transcription is required'
      });
    }

    const tags = voiceTranscription.generateTags(transcription);

    res.status(200).json({
      success: true,
      tags
    });
  } catch (error) {
    console.error('Generate tags error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSupportedLanguages = async (req, res) => {
  try {
    const languages = voiceTranscription.getSupportedLanguages();

    res.status(200).json({
      success: true,
      languages
    });
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.batchTranscribe = async (req, res) => {
  try {
    const { audioFiles } = req.body;
    const options = req.body.options || {};

    if (!Array.isArray(audioFiles) || audioFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of audio files'
      });
    }

    const result = await voiceTranscription.batchTranscribe(audioFiles, options);

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Batch transcribe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CONTENT MODERATION ====================

exports.moderateContent = async (req, res) => {
  try {
    const { imageData, metadata, artistAddress, claimedNation } = req.body;

    // Convert base64 image to buffer if provided
    let imageBuffer = null;
    if (imageData) {
      imageBuffer = Buffer.from(imageData, 'base64');
    }

    const contentData = {
      imageBuffer,
      metadata,
      artistAddress,
      claimedNation
    };

    const result = await contentModeration.moderateContent(contentData);

    res.status(200).json({
      success: true,
      moderation: result
    });
  } catch (error) {
    console.error('Content moderation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getModerationGuidelines = async (req, res) => {
  try {
    const { nation } = req.query;

    const guidelines = contentModeration.getGuidelines(nation);

    res.status(200).json({
      success: true,
      guidelines
    });
  } catch (error) {
    console.error('Get guidelines error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.batchModerate = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of items to moderate'
      });
    }

    const results = await Promise.all(
      items.map(async (item) => {
        let imageBuffer = null;
        if (item.imageData) {
          imageBuffer = Buffer.from(item.imageData, 'base64');
        }

        return contentModeration.moderateContent({
          imageBuffer,
          metadata: item.metadata,
          artistAddress: item.artistAddress,
          claimedNation: item.claimedNation
        });
      })
    );

    const summary = {
      total: items.length,
      approved: results.filter(r => r.approved && r.status === 'approved').length,
      approvedWithWarnings: results.filter(r => r.status === 'approved_with_warnings').length,
      pendingReview: results.filter(r => r.status === 'pending_review').length,
      rejected: results.filter(r => r.status === 'rejected').length
    };

    res.status(200).json({
      success: true,
      summary,
      results
    });
  } catch (error) {
    console.error('Batch moderate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COMBINED AI FEATURES ====================

exports.analyzeArtworkComplete = async (req, res) => {
  try {
    const { nftId } = req.params;
    const { imageData, metadata, audioData } = req.body;

    let imageBuffer = null;
    if (imageData) {
      imageBuffer = Buffer.from(imageData, 'base64');
    }

    // Run all AI analyses in parallel
    const [authentication, pricing, moderation] = await Promise.all([
      artAuthService.authenticateArtwork(imageBuffer, metadata),
      pricingEngine.getPricingRecommendation(metadata),
      contentModeration.moderateContent({
        imageBuffer,
        metadata,
        artistAddress: metadata.artistAddress,
        claimedNation: metadata.nation
      })
    ]);

    // Transcribe audio if provided
    let transcription = null;
    if (audioData) {
      const audioBuffer = Buffer.from(audioData, 'base64');
      transcription = await voiceTranscription.transcribe(audioBuffer);
    }

    // Compile comprehensive analysis
    const analysis = {
      nftId,
      timestamp: new Date().toISOString(),
      authentication: {
        verdict: authentication.verdict,
        score: authentication.overallScore,
        confidence: authentication.confidence,
        recommendations: authentication.recommendations
      },
      pricing: {
        suggestedPrice: pricing.suggestedPrice,
        priceRange: pricing.priceRange,
        confidence: pricing.confidence,
        marketAnalysis: pricing.marketAnalysis
      },
      moderation: {
        approved: moderation.approved,
        status: moderation.status,
        flags: moderation.flags,
        warnings: moderation.warnings
      },
      transcription: transcription ? {
        text: transcription.text,
        language: transcription.language,
        keywords: transcription.metadata.keywords
      } : null,
      overallStatus: this.calculateOverallStatus(authentication, pricing, moderation)
    };

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Complete analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper method to calculate overall status
exports.calculateOverallStatus = (authentication, pricing, moderation) => {
  if (moderation.status === 'rejected') {
    return { status: 'rejected', reason: 'Content moderation failed' };
  }
  
  if (authentication.verdict === 'likely_counterfeit') {
    return { status: 'flagged', reason: 'Authentication concerns' };
  }
  
  if (moderation.status === 'pending_review') {
    return { status: 'pending', reason: 'Requires human review' };
  }
  
  if (authentication.verdict === 'uncertain') {
    return { status: 'caution', reason: 'Low authentication confidence' };
  }
  
  return { status: 'approved', reason: 'All checks passed' };
};
