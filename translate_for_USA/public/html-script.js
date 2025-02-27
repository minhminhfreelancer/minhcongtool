async function translateHTML() {
    const model = document.getElementById("modelSelect").value;
    const htmlInput = document.getElementById("htmlInput").value;
    const sourceLang = document.getElementById("sourceLang").value || "Vietnamese";
    const targetLang = document.getElementById("targetLang").value || "English";
    const output = document.getElementById("output");
    const copyButton = document.getElementById("copyButton");

    const cleanedInput = htmlInput.trim();
    if (!cleanedInput) {
        showError("Please enter HTML content to translate");
        return;
    }

    // Create progress tracking section
    const progressSection = document.createElement('div');
    progressSection.className = 'progress-section';
    progressSection.innerHTML = `
        <h3 style="margin-top:0">Translation Progress</h3>
        <div class="part-progress">
            <div class="part-indicator" id="part1">1</div>
            <div>Analyzing Content Structure</div>
        </div>
        <div class="part-progress">
            <div class="part-indicator" id="part2">2</div>
            <div>Processing HTML Elements</div>
        </div>
        <div class="part-progress">
            <div class="part-indicator" id="part3">3</div>
            <div>Translating Content</div>
        </div>
        <div class="part-progress">
            <div class="part-indicator" id="part4">4</div>
            <div>Optimizing for WordPress</div>
        </div>
        <div class="part-progress">
            <div class="part-indicator" id="part5">5</div>
            <div>Final Formatting</div>
        </div>
    `;

    // Clear previous output and show progress
    output.innerHTML = '';
    output.appendChild(progressSection);
    copyButton.style.display = "none";

    // Update progress function
    function updateProgress(part, detail = '') {
        for (let i = 1; i <= 5; i++) {
            const indicator = document.getElementById(`part${i}`);
            if (i < part) {
                indicator.className = 'part-indicator complete';
                indicator.innerHTML = '✓';
            } else if (i === part) {
                indicator.className = 'part-indicator active';
                // Add detail text if provided
                const detailElement = indicator.parentElement.querySelector('.detail-text');
                if (detail && !detailElement) {
                    const detailDiv = document.createElement('div');
                    detailDiv.className = 'detail-text';
                    detailDiv.style.fontSize = '12px';
                    detailDiv.style.color = '#666';
                    detailDiv.textContent = detail;
                    indicator.parentElement.appendChild(detailDiv);
                }
            } else {
                indicator.className = 'part-indicator';
            }
        }
    }

    try {
        // Step 1: Analyzing content
        updateProgress(1, 'Scanning HTML structure...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 2: Processing
        updateProgress(2, 'Preserving formatting and images...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 3: Translation
        updateProgress(3, `Translating from ${sourceLang} to ${targetLang}...`);
        const response = await fetch('http://localhost:3000/translate-html', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                model, 
                sourceLang, 
                targetLang, 
                html: cleanedInput 
            })
        });

        // Step 4: Optimizing
        updateProgress(4, 'Applying WordPress optimizations...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const data = await response.json();
        if (data.success) {
            // Step 5: Completion
            updateProgress(5, 'Finalizing content...');
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show success message and translated content
            const contentContainer = document.createElement('div');
            contentContainer.innerHTML = `
                <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <strong>✅ Translation Successfully Completed!</strong>
                    <br>
                    <small>The content has been translated and optimized for WordPress.</small>
                </div>
                <div class="translated-content" style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6;">
                    ${data.translatedHTML}
                </div>
            `;
            output.appendChild(contentContainer);

            // Store the HTML for copying
            output.setAttribute('data-wp-html', data.translatedHTML);
            
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
        <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px;">
            <strong>❌ Error</strong>
            <br>
            ${message}
        </div>
    `;
}

function copyToClipboard() {
    const output = document.getElementById("output");
    const wpHtml = output.getAttribute('data-wp-html');
    
    if (wpHtml) {
        navigator.clipboard.writeText(wpHtml).then(() => {
            const copyButton = document.getElementById("copyButton");
            copyButton.textContent = "✓ Copied!";
            copyButton.style.background = "#48bb78";
            
            setTimeout(() => {
                copyButton.textContent = "Copy HTML";
                copyButton.style.background = "";
            }, 2000);
        }).catch(err => {
            console.error("Error copying to clipboard:", err);
            showError("Error copying to clipboard");
        });
    }
}
