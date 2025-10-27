import ElizaService from './ElizaService.js';
// import GeminiService from './GeminiService.js';
// import GroqService from './GroqService.js';

/**
 * for creating AI services
 * "Dependency Injection" pattern - creates the right service based on type
 */
class AIServiceFactory {
    /**
     * create an AI service instance
     * @param {string} type - service type ('eliza', 'gemini', 'groq')
     * @param {string} apiKey - API key (only needed for cloud services)
     * @returns {AIService} - configured AI service instance
     */
    static createService(type, apiKey = null) {
        switch (type.toLowerCase()) {
            case 'eliza':
                return new ElizaService();

            // TODO: Add these after testing Eliza works and implementing geminiService and GroqService
            // case 'gemini':
            //     if (!apiKey) {
            //         throw new Error('Gemini service requires an API key');
            //     }
            //     return new GeminiService(apiKey);
            //
            // case 'groq':
            //     if (!apiKey) {
            //         throw new Error('Groq service requires an API key');
            //     }
            //     return new GroqService(apiKey);

            default:
                throw new Error(`Unknown service type: ${type}. Currently only 'eliza' is supported.`);
        }
    }

    /**
     * get list of available service types
     * @returns {Array<{value: string, name: string, requiresKey: boolean}>}
     */
    static getAvailableServices() {
        return [
            { value: 'eliza', name: 'Eliza (Local)', requiresKey: false }
            // TODO: Add these after testing
            // { value: 'gemini', name: 'Gemini (Cloud)', requiresKey: true },
            // { value: 'groq', name: 'Groq (Cloud)', requiresKey: true }
        ];
    }
}

export default AIServiceFactory;