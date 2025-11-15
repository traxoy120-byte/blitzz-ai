// Get references to DOM elements
const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");

// Handle sending a message
function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  // Show user's message
  addMessage("You", userText, "user");
  inputField.value = "";

  // Show "thinking..." bubble
  const aiBubble = addMessage("Blitz AI", "...", "ai");

  // Simulate AI thinking delay
  setTimeout(() => {
    aiBubble.textContent = ""; // Clear the dots
    typeResponse(aiBubble, getAIResponse(userText), 30);
  }, 800);
}

// Add a message bubble to the chat
function addMessage(sender, text, role) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.innerHTML = `<strong>${sender}:</strong> <span>${text}</span>`;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble.querySelector("span");
}

// Simulate typing animation for AI response
function typeResponse(element, text, speed) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Simulated AI response logic (replace with real API later)
function getAIResponse(userInput) {
  // You can customize this logic or connect to a real AI backend
  const responses = [
    "I'm still learning, but I'm here to help!",
    "That's an interesting question. Let me think...",
    "Hmm... let me see what I can come up with.",
    "Good one! Here's what I think...",
    "Let me process that for a moment..."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Allow Enter key to send message
inputField.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
