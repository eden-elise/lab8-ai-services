/**
 * chatView - handles all DOM manipulation and UI
 * component based approach
 */
class chatView {
    constructor() {
        this.messagesContainer = document.getElementById("messages");
        this.inputForm = document.getElementById("chat-form");
        this.inputField = document.getElementById("message-input");
        this.messageCount = document.getElementById("message-count");

        this.exportButton = document.getElementById("export-button");
        this.importButton = document.getElementById("import-button");
        this.clearButton = document.getElementById("clear-button");
        this.fileInput = document.getElementById("file-input");

        this.setUpEventListeners()
    }

    /**
     * set up event listeners
     */
    setUpEventListeners() {
        this.inputForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = this.inputField.value.trim()

            if (text) {
                document.dispatchEvent(new CustomEvent("message-send", {
                    detail: {text}
                }));

                this.inputField.value = "";
                this.inputField.focus();
            }
        });

        this.clearButton.addEventListener("click", () => {
            if (confirm("are you sure you want to clear this message?")) {
                document.dispatchEvent(new CustomEvent("messages-clear"))
            }
        });

        this.exportButton.addEventListener("click", () => {
            document.dispatchEvent(new CustomEvent("messages-export"));
        });

        this.importButton.addEventListener("click", () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                document.dispatchEvent(new CustomEvent("messages-import", {
                    detail: {file}
                }));
                this.fileInput.value = ""; //ME: reset
            }
        })
    }

    /**
     * render all messages
     * @param {Array} messages - array of message objects
     */
    render(messages) {
        this.messagesContainer.innerHTML = "";
        this.messageCount.textContent = `${messages.length}`;

        if (messages.length === 0) {
            this.showEmptyState();
        } else {
            messages.forEach((message) => {
                const messageElement = this.createMessageElement(message);
                this.messagesContainer.appendChild(messageElement);
            });
            this.scrollToBottom();
        }
    }

    /**
     * show empty state
     */
    showEmptyState() {
        this.messagesContainer.innerHTML = `
        <div class="empty-state">
            <p> No messages yet! Start a conversation now</p>
        </div>
        `;
    }

    /**
     * create a single message element
     * @param {Object} message - message object
     * @returns {HTMLElement} the message element
     */
    createMessageElement(message) {
        const messageDiv = document.createElement("div");
        messageDiv.className = message.isUser ? "message-user" : "message-bot";
        messageDiv.setAttribute("data-message-id", message.id);

        const avatar = this.createAvatar(message.isUser);

        const contentDiv = document.createElement("div");
        contentDiv.className = "message-content";

        const textP = document.createElement('p');
        textP.className = "message-text";
        textP.textContent = message.text;

        const timestamp = this.createTimestamp(message.timestamp);

        if (message.edited) {
            const editedSpan = document.createElement("span");
            editedSpan.className = "edited-indicator";
            editedSpan.textContent = " (edited)";
            textP.appendChild(editedSpan);
        }

        textP.appendChild(timestamp);
        contentDiv.appendChild(textP);

        if (message.isUser) {
            const actions = this.createActionButtons(message.id);
            contentDiv.appendChild(actions);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    }

    /**
     * scroll to bottom
     */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    /**
     * create timestamp
     * @param {number} timestamp - unix timestamp (Date.now())
     * @returns {HTMLElement}
     */
    createTimestamp(timestamp) {
        const time = document.createElement("time")
        time.className = "message-timestamp";
        const now = new Date(timestamp);
        time.textContent = now.toLocaleTimeString("en-US",{
            hour: "numeric",
            minute: "2-digit",
        });
        time.setAttribute("datetime", now.toISOString())
        return time;

    }

    /**
     * create action buttons(edit and delete)
     * @param {string} messageID
     * @returns {HTMLElement}
     */
    createActionButtons(messageID) {
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "message-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "Edit";
        editButton.setAttribute("data-message-id", messageID);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-message-id", messageID);

        editButton.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('message-edit', {
                detail: { id: messageID}
            }));
        });

        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this message?')) {
                document.dispatchEvent(new CustomEvent('message-delete', {
                    detail: { id: messageID }
                }));
            }
        });

        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);

        return actionsDiv;
    }

    /**
     * create avatar
     * @param {boolean} isUser
     * @returns {HTMLElement}
     */
    createAvatar(isUser) {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';

        const avatarIcon = document.createElement('span');
        avatarIcon.textContent = isUser ? '😊' : '🤖';

        avatarDiv.appendChild(avatarIcon);
        return avatarDiv;
    }
}

export default chatView;
