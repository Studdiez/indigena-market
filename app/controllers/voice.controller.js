const VoiceCommand = require('../models/VoiceCommand.model.js');
const Users = require('../models/user.model.js');
const NFT = require('../models/NFTcollection.model.js');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Process voice command (text-based for now, audio processing can be added)
exports.processVoiceCommand = async (req, res) => {
    try {
        const { 
            text, 
            language = 'english', 
            walletAddress,
            audioBlob,  // Optional: base64 encoded audio
            elderMode = false
        } = req.body;

        if (!text && !audioBlob) {
            return res.status(400).send({
                status: false,
                message: 'Text or audio input is required'
            });
        }

        // For audio input, we would use speech-to-text service
        // For now, we process text directly
        let processedText = text ? text.toLowerCase().trim() : '';

        // Find matching command
        const command = await findMatchingCommand(processedText, language, elderMode);

        if (!command) {
            return res.status(404).send({
                status: false,
                message: 'Command not recognized',
                suggestion: 'Try saying "help" for available commands'
            });
        }

        // Extract parameters from text
        const parameters = extractParameters(processedText, command);

        // Check if all required parameters are present
        const missingParams = command.parameters.filter(p => 
            p.required && !parameters[p.name]
        );

        if (missingParams.length > 0) {
            return res.status(400).send({
                status: false,
                message: `Missing required parameters: ${missingParams.map(p => p.name).join(', ')}`,
                command: command.intent,
                parametersNeeded: missingParams
            });
        }

        // Increment usage count
        await VoiceCommand.updateOne(
            { commandId: command.commandId },
            { $inc: { usageCount: 1 } }
        );

        // Return command details for frontend to execute
        return res.status(200).send({
            status: true,
            command: {
                intent: command.intent,
                action: command.action,
                httpMethod: command.httpMethod,
                parameters: parameters,
                confirmationRequired: command.confirmationRequired,
                successMessage: command.successMessage,
                errorMessage: command.errorMessage
            },
            processedText: processedText,
            language: language
        });

    } catch (error) {
        console.error('Process voice command error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to process voice command',
            error: error.message
        });
    }
};

// Find matching command based on text input
async function findMatchingCommand(text, language, elderMode) {
    // Get all active commands for the language
    let query = { 
        language: language, 
        isActive: true 
    };
    
    if (elderMode) {
        query.elderMode = true;
    }

    const commands = await VoiceCommand.find(query);

    // Find best matching command
    let bestMatch = null;
    let bestScore = 0;

    for (const command of commands) {
        for (const phrase of command.phrases) {
            const score = calculateSimilarity(text, phrase.toLowerCase());
            if (score > bestScore && score > 0.7) {  // 70% similarity threshold
                bestScore = score;
                bestMatch = command;
            }
        }
    }

    return bestMatch;
}

// Simple similarity calculation (can be replaced with more sophisticated NLP)
function calculateSimilarity(text1, text2) {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    
    let matches = 0;
    for (const word1 of words1) {
        if (words2.some(word2 => word2.includes(word1) || word1.includes(word2))) {
            matches++;
        }
    }
    
    return matches / Math.max(words1.length, words2.length);
}

// Extract parameters from text based on command definition
function extractParameters(text, command) {
    const parameters = {};
    
    for (const param of command.parameters) {
        const value = extractParameterValue(text, param);
        if (value !== null) {
            parameters[param.name] = value;
        }
    }
    
    return parameters;
}

// Extract specific parameter value from text
function extractParameterValue(text, param) {
    switch (param.type) {
        case 'percentage':
            // Match patterns like "10 percent", "10%", "set to 10"
            const percentMatch = text.match(/(\d+)\s*(percent|%)/i);
            return percentMatch ? parseInt(percentMatch[1]) : null;
            
        case 'currency':
            // Match patterns like "10 xrp", "5 dollars"
            const currencyMatch = text.match(/(\d+(?:\.\d+)?)\s*(xrp|dollars?|usd)/i);
            return currencyMatch ? parseFloat(currencyMatch[1]) : null;
            
        case 'number':
            // Extract any number
            const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
            return numberMatch ? parseFloat(numberMatch[1]) : null;
            
        case 'address':
            // Match XRPL address pattern (r...)
            const addressMatch = text.match(/(r[1-9A-HJ-NP-Za-km-z]{25,34})/);
            return addressMatch ? addressMatch[1] : null;
            
        case 'string':
            // For string parameters, we'd need more context
            // This is a simplified version
            return text;
            
        case 'boolean':
            // Match yes/no, true/false
            if (/\b(yes|true|enable|on)\b/i.test(text)) return true;
            if (/\b(no|false|disable|off)\b/i.test(text)) return false;
            return null;
            
        default:
            return null;
    }
}

// Get supported languages
exports.getSupportedLanguages = async (req, res) => {
    try {
        const languages = await VoiceCommand.distinct('language', { isActive: true });
        
        const languageInfo = {
            english: { name: 'English', nativeName: 'English' },
            maori: { name: 'Māori', nativeName: 'Te Reo Māori' },
            aboriginal_english: { name: 'Aboriginal English', nativeName: 'Aboriginal English' },
            samoan: { name: 'Samoan', nativeName: 'Gagana Sāmoa' },
            tongan: { name: 'Tongan', nativeName: 'Lea faka-Tonga' },
            fijian: { name: 'Fijian', nativeName: 'Vosa Vakaviti' },
            hawaiian: { name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi' },
            navajo: { name: 'Navajo', nativeName: 'Diné Bizaad' },
            cherokee: { name: 'Cherokee', nativeName: 'ᏣᎳᎩ' },
            inuktitut: { name: 'Inuktitut', nativeName: 'ᐃᓄᒃᑎᑐᑦ' }
        };

        const supportedLanguages = languages.map(lang => ({
            code: lang,
            ...languageInfo[lang]
        }));

        return res.status(200).send({
            status: true,
            languages: supportedLanguages
        });
    } catch (error) {
        console.error('Get supported languages error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get supported languages'
        });
    }
};

// Get commands for a specific language
exports.getCommandsByLanguage = async (req, res) => {
    try {
        const { language } = req.params;
        const { elderMode, category } = req.query;

        let query = { 
            language: language, 
            isActive: true 
        };

        if (elderMode === 'true') {
            query.elderMode = true;
        }

        if (category) {
            query.category = category;
        }

        const commands = await VoiceCommand.find(query).select('-__v');

        return res.status(200).send({
            status: true,
            count: commands.length,
            commands: commands.map(cmd => ({
                commandId: cmd.commandId,
                intent: cmd.intent,
                phrases: cmd.phrases,
                description: cmd.description,
                category: cmd.category,
                parameters: cmd.parameters,
                elderMode: cmd.elderMode,
                confirmationRequired: cmd.confirmationRequired,
                successMessage: cmd.successMessage
            }))
        });
    } catch (error) {
        console.error('Get commands by language error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get commands'
        });
    }
};

// Submit voice feedback for improving recognition
exports.submitFeedback = async (req, res) => {
    try {
        const {
            commandId,
            originalText,
            recognizedIntent,
            correctIntent,
            wasCorrect,
            audioSample,  // Optional base64 audio
            language
        } = req.body;

        // Store feedback for model improvement
        // This could be stored in a separate collection for analysis
        console.log('Voice feedback received:', {
            commandId,
            originalText,
            recognizedIntent,
            correctIntent,
            wasCorrect,
            language
        });

        // If the recognition was wrong, we could use this to improve
        if (!wasCorrect && correctIntent) {
            // Logic to improve model could go here
            // For example, add the phrase as an alternative for the correct intent
        }

        return res.status(200).send({
            status: true,
            message: 'Feedback submitted successfully'
        });
    } catch (error) {
        console.error('Submit feedback error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to submit feedback'
        });
    }
};

// Seed initial voice commands (for setup)
exports.seedVoiceCommands = async (req, res) => {
    try {
        const defaultCommands = getDefaultVoiceCommands();
        
        for (const command of defaultCommands) {
            await VoiceCommand.findOneAndUpdate(
                { commandId: command.commandId },
                command,
                { upsert: true, new: true }
            );
        }

        return res.status(200).send({
            status: true,
            message: 'Voice commands seeded successfully',
            count: defaultCommands.length
        });
    } catch (error) {
        console.error('Seed voice commands error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to seed voice commands'
        });
    }
};

// Get default voice commands
function getDefaultVoiceCommands() {
    return [
        // NFT Commands
        {
            commandId: 'en_mint_nft',
            intent: 'mint_nft',
            language: 'english',
            phrases: [
                'mint a new nft',
                'create new nft',
                'mint nft',
                'create artwork',
                'mint my art',
                'create new artwork'
            ],
            parameters: [],
            action: '/api/xrpl/mint',
            httpMethod: 'POST',
            elderMode: true,
            category: 'nft',
            description: 'Create a new NFT',
            successMessage: 'Opening NFT creation form',
            confirmationRequired: false
        },
        {
            commandId: 'en_search_nft',
            intent: 'search_nft',
            language: 'english',
            phrases: [
                'search for nfts',
                'find nfts',
                'search artwork',
                'browse nfts',
                'look for art'
            ],
            parameters: [
                {
                    name: 'query',
                    type: 'string',
                    required: false,
                    description: 'Search query'
                }
            ],
            action: '/api/getAll',
            httpMethod: 'GET',
            elderMode: true,
            category: 'marketplace',
            description: 'Search for NFTs'
        },
        {
            commandId: 'en_view_dashboard',
            intent: 'view_dashboard',
            language: 'english',
            phrases: [
                'view my dashboard',
                'show my dashboard',
                'my dashboard',
                'view profile',
                'my stuff',
                'my account'
            ],
            parameters: [],
            action: '/api/seva/dashboard',
            httpMethod: 'GET',
            elderMode: true,
            category: 'profile',
            description: 'View user dashboard'
        },
        {
            commandId: 'en_donate_seva',
            intent: 'donate_seva',
            language: 'english',
            phrases: [
                'donate seva',
                'give seva',
                'donate to cause',
                'support cultural cause',
                'donate to community'
            ],
            parameters: [
                {
                    name: 'amount',
                    type: 'number',
                    required: true,
                    description: 'Amount of SEVA to donate'
                },
                {
                    name: 'causeId',
                    type: 'string',
                    required: true,
                    description: 'Cause to donate to'
                }
            ],
            action: '/api/seva/donate',
            httpMethod: 'POST',
            elderMode: true,
            category: 'seva',
            description: 'Donate SEVA to cultural cause',
            confirmationRequired: true,
            successMessage: 'SEVA donation processed successfully'
        },
        {
            commandId: 'en_allocate_seva',
            intent: 'allocate_seva',
            language: 'english',
            phrases: [
                'allocate seva',
                'set seva percentage',
                'allocate percentage to seva',
                'set donation percentage',
                'allocate to cultural causes'
            ],
            parameters: [
                {
                    name: 'percentage',
                    type: 'percentage',
                    required: true,
                    description: 'Percentage to allocate to SEVA'
                }
            ],
            action: '/api/seva/allocate',
            httpMethod: 'POST',
            elderMode: true,
            category: 'seva',
            description: 'Set SEVA allocation percentage',
            successMessage: 'SEVA allocation updated'
        },
        {
            commandId: 'en_help',
            intent: 'help',
            language: 'english',
            phrases: [
                'help',
                'what can i say',
                'voice commands',
                'available commands',
                'how do i use this'
            ],
            parameters: [],
            action: '/api/voice/commands/english',
            httpMethod: 'GET',
            elderMode: true,
            category: 'help',
            description: 'Get help with voice commands',
            requiresAuth: false
        },
        {
            commandId: 'en_filter_tribe',
            intent: 'filter_by_tribe',
            language: 'english',
            phrases: [
                'filter by tribe',
                'show art from tribe',
                'artwork from',
                'filter tribe'
            ],
            parameters: [
                {
                    name: 'tribe',
                    type: 'string',
                    required: true,
                    description: 'Tribe name to filter by'
                }
            ],
            action: '/api/SearchgetAll',
            httpMethod: 'POST',
            elderMode: true,
            category: 'marketplace',
            description: 'Filter NFTs by tribe'
        },
        {
            commandId: 'en_add_favorite',
            intent: 'add_favorite',
            language: 'english',
            phrases: [
                'add to favorites',
                'save this',
                'like this',
                'add to my favorites',
                'bookmark this'
            ],
            parameters: [
                {
                    name: 'nftId',
                    type: 'string',
                    required: true,
                    description: 'NFT ID to favorite'
                }
            ],
            action: '/api/AddFavourites',
            httpMethod: 'POST',
            elderMode: true,
            category: 'nft',
            description: 'Add NFT to favorites'
        },
        {
            commandId: 'en_cancel',
            intent: 'cancel',
            language: 'english',
            phrases: [
                'cancel',
                'stop',
                'go back',
                'never mind',
                'abort'
            ],
            parameters: [],
            action: 'cancel_action',
            httpMethod: 'POST',
            elderMode: true,
            category: 'navigation',
            description: 'Cancel current action',
            requiresAuth: false
        },
        {
            commandId: 'en_confirm',
            intent: 'confirm',
            language: 'english',
            phrases: [
                'confirm',
                'yes',
                'proceed',
                'go ahead',
                'ok',
                'okay'
            ],
            parameters: [],
            action: 'confirm_action',
            httpMethod: 'POST',
            elderMode: true,
            category: 'navigation',
            description: 'Confirm action',
            requiresAuth: false
        }
    ];
}


// Backward-compatible route alias used by ui.route.js
exports.seedDefaultCommands = exports.seedVoiceCommands;
