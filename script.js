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

    // Memory: store name
    if (cleaned.startsWith("my name is ")) {
      const name = cleaned.replace("my name is ", "").trim();
      localStorage.setItem("blitzUserName", name);
      return `Nice to meet you, ${name}! I’ll remember that.`;
    }

    // Casual replies
    if (cleaned.includes("hello") || cleaned.includes("hi")) return "Hey there!";
    if (cleaned.includes("how are you")) return "Feeling electric ⚡ How about you?";
    if (cleaned.includes("thank")) return "You're welcome!";
    if (cleaned.includes("bye")) return "Catch you later!";

    // Paragraph or document request
    if (
      cleaned.includes("write a paragraph") ||
      cleaned.includes("make a document") ||
      cleaned.includes("give me a summary") ||
      cleaned.includes("generate a report") ||
      cleaned.includes("create a text about")
    ) {
      return generateParagraph(input);
    }

    // Math detection
    const mathMatch = cleaned.match(/(?:what(?:'s| is)|calculate|solve)\s+(.+)/);
    const rawExpr = mathMatch ? mathMatch[1] : input;

    try {
      const expr = rawExpr.replace(/x/g, "*").replace(/÷/g, "/");
      const result = math.evaluate(expr);
      return `The answer is ${result}.`;
    } catch {}

    // Smart fallback: analyze and respond
    if (!searchToggle.checked) {
      return generateSmartReply(cleaned);
    }

    return `I’ll look that up for you and get back with something useful.`;
  }

  function generateParagraph(input) {
    const topicMatch = input.match(/(?:about|on|of|regarding)\s(.+)/i);
    const topic = topicMatch ? topicMatch[1] : "your topic";

    return `Sure! Here's a paragraph about ${topic}:\n\n${generateText(topic)}`;
  }

  function generateText(topic) {
    return `The topic of ${topic} is both fascinating and complex. It involves multiple layers of understanding, ranging from basic principles to advanced applications. Whether you're exploring it for academic purposes or personal interest, ${topic} offers a rich field of ideas, challenges, and opportunities. Its relevance continues to grow in today's world, making it a subject worth studying and discussing.`;
  }

  function generateSmartReply(text) {
    const keywords = ["ai", "chatbot", "project", "design", "help", "idea", "problem", "bug"];
    const matched = keywords.filter(k => text.includes(k));

    if (matched.length > 0) {
      return `You're working on something involving ${matched.join(", ")} — tell me more so I can help.`;
    }

    if (text.includes("you") && text.includes("smart")) {
      return "I'm getting smarter every day — what would you like me to improve?";
    }

    if (text.length < 10) {
      return "Could you tell me a bit more? I want to give a thoughtful answer.";
    }

    return `Interesting thought. Let's unpack that together — what specifically are you curious about?`;
  }
});
