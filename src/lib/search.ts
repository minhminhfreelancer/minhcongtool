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
        title: item.title,
        url: item.link,
        snippet: item.snippet || "",
      };

      try {
        // Attempt to fetch page content
        const content = await fetchPageContent(item.link);
        result.content = content;
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
 * Fetch content from a URL
 * @param url The URL to fetch
 * @returns The page content as text
 */
export const fetchPageContent = async (url: string): Promise<string> => {
  try {
    // Option 1: Use a more reliable CORS proxy
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
 * Convert HTML to Markdown
 * @param html HTML content
 * @returns Markdown content
 */
export const htmlToMarkdown = (html: string): string => {
  // Simple HTML to Markdown conversion
  // Replace this with a more comprehensive solution if needed
  let markdown = html;

  // Remove HTML tags (simplified)
  markdown = markdown.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  markdown = markdown
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return markdown;
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

// Alternative implementation using a different CORS proxy if needed
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

// Server-side proxy implementation (requires backend support)
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
