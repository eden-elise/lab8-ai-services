import AIService from './AIService.js';

/**
 * GroqService - Groq AI integration (OpenAI-compatible)
 */
class GroqService extends AIService {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        this.model = 'llama-3.3-70b-versatile';
        this.endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    }

    /**
     * get response from Groq API
     * @param {string} message - User's message
     * @returns {Promise<string>} - Groq's response
     */
    async getResponse(message) {
        if (!this.isConfigured()) {
            throw new Error('GroqService requires an API key');
        }

        if (!message || typeof message !== 'string') {
            throw new Error('Message must be a non-empty string');
        }

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{
                        role: 'user',
                        content: message
                    }],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(`Groq API error: ${data.error.message}`);
            }

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Unexpected response format from Groq');
            }

            const aiResponse = data.choices[0].message.content;
            return aiResponse;

        } catch (error) {
            if (error.message.includes('API error')) {
                throw error;
            } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error: Unable to reach Groq API. Check your internet connection.');
            } else {
                throw new Error(`Groq service error: ${error.message}`);
            }
        }
    }

    getName() {
        return 'Groq (Cloud)';
    }

    requiresApiKey() {
        return true;
    }

    isConfigured() {
        return this.apiKey && this.apiKey.length > 0;
    }

    /**
     * update API key (useful for settings changes)
     * @param {string} newApiKey
     */
    setApiKey(newApiKey) {
        this.apiKey = newApiKey;
    }
}

export default GroqService;
