import chatModel from "./model.js";
import chatView from "./view.js";
import AIServiceFactory from "./services/ServiceSelector.js";



/**
 * chatController - coordinates between Model and View
 * handles all user interactions and business logic
 */
class ChatController {
    constructor() {
        this.model = new chatModel();
        this.view = new chatView();

        this.currentService = AIServiceFactory.createService('eliza');
        this.init();
    }

    /**
     * initialize the controller
     */
    init() {
        this.model.addObserver((messages) => {
            this.view.render(messages);
        });

        this.setupEventListeners();

        this.view.render(this.model.getAll());
    }

    /**
     * setup event listeners for custom events from view
     */
    setupEventListeners() {
        document.addEventListener("message-send", (e) => {
            this.handleMessageSend(e.detail.text);
        });

        document.addEventListener("message-edit", (e) => {
            this.handleMessageEdit(e.detail.id);
        });

        document.addEventListener("message-delete", (e) => {
            this.handleMessageDelete(e.detail.id);
        });

        document.addEventListener("messages-clear", () => {
            this.handleMessagesClear();
        });

        document.addEventListener("messages-export", () => {
            this.handleExport();
        });

        document.addEventListener("messages-import", (e) => {
            this.handleImport(e.detail.file);
        });
    }

    /**
     * handle sending a new message
     * @param {string} text - User"s message text
     */
    async handleMessageSend(text) {
        this.model.createMessage(text, true);

        try {
            const botResponse = await this.currentService.getResponse(text);

            setTimeout(() => {
                this.model.createMessage(botResponse, false);}, 500);

        } catch (error) {
            console.error('AI Service Error:', error);

            setTimeout(() => {
                this.model.createMessage(
                    `Error encountered: ${error.message}`, false);
            }, 500);
        }
    }

    /**
     * handle editing a message
     * @param {string} id - Message ID to edit
     */
    handleMessageEdit(id) {
        const messages = this.model.getAll();
        const message = messages.find(msg => msg.id === id);

        if (!message) return;

        const newText = prompt("edit your message...", message.text);

        if (newText && newText.trim() !== "") {
            this.model.updateMessage(id, newText.trim());
        }
    }

    /**
     * handle deleting a message
     * @param {string} id - Message ID to delete
     */
    handleMessageDelete(id) {
        this.model.deleteMessage(id);
    }

    /**
     * handle clearing all messages
     */
    handleMessagesClear() {
        this.model.clearMessages()
    }

    /**
     * handle exporting chat history to JSON file
     */
    handleExport() {
        const messages = this.model.getAll();
        const dataStr = JSON.stringify(messages, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `chat-history-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    /**
     * handle importing chat history from JSON file
     * @param {File} file - the JSON file to import
     */
    handleImport(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const messages = JSON.parse(e.target.result);

                if (!Array.isArray(messages)) {
                    alert("Invalid file format: Expected an array of messages");
                    return;
                }

                this.model.messages = messages;
                this.model._save();
                this.model.notifyObservers();

                alert(`Successfully imported ${messages.length} messages!`);
            } catch (error) {
                alert("Error importing file: " + error.message);
            }
        };
        reader.readAsText(file);
    }
}

export default ChatController;