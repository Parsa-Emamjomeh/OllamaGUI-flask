document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("sendBtn");
    const promptInput = document.getElementById("promptInput");
    const chatHistory = document.getElementById("chatHistory");

    sendBtn.addEventListener("click", async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        addMessage(prompt, "user");

        promptInput.value = "";

        addMessage("⏳ Thinking...", "bot", true);  // Temporary message
        const tempBotMessage = chatHistory.firstChild; // The temporary "Thinking..." div

        try {
            const res = await fetch("/chats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });

            const text = await res.text();

            tempBotMessage.innerText = text;

        } catch (error) {
            tempBotMessage.innerText = "❌ Error occurred.";
        }
    });

    promptInput.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    function addMessage(content, role, temporary = false) {
        const msg = document.createElement("div");
        msg.classList.add("message", role);
        msg.innerText = content;
        if (temporary) msg.classList.add("temp");
        chatHistory.prepend(msg);
    }
});
