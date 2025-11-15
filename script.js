function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  const chatBox = document.getElementById("chat-box");
  appendMessage("You", message);
  input.value = "";

  // Simulate AI typing
  const aiMessage = "I'm still learning, but I'm here to help!";
  const aiDiv = document.createElement("div");
  aiDiv.innerHTML = `<strong>Blitz AI:</strong> <span class="typing"></span>`;
  chatBox.appendChild(aiDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  typeText(aiDiv.querySelector(".typing"), aiMessage, 30);
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function typeText(element, text, speed) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}
