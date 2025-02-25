import axios from "axios";

// Define the search result type
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  content?: string;
  error?: string;
}

/**
 * Search Google for the given query
 * @param query The search query
 * @param countryCode The country code to search in
 * @param apiKey Google API key
 * @param searchEngineId Google Custom Search Engine ID
 * @param progressCallback Callback for progress updates
 * @returns Array of search results
 */
export const searchGoogle = async (
  query: string,
  countryCode: string = "us",
  apiKey: string,
  searchEngineId: string,
  progressCallback?: (message: string) => void,
): Promise<SearchResult[]> => {
  try {
    progressCallback?.("Fetching search results...");

    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: query,
          cr: `country${countryCode.toUpperCase()}`,
          num: 10,
        },
      },
    );

    const items = response.data.items || [];
    progressCallback?.(`Found ${items.length} results`);

    // Process each result to fetch content
    const results: SearchResult[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      progressCallback?.(`Processing result ${i + 1} / ${items.length}`);

      const result: SearchResult = {
        title: item.title || "Untitled",
        url: item.link || "",
        snippet: item.snippet || "",
      };

      try {
        // Check if URL is valid before attempting to fetch
        if (isValidUrl(item.link)) {
          // Attempt to fetch page content
          const content = await fetchPageContent(item.link);

          // Store the raw HTML content
          result.content = content;
        } else {
          throw new Error("Invalid URL");
        }
      } catch (error) {
        console.warn(`Warning fetching ${item.link}: ${error}`);
        result.error =
          error instanceof Error ? error.message : "Failed to fetch";
      }

      results.push(result);
    }

    return results;
  } catch (error) {
    console.error("Error searching Google:", error);
    throw new Error(
      `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

/**
 * Helper function to validate URLs
 */
const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Fetch content from a URL
 * @param url The URL to fetch
 * @returns The page content as text
 */
export const fetchPageContent = async (url: string): Promise<string> => {
  try {
    // Use a reliable CORS proxy
    const corsProxyUrl = "https://api.allorigins.win/raw?url=";

    const response = await fetch(`${corsProxyUrl}${encodeURIComponent(url)}`, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching content:`, error);
    throw error;
  }
};

/**
 * Convert HTML to Markdown with proper link preservation
 * @param html HTML content
 * @returns Markdown content
 */
import TurndownService from "turndown";

export const htmlToMarkdown = (html: string): string => {
  if (!html) return "";

  try {
    const turndownService = new TurndownService({
      headingStyle: "atx",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      emDelimiter: "_",
      strongDelimiter: "**",
      linkStyle: "inlined",
    });

    // Remove script and style tags before conversion
    const cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<img[^>]*src="data:image[^>]*>/gi, "[Image]");

    // Convert HTML to Markdown
    let markdown = turndownService.turndown(cleanHtml);

    // Clean up multiple consecutive line breaks
    markdown = markdown.replace(/\n{3,}/g, "\n\n");

    return markdown;
  } catch (error) {
    console.error("Error converting HTML to Markdown:", error);
    // Fallback to basic text extraction if turndown fails
    return html.replace(/<[^>]*>/g, "").trim();
  }
};

/**
 * Download text content as a file
 * @param filename The filename
 * @param text The text content
 */
export const downloadTextFile = (filename: string, text: string): void => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text),
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

// The following are alternative implementations that you can use if the main ones have issues

/**
 * Alternative implementation using a different CORS proxy if needed
 */
export const fetchPageContentAlternative = async (
  url: string,
): Promise<string> => {
  try {
    // Alternative 1: use cors-anywhere (may require requesting temporary access)
    const corsProxy = "https://cors-anywhere.herokuapp.com/";

    const response = await fetch(`${corsProxy}${url}`, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching content:`, error);
    throw error;
  }
};

/**
 * Server-side proxy implementation (requires backend support)
 */
export const fetchPageContentViaBackend = async (
  url: string,
): Promise<string> => {
  try {
    // This assumes you have a backend endpoint at /api/proxy
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching content:`, error);
    throw error;
  }
};
