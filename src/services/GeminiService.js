import AIService from "./AIService.js";

/**
 * GeminiService - google Gemini AI integration
 * requires API key, makes network requests, costs money after free tier
 */
class GeminiService extends AIService {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey;
        this.model = "gemini-2.0-flash";
        this.endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    }

    /**
     * get response from Gemini API
     * @param {string} message - user's message
     * @returns {Promise<string>} - gemini's response
     */
    async getResponse(message) {
        if (!this.isConfigured()) {
            throw new Error("GeminiService requires an API key");
        }

        if (!message || typeof message !== "string") {
            throw new Error("Message must be a non-empty string");
        }

        try {
            const url = `${this.endpoint}?key=${this.apiKey}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(`Gemini API error: ${data.error.message}`);
            }

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                throw new Error("Unexpected response format from Gemini");
            }

            const aiResponse = data.candidates[0].content.parts[0].text;

            return aiResponse;

        } catch (error) {
            if (error.message.includes("API error")) {
                throw error;
            } else if (error.name === "TypeError" && error.message.includes("fetch")) {
                throw new Error("Network error: Unable to reach Gemini API. Check your internet connection.");
            } else {
                throw new Error(`Gemini service error: ${error.message}`);
            }
        }
    }

    getName() {
        return "Gemini (Cloud)";
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

export default GeminiService;