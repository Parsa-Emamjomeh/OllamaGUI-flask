document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.getElementById("sendBtn");
    const promptInput = document.getElementById("promptInput");
    const responseBox = document.getElementById("responseBox");

    sendBtn.addEventListener("click", async () => {
        const prompt = promptInput.value.trim();

        // Check if prompt is empty or invalid
        if (!prompt) {
            responseBox.innerText = "⚠️ Please enter a valid prompt.";
            return;
        }

        responseBox.innerText = "⏳ Thinking...";

        const res = await fetch("/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const text = await res.text();
        responseBox.innerText = text;
    });

    // Optional: Submit with Enter
    promptInput.addEventListener("keydown", e => {
        if (e.key === "Enter") sendBtn.click();
    });
});
