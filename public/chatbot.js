// Select DOM elements
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");

// Function to copy text to clipboard and show "Copied" feedback
function copyTextToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Temporarily change the icon and show "Copied" text
        const originalContent = button.textContent;
        button.textContent = "✔️";
        button.style.color = "green"; // Optional: change color for visual feedback

        // Revert back to original icon after 1 second
        setTimeout(() => {
            button.textContent = originalContent;
            button.style.color = ""; // Reset color
        }, 1000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

// Function to add messages to the chat
function addMessageToChat(content, isUser = false) {
    const messageContainer = document.createElement("div");
    messageContainer.style.position = "relative"; // Allows positioning of the copy button
    messageContainer.style.marginBottom = "8px";
    messageContainer.style.maxWidth = "80%";
    messageContainer.style.alignSelf = isUser ? "flex-end" : "flex-start";

    const messageElement = document.createElement("div");
    messageElement.style.padding = "5px";
    messageElement.style.borderRadius = "5px";
    messageElement.style.backgroundColor = isUser ? "#007bff" : "#f1f1f1";
    messageElement.style.color = isUser ? "white" : "black";
    messageElement.textContent = isUser ? "You: " + content : "Bot: " + content;

    // Add copy button in the top right corner for bot messages
    if (!isUser) {
        const copyButton = document.createElement("button");
        copyButton.style.position = "absolute";
        copyButton.style.top = "5px";
        copyButton.style.right = "5px";
        copyButton.style.background = "none";
        copyButton.style.border = "none";
        copyButton.style.cursor = "pointer";
        copyButton.style.fontSize = "14px";
        // Update the button's emoji to match a clipboard or note-related icon
        copyButton.textContent = "📝";  // You can replace 📝 with 📄, 🗒️, etc.


        // Event listener to copy bot message and provide feedback
        copyButton.addEventListener("click", () => copyTextToClipboard(content, copyButton));

        // Append copy button to message container
        messageContainer.appendChild(copyButton);
    }

    // Append message text to message container
    messageContainer.appendChild(messageElement);
    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
}

// Function to send the user message to the backend
async function sendMessage() {
    const content = chatInput.value.trim();
    if (!content) return;

    // Display user message in the chat
    addMessageToChat(content, true);
    chatInput.value = ""; // Clear input

    // API call to /api/chat
    try {
        const response = await fetch("http://localhost:8080/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });
        const data = await response.json();

        // Display bot response in the chat
        addMessageToChat(data.message || "Sorry, no response from server.");
    } catch (error) {
        console.error("Error:", error);
        addMessageToChat("Error: Unable to get a response from the server.");
    }
}

// Event listener for "Enter" key
chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
