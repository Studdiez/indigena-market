const NFTCollection = require('../models/NFTcollection.model.js');
const User = require('../models/user.model.js');

/**
 * Translation Service
 * Manages voice memo transcription and translation pipeline
 * Supports community volunteer translators and professional services
 */

// Supported language pairs for translation
const SUPPORTED_LANGUAGES = {
    'mi': { name: 'Māori', region: 'Aotearoa/New Zealand' },
    'aus': { name: 'Aboriginal English', region: 'Australia' },
    'sm': { name: 'Samoan', region: 'Samoa' },
    'to': { name: 'Tongan', region: 'Tonga' },
    'fj': { name: 'Fijian', region: 'Fiji' },
    'nv': { name: 'Navajo', region: 'North America' },
    'cr': { name: 'Cree', region: 'North America' },
    'oj': { name: 'Ojibwe', region: 'North America' },
    'qu': { name: 'Quechua', region: 'South America' },
    'ay': { name: 'Aymara', region: 'South America' },
    'en': { name: 'English', region: 'Global' },
    'es': { name: 'Spanish', region: 'Global' },
    'fr': { name: 'French', region: 'Global' },
    'de': { name: 'German', region: 'Global' },
    'zh': { name: 'Chinese', region: 'Global' },
    'ja': { name: 'Japanese', region: 'Global' }
};

// Request transcription of voice memo
exports.requestTranscription = async (nftId, languageCode) => {
    try {
        const nft = await NFTCollection.findOne({ NftId: nftId });
        if (!nft || !nft.voiceStoryUrl) {
            throw new Error('NFT or voice memo not found');
        }

        // In production, this would call a speech-to-text API
        // For now, create a transcription request record
        const transcriptionRequest = {
            nftId,
            originalLanguage: languageCode,
            status: 'pending',
            requestedAt: new Date(),
            // This would integrate with Google Cloud Speech-to-Text or similar
            service: 'pending_assignment'
        };

        // Update NFT with transcription status
        if (!nft.voiceStory) {
            nft.voiceStory = {};
        }
        nft.voiceStory.originalLanguage = languageCode;
        nft.voiceStory.transcriptionStatus = 'pending';
        await nft.save();

        return {
            success: true,
            requestId: transcriptionRequest,
            status: 'pending',
            message: 'Transcription request submitted'
        };
    } catch (error) {
        console.error('Request transcription error:', error);
        throw error;
    }
};

// Submit transcription (for manual or API transcription)
exports.submitTranscription = async (nftId, transcript, transcribedBy) => {
    try {
        const nft = await NFTCollection.findOne({ NftId: nftId });
        if (!nft) {
            throw new Error('NFT not found');
        }

        if (!nft.voiceStory) {
            nft.voiceStory = {};
        }

        nft.voiceStory.transcript = transcript;
        nft.voiceStory.transcribedBy = transcribedBy;
        nft.voiceStory.transcribedAt = new Date();
        nft.voiceStory.transcriptionStatus = 'completed';

        await nft.save();

        return {
            success: true,
            message: 'Transcription submitted successfully',
            nftId
        };
    } catch (error) {
        console.error('Submit transcription error:', error);
        throw error;
    }
};

// Request translation to target language
exports.requestTranslation = async (nftId, targetLanguage, requesterAddress) => {
    try {
        const nft = await NFTCollection.findOne({ NftId: nftId });
        if (!nft || !nft.voiceStory?.transcript) {
            throw new Error('NFT or transcript not found');
        }

        // Check if translation already exists
        const existingTranslation = nft.voiceStory.translations?.find(
            t => t.language === targetLanguage
        );

        if (existingTranslation) {
            return {
                success: true,
                message: 'Translation already exists',
                translation: existingTranslation
            };
        }

        // Create translation request
        const translationRequest = {
            nftId,
            sourceLanguage: nft.voiceStory.originalLanguage,
            targetLanguage,
            originalText: nft.voiceStory.transcript,
            status: 'pending',
            requestedAt: new Date(),
            requestedBy: requesterAddress
        };

        // Add pending translation slot
        if (!nft.voiceStory.translations) {
            nft.voiceStory.translations = [];
        }

        nft.voiceStory.translations.push({
            language: targetLanguage,
            translatedText: null,
            audioUrl: null,
            translatorName: null,
            translatedAt: null,
            status: 'pending'
        });

        await nft.save();

        return {
            success: true,
            requestId: translationRequest,
            status: 'pending',
            message: 'Translation request submitted'
        };
    } catch (error) {
        console.error('Request translation error:', error);
        throw error;
    }
};

// Submit translation (for community volunteers or professional translators)
exports.submitTranslation = async (nftId, targetLanguage, translatedText, translatorInfo) => {
    try {
        const nft = await NFTCollection.findOne({ NftId: nftId });
        if (!nft) {
            throw new Error('NFT not found');
        }

        if (!nft.voiceStory || !nft.voiceStory.translations) {
            throw new Error('No translations found for this NFT');
        }

        // Find and update the translation
        const translationIndex = nft.voiceStory.translations.findIndex(
            t => t.language === targetLanguage
        );

        if (translationIndex === -1) {
            throw new Error('Translation request not found');
        }

        nft.voiceStory.translations[translationIndex] = {
            language: targetLanguage,
            translatedText: translatedText,
            audioUrl: translatorInfo.audioUrl || null,
            translatorName: translatorInfo.name,
            translatedAt: new Date(),
            status: 'completed'
        };

        await nft.save();

        // Notify requester if applicable
        // In production, send notification to requester

        return {
            success: true,
            message: 'Translation submitted successfully',
            nftId,
            language: targetLanguage
        };
    } catch (error) {
        console.error('Submit translation error:', error);
        throw error;
    }
};

// Get available translations for an NFT
exports.getTranslations = async (nftId) => {
    try {
        const nft = await NFTCollection.findOne({ NftId: nftId })
            .select('voiceStory ItemName');

        if (!nft) {
            throw new Error('NFT not found');
        }

        return {
            success: true,
            nftId,
            itemName: nft.ItemName,
            originalLanguage: nft.voiceStory?.originalLanguage,
            originalTranscript: nft.voiceStory?.transcript,
            translations: nft.voiceStory?.translations || [],
            availableLanguages: nft.voiceStory?.translations?.map(t => t.language) || []
        };
    } catch (error) {
        console.error('Get translations error:', error);
        throw error;
    }
};

// Get translation requests for volunteers
exports.getPendingTranslations = async (filters = {}) => {
    try {
        const { targetLanguage, sourceLanguage, limit = 20 } = filters;

        // Find NFTs with pending translations
        const query = {
            'voiceStory.translations.status': 'pending'
        };

        if (sourceLanguage) {
            query['voiceStory.originalLanguage'] = sourceLanguage;
        }

        const nfts = await NFTCollection.find(query)
            .select('NftId ItemName voiceStory culturalTags')
            .limit(parseInt(limit));

        const pendingRequests = [];

        nfts.forEach(nft => {
            if (nft.voiceStory?.translations) {
                nft.voiceStory.translations.forEach(translation => {
                    if (translation.status === 'pending') {
                        if (!targetLanguage || translation.language === targetLanguage) {
                            pendingRequests.push({
                                nftId: nft.NftId,
                                itemName: nft.ItemName,
                                sourceLanguage: nft.voiceStory.originalLanguage,
                                targetLanguage: translation.language,
                                originalText: nft.voiceStory.transcript,
                                culturalContext: nft.culturalTags,
                                requestedAt: translation.requestedAt || nft.createdAt
                            });
                        }
                    }
                });
            }
        });

        return {
            success: true,
            count: pendingRequests.length,
            requests: pendingRequests
        };
    } catch (error) {
        console.error('Get pending translations error:', error);
        throw error;
    }
};

// Get supported languages
exports.getSupportedLanguages = () => {
    return {
        success: true,
        languages: SUPPORTED_LANGUAGES
    };
};

// Auto-translate using AI service (for initial draft)
exports.autoTranslate = async (text, sourceLanguage, targetLanguage) => {
    try {
        // In production, this would call Google Translate, DeepL, or similar
        // For now, return a placeholder
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            sourceLanguage,
            targetLanguage,
            originalText: text,
            translatedText: `[Auto-translated to ${SUPPORTED_LANGUAGES[targetLanguage]?.name || targetLanguage}]: ${text}`,
            confidence: 0.75,
            needsReview: true,
            service: 'ai_draft'
        };
    } catch (error) {
        console.error('Auto translate error:', error);
        throw error;
    }
};

// Register as volunteer translator
exports.registerTranslator = async (walletAddress, languages) => {
    try {
        const user = await User.findOne({ walletAddress });
        if (!user) {
            throw new Error('User not found');
        }

        user.translatorProfile = {
            isTranslator: true,
            languages: languages,
            registeredAt: new Date(),
            translationsCompleted: 0,
            rating: 0
        };

        await user.save();

        return {
            success: true,
            message: 'Registered as volunteer translator',
            languages
        };
    } catch (error) {
        console.error('Register translator error:', error);
        throw error;
    }
};

module.exports = {
    SUPPORTED_LANGUAGES,
    requestTranscription,
    submitTranscription,
    requestTranslation,
    submitTranslation,
    getTranslations,
    getPendingTranslations,
    getSupportedLanguages,
    autoTranslate,
    registerTranslator
} = exports;
