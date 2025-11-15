const chatContainer = document.getElementById("chat-container");
const chatInput = document.getElementById("chat-input");

chatInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && chatInput.value.trim()) {
    const prompt = chatInput.value.trim();
    appendMessage("You", prompt);
    chatInput.value = "";

    try {
      const res = await fetch("http://localhost:3000/chat", {
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

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msg.style.marginBottom = "12px";
  chatContainer.appendChild(msg);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
