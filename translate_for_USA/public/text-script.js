async function translateText() {
    const model = document.getElementById("modelSelect").value;
    const textInput = document.getElementById("textInput").value;
    const output = document.getElementById("output");
    const copyButton = document.getElementById("copyButton");

    const cleanedInput = textInput.trim();
    if (!cleanedInput) {
        showError("Please enter a title to translate");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/translate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                model,
                text: cleanedInput 
            })
        });

        const data = await response.json();
        if (data.success) {
            output.innerHTML = `
                <div class="success">
                    <strong>✅ Translation Complete!</strong>
                </div>
                <div style="white-space: pre-wrap;">${data.translatedText}</div>
            `;
            
            // Store the text for copying
            output.setAttribute('data-translated-text', data.translatedText);
            
            // Show copy button
            copyButton.style.display = "inline-block";
        } else {
            showError("Translation Error: " + data.error);
        }
    } catch (error) {
        console.error("Translation error:", error);
        showError("Error: " + error.message);
    }
}

function showError(message) {
    const output = document.getElementById("output");
    output.innerHTML = `
        <div class="error">
            <strong>❌ Error</strong>
            <br>
            ${message}
        </div>
    `;
}

function copyToClipboard() {
    const output = document.getElementById("output");
    const translatedText = output.getAttribute('data-translated-text');
    
    if (translatedText) {
        navigator.clipboard.writeText(translatedText).then(() => {
            const copyButton = document.getElementById("copyButton");
            copyButton.textContent = "✓ Copied!";
            copyButton.style.background = "#48bb78";
            
            setTimeout(() => {
                copyButton.textContent = "Copy Text";
                copyButton.style.background = "";
            }, 2000);
        }).catch(err => {
            console.error("Error copying to clipboard:", err);
            showError("Error copying to clipboard");
        });
    }
}
