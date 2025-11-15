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
      typeAnimatedReply("Blitz AI", reply, "ai");
    }, 500);
  }

  function addMessage(sender, text, role) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    bubble.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function typeAnimatedReply(sender, fullText, role) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${role}`;
    bubble.innerHTML = `<strong>${sender}:</strong> <span class="typing"></span>`;
    chatBox.appendChild(bubble);

    const typingSpan = bubble.querySelector(".typing");
    let i = 0;
    const speed = 20;

    function type() {
      if (i < fullText.length) {
        typingSpan.textContent += fullText.charAt(i);
        i++;
        chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(type, speed);
      }
    }

    type();
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

    return generateSmartReply(input);
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
    const cleaned = text.toLowerCase().trim();
    const isQuestion = cleaned.endsWith("?") || cleaned.startsWith("what") || cleaned.startsWith("how");
    const keywords = ["ai", "chatbot", "project", "design", "bug", "idea", "feature", "layout", "response"];
    const matched = keywords.filter(k => cleaned.includes(k));

    const variants = [
      `You're thinking about ${matched.join(", ")} — want help refining or expanding that idea?`,
      `That’s a great question. Let’s break it down together.`,
      `I see where you're going — what part do you want to explore more deeply?`,
      `Interesting thought. Let's unpack it — what direction are you leaning toward?`,
      `Could you tell me a bit more? I want to give a thoughtful answer.`,
      `You're onto something — let’s build on that idea.`
    ];

    if (matched.length > 0) return variants[0];
    if (isQuestion) return variants[1];
    if (cleaned.length < 10) return variants[4];

    return variants[Math.floor(Math.random() * variants.length)];
  }
});
