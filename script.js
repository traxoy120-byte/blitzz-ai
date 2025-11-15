function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  input.value = "";

  // Simulated AI response
  setTimeout(() => {
    const reply = "Blitz AI says: I'm still learning, but I'm here to help!";
    chatBox.innerHTML += `<div><strong>Blitz AI:</strong> ${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 500);
}
