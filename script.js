document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const inputField = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  sendBtn.addEventListener("click", sendMessage);

  async function sendMessage(userTextOverride = null) {
    const userText = userTextOverride || inputField.value.trim();
    if (!userText) return;

    addMessage("You", userText, "user");
    inputField.value = "";

    try {
      const reply = await getOpenAIResponse(userText);
      typeAnimatedReply("Blitz AI", reply, "ai");
    } catch (err) {
      console.error("OpenAI error:", err);
      showErrorBubble("Sorry, I couldn't connect to servers. Please try again later.", userText);
    }
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

  function showErrorBubble(message, originalInput) {
    const bubble = document.createElement("div");
    bubble.className = "bubble error";
    bubble.innerHTML = `
      <strong>Blitz AI:</strong> ${message}
      <br><button class="retry-btn">Retry</button>
    `;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;

    const retryBtn = bubble.querySelector(".retry-btn");
    retryBtn.addEventListener("click", () => {
      bubble.remove();
      sendMessage(originalInput);
    });
  }

  async function getOpenAIResponse(prompt) {
    const apiKey = "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"; // 🔐 Replace with your actual OpenAI key

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI response error:", errorText);
      throw new Error("OpenAI API error");
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("OpenAI returned no choices");
    }

    return data.choices[0].message.content;
  }
});

    return data.choices[0].message.content;
  }
});
