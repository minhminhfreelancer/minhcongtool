interface ContentSelectors {
  mainContent: string[];
  wrapperElements: string[];
  excludeSelectors: string[];
  semanticTags: string[];
}

// Patterns to identify and remove code-like content
const CODE_PATTERNS = [
  // CSS class definitions
  /\.[a-zA-Z-_]+\s*{[^}]*}/g,
  // CSS-like variable definitions
  /--[a-zA-Z-_]+:\s*[^;]+;/g,
  // Style tags and contents
  /<style[^>]*>[\s\S]*?<\/style>/gi,
  // Script tags and contents
  /<script[^>]*>[\s\S]*?<\/script>/gi,
];

const DEFAULT_SELECTORS: ContentSelectors = {
  mainContent: [
    ".post_content",
    ".mx-3",
    ".xs\\:mx-4",
    "article",
    ".entry-content",
    ".post-content",
    ".article__content",
    ".main-content",
    // Reddit specific
    ".Post",
    ".PostContent",
    // Quora specific
    ".q-box",
    ".qu-contents",
  ],
  wrapperElements: [
    'div[class*="post_content"]',
    'div[class*="mx-3"]',
    'div[class*="xs:mx-4"]',
    'div[class*="content"]',
    'div[class*="article"]',
  ],
  excludeSelectors: [
    ".PostCTAWrapper",
    ".PostSubNavigation",
    ".PostCTAImage",
    ".PostCTAHeading",
    ".PostCTAContent",
    ".PostCTAButton",
    ".comments",
    ".sidebar",
    ".navigation",
    ".footer",
    ".header",
    ".ad",
    ".advertisement",
    '[class*="cta"]',
    '[class*="popup"]',
    '[class*="modal"]',
  ],
  semanticTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "table",
    "picture",
    "img",
  ],
};

function cleanContent(content: string): string {
  // Remove code-like patterns
  let cleaned = content;
  CODE_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, "");
  });

  // Remove excessive whitespace
  cleaned = cleaned
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/gm, "")
    .trim();

  return cleaned;
}

export function extractContent(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove unwanted elements first
  DEFAULT_SELECTORS.excludeSelectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // Try to find main content container
  let mainContent: Element | null = null;

  // 1. Try document structure markers
  const documentContent = doc.querySelector("document_content");
  if (documentContent) {
    mainContent = documentContent;
  }

  // 2. Try main content selectors
  if (!mainContent) {
    for (const selector of DEFAULT_SELECTORS.mainContent) {
      mainContent = doc.querySelector(selector);
      if (mainContent) break;
    }
  }

  // 3. Try wrapper elements
  if (!mainContent) {
    for (const selector of DEFAULT_SELECTORS.wrapperElements) {
      mainContent = doc.querySelector(selector);
      if (mainContent) break;
    }
  }

  // 4. Fallback to article or main tag
  if (!mainContent) {
    mainContent = doc.querySelector("article") || doc.querySelector("main");
  }

  // 5. Last resort: try to find the div with most content
  if (!mainContent) {
    let maxLength = 0;
    doc.querySelectorAll("div").forEach((div) => {
      if (div.textContent && div.textContent.length > maxLength) {
        maxLength = div.textContent.length;
        mainContent = div;
      }
    });
  }

  if (!mainContent) {
    return ""; // No content found
  }

  // Extract semantic content
  let markdown = "";
  const semanticElements = mainContent.querySelectorAll(
    DEFAULT_SELECTORS.semanticTags.join(","),
  );

  semanticElements.forEach((el) => {
    switch (el.tagName.toLowerCase()) {
      case "h1":
        markdown += `# ${el.textContent}\n\n`;
        break;
      case "h2":
        markdown += `## ${el.textContent}\n\n`;
        break;
      case "h3":
        markdown += `### ${el.textContent}\n\n`;
        break;
      case "h4":
        markdown += `#### ${el.textContent}\n\n`;
        break;
      case "h5":
        markdown += `##### ${el.textContent}\n\n`;
        break;
      case "h6":
        markdown += `###### ${el.textContent}\n\n`;
        break;
      case "p":
        const cleanedText = cleanContent(el.textContent || "");
        if (cleanedText) {
          markdown += `${cleanedText}\n\n`;
        }
        break;
      case "ul":
        el.querySelectorAll("li").forEach((li) => {
          markdown += `- ${li.textContent}\n`;
        });
        markdown += "\n";
        break;
      case "ol":
        let i = 1;
        el.querySelectorAll("li").forEach((li) => {
          markdown += `${i}. ${li.textContent}\n`;
          i++;
        });
        markdown += "\n";
        break;
      case "blockquote":
        markdown += `> ${el.textContent}\n\n`;
        break;
      case "pre":
      case "code":
        const codeText = el.textContent || "";
        // Only include code blocks that don't match our CSS/style patterns
        if (!CODE_PATTERNS.some((pattern) => pattern.test(codeText))) {
          markdown += `\`\`\`\n${codeText}\n\`\`\`\n\n`;
        }
        break;
      case "picture":
      case "img":
        const img = el.tagName === "picture" ? el.querySelector("img") : el;
        if (img instanceof HTMLImageElement) {
          const src = img.src;
          const alt = img.alt || "";
          if (src && !src.startsWith("data:")) {
            markdown += `![${alt}](${src})\n\n`;
          }
        }
        break;
    }
  });

  // Clean up markdown
  return markdown
    .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2
    .replace(/[ \t]+\n/g, "\n") // Remove trailing whitespace
    .trim();
}
