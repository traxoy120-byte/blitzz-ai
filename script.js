document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const inputField = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  sendBtn.addEventListener("click", sendMessage);

  async function sendMessage() {
    const userText = inputField.value.trim();
    if (!userText) return;

    addMessage("You", userText, "user");
    inputField.value = "";

    let reply = "";

    try {
      reply = await getOpenAIResponse(userText);
    } catch (err) {
      reply = "Sorry, I couldn’t reach my brain right now.";
    }

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
    const speed = 12;

    function type() {
      if (i < fullText.length) {
        typingSpan.textContent += fullText.charAt(i);
        i++;
        chatBox.scrollTop = chatBox.scrollHeight;
        requestAnimationFrame(type);
      }
    }

    requestAnimationFrame(type);
  }

  async function getOpenAIResponse(prompt) {
    const apiKey = "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"; // Replace with your actual OpenAI key

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("OpenAI returned no choices");
    }

    return data.choices[0].message.content;
  }
});
