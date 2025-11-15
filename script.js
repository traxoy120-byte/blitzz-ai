const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");

// Send message on Enter key
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

    fetchAIResponse(userText).then((reply) => {
      typeText(typeTarget, reply, 25, () => cursor.remove());
    });
  }, 1000);
}

// Add message bubble
function addMessage(sender, text, role) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.innerHTML = `<strong>${sender}:</strong> <span>${text}</span>`;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return bubble.querySelector("span");
}

// Typewriter effect with fade-in
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

// Fade-in animation
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

// Animate thinking dots
function animateDots(el) {
  let count = 0;
  const interval = setInterval(() => {
    el.textContent = ".".repeat((count % 3) + 1);
    count++;
  }, 400);
  setTimeout(() => clearInterval(interval), 1000);
}

// Fetch real info from the web
async function fetchAIResponse(query) {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`);
    const data = await res.json();
    if (data.AbstractText) {
      return rewriteInOwnWords(data.AbstractText);
    } else if (data.RelatedTopics?.length > 0 && data.RelatedTopics[0].Text) {
      return rewriteInOwnWords(data.RelatedTopics[0].Text);
    } else {
      return "I couldn't find anything specific, but I'm still learning!";
    }
  } catch (err) {
    return "Oops! Something went wrong while searching.";
  }
}

// Rephrase result in Blitz AI's own words
function rewriteInOwnWords(text) {
  const phrases = [
    "Here's what I found:",
    "From what I understand:",
    "Based on what I read:",
    "This might help clarify:",
    "According to what I found:"
  ];
  const intro = phrases[Math.floor(Math.random() * phrases.length)];
  return `${intro} ${text}`;
}
