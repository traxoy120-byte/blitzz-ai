const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");

inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  addMessage("You", userText, "user");
  inputField.value = "";

  const aiBubble = addMessage("Blitz AI", "", "ai");
  const dots = document.createElement("span");
  dots.className = "thinking-dots";
  aiBubble.appendChild(dots);
  animateDots(dots);

  setTimeout(() => {
    aiBubble.innerHTML = `<strong>Blitz AI:</strong> <span class="typewriter"></span><span class="cursor">|</span>`;
    const typeTarget = aiBubble.querySelector(".typewriter");
    const cursor = aiBubble.querySelector(".cursor");

    getBlitzResponse(userText).then((reply) => {
      typeText(typeTarget, reply, 25, () => cursor.remove());
    });
  }, 1000);
}

function addMessage(sender, text, role) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.innerHTML = `<strong>${sender}:</strong> <span>${text}</span>`;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble.querySelector("span");
}

function typeText(element, text, speed, onComplete) {
  let i = 0;
  function type() {
    if (i < text.length) {
      const span = document.createElement("span");
      span.textContent = text.charAt(i);
      span.style.opacity = 0;
      element.appendChild(span);
      fadeIn(span);
      i++;
      setTimeout(type, speed);
    } else if (onComplete) {
      onComplete();
    }
  }
  type();
}

function fadeIn(el) {
  let opacity = 0;
  const step = 0.05;
  function animate() {
    opacity += step;
    el.style.opacity = opacity;
    if (opacity < 1) requestAnimationFrame(animate);
  }
  animate();
}

function animateDots(el) {
  let count = 0;
  const interval = setInterval(() => {
    el.textContent = ".".repeat((count % 3) + 1);
    count++;
  }, 400);
  setTimeout(() => clearInterval(interval), 1000);
}

// MAIN LOGIC: Decide how to respond
async function getBlitzResponse(input) {
  const lower = input.toLowerCase();

  // 1. Handle casual phrases
  const casualReplies = {
    "hello": ["Hey there!", "Hi! How can I help you today?", "Hello! Ready when you are."],
    "hi": ["Hi! 😊", "Hey! What’s on your mind?", "Hello there!"],
    "hey": ["Hey hey!", "Yo! What’s up?", "Hey! Need anything?"],
    "how are you": ["I’m feeling electric ⚡ How about you?", "Charged up and ready to chat!", "Doing great — thanks for asking!"],
    "thanks": ["You got it!", "Anytime!", "Glad I could help!"],
    "thank you": ["You're welcome!", "No problem at all!", "Happy to help!"],
    "bye": ["Catch you later!", "Goodbye!", "See you soon!"]
  };

  for (const key in casualReplies) {
    if (lower === key || lower.includes(key)) {
      const options = casualReplies[key];
      return options[Math.floor(Math.random() * options.length)];
    }
  }

  // 2. Otherwise, try to search the web
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(input)}&format=json&no_redirect=1&no_html=1`);
    const data = await res.json();

    let sourceText = null;
    if (data.AbstractText) {
      sourceText = data.AbstractText;
    } else if (data.RelatedTopics?.length > 0 && data.RelatedTopics[0].Text) {
      sourceText = data.RelatedTopics[0].Text;
    }

    if (sourceText) {
      return rewriteInOwnWords(sourceText);
    } else {
      return generateFallbackResponse(input);
    }
  } catch (err) {
    return "Hmm... I ran into a snag while searching. Try again in a moment.";
  }
}

function rewriteInOwnWords(text) {
  const intros = [
    "Here's what I found:",
    "From what I gathered:",
    "Based on my search:",
    "This might help explain it:",
    "According to what I read:"
  ];
  const intro = intros[Math.floor(Math.random() * intros.length)];
  return `${intro} ${text}`;
}

function generateFallbackResponse(query) {
  const phrases = [
    `I looked around but didn’t find much on "${query}". Want to try rephrasing it?`,
    `That’s a tricky one. I couldn’t find anything solid about "${query}".`,
    `I searched for "${query}", but nothing clear came up. Still learning!`,
    `Hmm... no strong results for "${query}". Want to ask it a different way?`
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}
