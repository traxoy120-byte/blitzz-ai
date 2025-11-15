const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");

// Load memory
const userName = localStorage.getItem("blitzUserName");
if (userName) {
  addMessage("Blitz AI", `Welcome back, ${userName}!`, "ai");
}

inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

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

  // Math solver
  try {
    if (cleaned.includes("solve(")) {
      const expr = cleaned.match(/solve\(([^)]+)\)/)[1];
      const simplified = math.simplify(expr).toString();
      return `Here's the simplified form: ${simplified}`;
    } else if (/[\d+\-*/^x().]/.test(cleaned)) {
      const result = math.evaluate(cleaned.replace(/x/g, "*"));
      return `The answer is ${result}.`;
    }
  } catch {
    return "Hmm... I couldn't solve that. Try rephrasing.";
  }

  return "I'm here to help — ask me anything!";
}
