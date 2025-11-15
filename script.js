document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const inputField = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const searchToggle = document.getElementById("search-toggle");

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  sendBtn.addEventListener("click", sendMessage);

  async function sendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;

    addMessage("You", userText, "user");
    inputField.value = "";

    const reply = await getBlitzResponse(userText);
    typeAnimatedReply("Blitz AI", reply, "ai");
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

  async function getBlitzResponse(input) {
    if (input.toLowerCase().startsWith("my name is ")) {
      const name = input.replace(/my name is /i, "").trim();
      localStorage.setItem("blitzUserName", name);
      return `Nice to meet you, ${name}! I’ll remember that.`;
    }

    if (!searchToggle.checked) {
      return processLocally(input);
    }

    try {
      const reply = await getOpenAIResponse(input);
      return reply;
    } catch {
      return "Sorry, I couldn’t reach my brain right now.";
    }
  }

  async function getOpenAIResponse(prompt) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "sk-...DjwA" // Replace with your actual key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  function processLocally(input) {
    const cleaned = input.toLowerCase().trim();
    if (cleaned.includes("hello")) return "Hey there!";
    if (cleaned.includes("how are you")) return "Feeling electric ⚡ How about you?";
    if (cleaned.includes("thank")) return "You're welcome!";
    if (cleaned.includes("bye")) return "Catch you later!";

    const mathMatch = cleaned.match(/(?:what(?:'s| is)|calculate|solve)\s+(.+)/);
    const rawExpr = mathMatch ? mathMatch[1] : input;

    try {
      const expr = rawExpr.replace(/x/g, "*").replace(/÷/g, "/");
      const result = math.evaluate(expr);
      return `The answer is ${result}.`;
    } catch {}

    return `I’ve read your message: "${input}". Let’s explore what you’re aiming for.`;
  }
});
