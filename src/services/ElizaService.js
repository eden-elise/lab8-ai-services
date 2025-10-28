import AIService from './AIService.js';
import { getBotResponse } from '../js/eliza.js';

/**
 * ElizaService - wraps Eliza chatbot
 * runs locally in the browser
 */
class ElizaService extends AIService {
    constructor() {
        super();
    }

    /**
     * get response from Eliza using pattern matching
     * @param {string} message - user's message
     * @returns {Promise<string>} - eliza's response
     */
    async getResponse(message) {
        if (!message || typeof message !== 'string') {
            throw new Error('Message must be a non-empty string');
        }

        const response = getBotResponse(message);

        return Promise.resolve(response); //ME: promise is an object that represents the eventual completion
    }

    /**
     * get service name for display in UI
     * @returns {string}
     */
    getName() {
        return 'Eliza (Local)';
    }

    /**
     * eliza doesn't need an API key
     * @returns {boolean}
     */
    requiresApiKey() {
        return false;
    }

    /**
     * eliza is always ready
     * @returns {boolean}
     */
    isConfigured() {
        return true;
    }
}

export default ElizaService;