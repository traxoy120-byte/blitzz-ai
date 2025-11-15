document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const inputField = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const searchToggle = document.getElementById("search-toggle");

  const userName = localStorage.getItem("blitzUserName");
  if (userName) {
    addMessage("Blitz AI", `Welcome back, ${userName}!`, "ai");
  }

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  sendBtn.addEventListener("click", sendMessage);

  function sendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;

    addMessage("You", userText, "user");
    inputField.value = "";

    const reply = getBlitzResponse(userText);
    setTimeout(() => {
      addMessage("Blitz AI", reply, "ai");
    }, 500);
  }

  function addMessage(sender, text, role) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    bubble.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function getBlitzResponse(input) {
    const cleaned = input.toLowerCase().trim();

    if (cleaned.startsWith("my name is ")) {
      const name = cleaned.replace("my name is ", "").trim();
      localStorage.setItem("blitzUserName", name);
      return `Nice to meet you, ${name}! I’ll remember that.`;
    }

    if (cleaned.includes("hello") || cleaned.includes("hi")) return "Hey there!";
    if (cleaned.includes("how are you")) return "Feeling electric ⚡ How about you?";
    if (cleaned.includes("thank")) return "You're welcome!";
    if (cleaned.includes("bye")) return "Catch you later!";

    if (
      cleaned.includes("write a paragraph") ||
      cleaned.includes("make a document") ||
      cleaned.includes("give me a summary") ||
      cleaned.includes("generate a report") ||
      cleaned.includes("create a text about")
    ) {
      return generateParagraph(input);
    }

    const mathMatch = cleaned.match(/(?:what(?:'s| is)|calculate|solve)\s+(.+)/);
    const rawExpr = mathMatch ? mathMatch[1] : input;

    try {
      const expr = rawExpr.replace(/x/g, "*").replace(/÷/g, "/");
      const result = math.evaluate(expr);
      return `The answer is ${result}.`;
    } catch {}

    if (!searchToggle.checked) {
      const fallback = [
        "That's interesting — tell me more.",
        "Hmm... let's explore that together.",
        "I like where this is going.",
        "Sounds cool — what else are you thinking?"
      ];
      return fallback[Math.floor(Math.random() * fallback.length)];
    }

    return "Let me look that up for you...";
  }

  function generateParagraph(input) {
    const topicMatch = input.match(/(?:about|on|of|regarding)\s(.+)/i);
    const topic = topicMatch ? topicMatch[1]
