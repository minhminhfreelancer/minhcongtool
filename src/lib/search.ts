import { SearchResult } from "@/types/search";

export async function searchGoogle(
  query: string,
  countryCode: string,
  apiKey: string,
  cx: string,
): Promise<SearchResult[]> {
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.append("key", apiKey);
  url.searchParams.append("cx", cx);
  url.searchParams.append("q", query);
  url.searchParams.append("gl", countryCode); // Country restriction
  url.searchParams.append("num", "10"); // Number of results

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Search failed");
    }

    return (
      data.items?.map((item: any) => ({
        url: item.link,
        title: item.title,
        snippet: item.snippet,
      })) || []
    );
  } catch (error) {
    console.error("Google search failed:", error);
    throw error;
  }
}

export async function fetchPageContent(
  url: string,
): Promise<{ content: string; error?: string }> {
  try {
    // Use a CORS proxy to fetch the content
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      return {
        content: "",
        error: `Failed to fetch: ${response.status} ${response.statusText}`,
      };
    }
    const content = await response.text();
    if (!content.trim()) {
      return { content: "", error: "Empty content received" };
    }
    return { content };
  } catch (error) {
    console.error("Error fetching content:", error);
    return {
      content: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function htmlToMarkdown(html: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove unwanted elements
    doc
      .querySelectorAll("script, style, nav, header, footer, iframe, noscript")
      .forEach((el) => el.remove());

    // Extract main content
    const mainContent =
      doc.querySelector(
        "main, article, .content, #content, .post, .entry-content, .article-content, .post-content",
      ) || doc.body;

    function processNode(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim() || "";
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        let result = "";

        // Handle links
        if (element.tagName === "A") {
          const href = (element as HTMLAnchorElement).href;
          const text = element.textContent?.trim();
          if (text && href && !href.startsWith("javascript:")) {
            return `[${text}](${href})`;
          }
          return text || "";
        }

        // Handle headings
        if (/^H[1-6]$/.test(element.tagName)) {
          const level = element.tagName[1];
          const content = Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("");
          return `${"#".repeat(parseInt(level))} ${content}\n\n`;
        }

        // Handle paragraphs
        if (element.tagName === "P") {
          const content = Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("");
          return content ? `${content}\n\n` : "";
        }

        // Handle lists
        if (element.tagName === "UL" || element.tagName === "OL") {
          return (
            Array.from(element.children)
              .map((li, index) => {
                const content = processNode(li);
                const prefix =
                  element.tagName === "UL" ? "- " : `${index + 1}. `;
                return `${prefix}${content}\n`;
              })
              .join("") + "\n"
          );
        }

        // Handle list items
        if (element.tagName === "LI") {
          return Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join(" ");
        }

        // Handle blockquotes
        if (element.tagName === "BLOCKQUOTE") {
          const content = Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("");
          return content ? `> ${content.replace(/\n/g, "\n> ")}\n\n` : "";
        }

        // Handle images - skip base64 images
        if (element.tagName === "IMG") {
          const src = element.getAttribute("src");
          const alt = element.getAttribute("alt") || "";
          if (src && !src.startsWith("data:")) {
            // Only include images with actual URLs, not base64 data
            return `![${alt}](${src})\n\n`;
          }
          return "";
        }

        // Process other elements recursively
        return Array.from(element.childNodes)
          .map((child) => processNode(child))
          .join(" ");
      }

      return "";
    }

    const markdown = processNode(mainContent);

    // Clean up extra whitespace and line breaks
    return markdown
      .replace(/\n{3,}/g, "\n\n") // Replace 3+ newlines with 2
      .replace(/[ \t]+\n/g, "\n") // Remove trailing whitespace
      .trim();
  } catch (error) {
    console.error("Error converting HTML to Markdown:", error);
    return "";
  }
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
