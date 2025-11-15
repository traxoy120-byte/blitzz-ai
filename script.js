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

    return processInput(input);
  }

  function generateParagraph(input) {
    const topicMatch = input.match(/(?:about|on|of|regarding)\s(.+)/i);
    const topic = topicMatch ? topicMatch[1] : "your topic";

    return `Sure! Here's a paragraph about ${topic}:\n\n${generateText(topic)}`;
  }

  function generateText(topic) {
    return `The topic of ${topic} is both fascinating and complex. It involves multiple layers of understanding, ranging from basic principles to advanced applications. Whether you're exploring it for academic purposes or personal interest, ${topic} offers a rich field of ideas, challenges, and opportunities. Its relevance continues to grow in today's world, making it a subject worth studying and discussing.`;
  }

  function processInput(input) {
    const cleaned = input.toLowerCase().trim();
    const words = cleaned.split(/\s+/);
    const verbs = ["want", "need", "like", "build", "fix", "make", "create", "design"];
    const questions = ["what", "how", "why", "when", "where", "who"];

    const isQuestion = questions.some(q => cleaned.startsWith(q));
    const hasVerb = verbs.some(v => cleaned.includes(v));
    const wordCount = words.length;

    if (isQuestion) {
      return `You're asking a thoughtful question. Let's think it through: ${input}`;
    }

    if (hasVerb && wordCount > 5) {
      return `You're describing something you want to do. Here's how I understand it: "${input}". Let's break it down together.`;
    }

    if (wordCount <= 4) {
      return `Could you tell me a bit more so I can respond clearly?`;
    }

    return `I’ve read your message carefully: "${input}". Let’s explore what you’re aiming for.`;
  }
});
