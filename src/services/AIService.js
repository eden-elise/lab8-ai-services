/**
 * this is our contract that all AI providers must follow
 * This is the "interface" in our abstraction layer
 */
class AIService {
    /**
     * get a response from the AI service
     * @param {string} message - user's message
     * @returns {Promise<string>} - AI's response
     */
    async getResponse(message) {
        throw new Error('AIService.getResponse() must be implemented by subclass');
    }

    /**
     * get the name of this service for display
     * @returns {string} - display name
     */
    getName() {
        throw new Error('AIService.getName() must be implemented by subclass');
    }

    /**
     * check if the service requires an API key
     * @returns {boolean}
     */
    requiresApiKey() {
        return false; //not always required(eliza)
    }

    /**
     * validate that the service is properly configured
     * @returns {boolean}
     */
    isConfigured() {
        return true; // default should be ready
    }
}

export default AIService;