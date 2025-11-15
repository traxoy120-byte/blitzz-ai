const chatContainer = document.getElementById("chat-container");
const chatInput = document.getElementById("chat-input");

// === Welcome Suggestions ===
const suggestions = [
  "How can I help you feel more focused today?",
  "Need help solving a tricky problem?",
  "Want to talk through a creative idea?",
  "Looking for a cozy chat?",
  "Need a boost of motivation?",
  "Want to explore something new?"
];

function showSuggestions() {
  const shuffled = suggestions.sort(() => 0.5 - Math.random());
  const topThree = shuffled.slice(0, 3);
  const list = document.getElementById("suggestions");
  list.innerHTML = "";
  topThree.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

showSuggestions();

// === Chat Input Handler ===
chatInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && chatInput.value.trim()) {
    const prompt = chatInput.value.trim();
    appendMessage("You", prompt);
    chatInput.value = "";

    try {
      const res = await fetch("https://your-proxy-url/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      appendMessage("Blitz AI", data.reply);
    } catch (err) {
      appendMessage("Blitz AI", "⚠️ Error reaching the server.");
    }
  }
});

// === Message Display ===
function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msg.style.marginBottom = "12px";
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
