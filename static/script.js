document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("sendBtn");
    const promptInput = document.getElementById("promptInput");
    const chatHistory = document.getElementById("chatHistory");

    const autoResize = () => {
        promptInput.style.height = "auto"; // reset first
        promptInput.style.height = promptInput.scrollHeight + "px";
    };

    // 🔧 Fix the first extra line issue by running once on load
    autoResize();

    // And also attach it to input events
    promptInput.addEventListener("input", autoResize);

    sendBtn.addEventListener("click", async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        addMessage(prompt, "user");
        promptInput.value = "";
        autoResize(); // Reset height after clearing

        addMessage("⏳ Thinking...", "bot", true);
        const tempBotMessage = chatHistory.firstChild;

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