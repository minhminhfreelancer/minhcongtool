const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json({ limit: '70mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let apiKeys = [];

function loadApiKeys() {
    try {
        const keys = fs.readFileSync(path.join(__dirname, 'api-keys.txt'), 'utf-8').split('\n');
        apiKeys = keys.map(key => key.trim()).filter(key => key);
    } catch (error) {
        console.error('Error reading API keys file:', error);
    }
}
loadApiKeys();

function getRandomApiKey() {
    if (apiKeys.length === 0) return null;
    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
}

// WordPress-specific optimization
function optimizeForWordPress(html) {
    let optimized = html;

    // Remove quick menu navigation section
    optimized = optimized.replace(/<div class="menuquick">[\s\S]*?<\/div>\s*<\/div>/g, '');

    // Convert h1 to paragraph since WordPress post title will be h1
    optimized = optimized.replace(/<h1[^>]*>(.*?)<\/h1>/g, '<p class="has-text-align-left" style="font-size:1.5em;font-weight:bold;">$1</p>');

    // Handle step numbering - move label number into h3
    optimized = optimized.replace(
        /<label>(\d+)<\/label>\s*<div class="text-method">\s*<h3[^>]*>(.*?)<\/h3>/g,
        '<div class="text-method"><h3 class="wp-block-heading">$1. $2</h3>'
    );

    // Simplify recipe info structure (convert h2 to strong in ready list)
    optimized = optimized.replace(
        /(<ul class="ready"[\s\S]*?<\/ul>)/g,
        function(match) {
            return match.replace(/<h2[^>]*>(.*?)<\/h2>/g, '<strong>$1:</strong> ');
        }
    );

    // Clean up HTML for WordPress
    optimized = optimized
        // Remove empty paragraphs and lines
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/^\s*[\r\n]/gm, '')
        
        // Optimize images for WordPress with classic editor center alignment
        .replace(/<img([^>]*)>/g, (match, attributes) => {
            // Add WordPress-specific classes for classic editor
            if (!attributes.includes('class="')) {
                attributes += ' class="aligncenter"';
            } else if (!attributes.includes('aligncenter')) {
                attributes = attributes.replace(/class="([^"]*)"/, 'class="$1 aligncenter"');
            }
            
            // Add size attributes if missing
            if (!attributes.includes('size-')) {
                attributes += ' size-full';
            }
            
            // Ensure alt text exists
            if (!attributes.includes('alt="')) {
                attributes += ' alt="WordPress optimized image"';
            }
            
            // Wrap in paragraph for classic editor center alignment
            return `<p style="text-align: center;"><img${attributes}></p>`;
        })

        // Convert divs to WordPress-friendly elements
        .replace(/<div class="box-detail">/g, '<div class="wp-block-group">')
        .replace(/<div class="method">/g, '<div class="wp-block-group recipe-method">')
        .replace(/<div class="staple">/g, '<div class="wp-block-group recipe-ingredients">')
        
        // Optimize remaining headings for WordPress
        .replace(/<h2>/g, '<h2 class="wp-block-heading">')
        .replace(/<h3>/g, '<h3 class="wp-block-heading">')
        
        // Add WordPress paragraph styling
        .replace(/<p>/g, '<p class="has-text-align-left">')
        
        // Optimize lists for WordPress
        .replace(/<ul>/g, '<ul class="wp-block-list">')
        
        // Add schema markup for recipes
        .replace(/<div class="box-recipe">/g, '<div class="wp-block-group recipe" itemscope itemtype="http://schema.org/Recipe">')

        // Format recipe info list items
        .replace(/<li>\s*<strong>(.*?):<\/strong>\s*(.*?)<\/li>/g, '<li><strong>$1:</strong> $2</li>')
        
        // Remove empty labels after moving numbers to h3
        .replace(/<label>\s*<\/label>/g, '')
        
        // Clean up any remaining formatting
        .replace(/\s+>/g, '>')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();

    return optimized;
}

function cleanHtml(html) {
    return html
        .replace(/(\n\s*\n\s*\n)+/g, '\n\n')
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '>\n<')
        .split('\n').map(line => line.trim()).filter(line => line).join('\n');
}

function extractTextAndImages(html) {
    let imageCounter = 0;
    const images = [];
    const specialTags = [];
    let tagCounter = 0;

    html = cleanHtml(html);

    let processedHtml = html.replace(/<img[^>]*>/g, (match) => {
        images.push(match);
        return `[IMG${imageCounter++}]`;
    });

    processedHtml = processedHtml.replace(/(<\/?(?:b|i|strong|em|small)[^>]*>)/g, (match) => {
        specialTags.push(match);
        return `[TAG${tagCounter++}]`;
    });

    return { textContent: processedHtml, images, specialTags };
}

function restoreContent(translatedText, images, specialTags) {
    let restoredContent = translatedText;

    images.forEach((img, index) => {
        restoredContent = restoredContent.replace(`[IMG${index}]`, img);
    });

    specialTags.forEach((tag, index) => {
        restoredContent = restoredContent.replace(`[TAG${index}]`, tag);
    });

    return cleanHtml(restoredContent);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/', async (req, res) => {
    const { model, sourceLang, targetLang, html } = req.body;
    const apiKey = getRandomApiKey();

    if (!apiKey) {
        return res.status(500).json({ success: false, error: "No API keys available. Please add keys to api-keys.txt." });
    }

    try {
        const { textContent, images, specialTags } = extractTextAndImages(html);

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            { text: `Translate this content from ${sourceLang} to ${targetLang}, preserve all [IMG] and [TAG] markers exactly as they appear, maintain HTML structure, and keep proper spacing: ${textContent}. Use Vietnamese writing style when translating. Make it user-friendly for a Vietnamese audience.` }
                        ]
                    }
                ]
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
            const translatedText = response.data.candidates[0].content.parts[0].text;
            let translatedHTML = restoreContent(translatedText, images, specialTags);
            
            // Optimize for WordPress after translation
            translatedHTML = optimizeForWordPress(translatedHTML);
            
            res.json({ success: true, translatedHTML });
        } else {
            res.json({ success: false, error: "Unexpected response format" });
        }
    } catch (error) {
        console.error("Error during translation:", error);
        res.json({ success: false, error: error.response?.data?.error?.message || "Translation failed" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
