import { SearchResult } from "@/types/search";
import { extractContent } from "./contentExtractor";

export async function searchGoogle(
  query: string,
  countryCode: string,
  apiKey: string,
  cx: string,
  onProgress?: (message: string) => void,
): Promise<SearchResult[]> {
  onProgress?.("Starting search process...");
  onProgress?.(`Searching for "${query}"...`);
  const url = new URL("https://www.googleapis.com/customsearch/v1");
  url.searchParams.append("key", apiKey);
  url.searchParams.append("cx", cx);
  url.searchParams.append("q", query);
  url.searchParams.append("gl", countryCode);
  url.searchParams.append("num", "10");
  // Add cache buster
  url.searchParams.append("_", Date.now().toString());

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Search failed");
    }

    const results = data.items || [];
    const processedResults = [];

    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      onProgress?.(`Processing ${i + 1} of ${results.length}: ${item.link}`);

      try {
        const { content, error } = await fetchPageContent(item.link, (msg) =>
          onProgress?.(`[${i + 1}/${results.length}] ${msg}`),
        );

        if (error) {
          console.warn(`Warning fetching ${item.link}:`, error);
        }

        processedResults.push({
          url: item.link,
          title: item.title,
          snippet: content || item.snippet,
          error: error,
        });
      } catch (error) {
        console.error(`Error fetching ${item.link}:`, error);
        processedResults.push({
          url: item.link,
          title: item.title,
          snippet: item.snippet,
          error:
            error instanceof Error ? error.message : "Failed to fetch content",
        });
      }
    }

    onProgress?.("Search complete! Processing results...");
    return processedResults;
  } catch (error) {
    console.error("Google search failed:", error);
    throw error;
  }
}

export async function fetchPageContent(
  url: string,
  onProgress?: (message: string) => void,
): Promise<{ content: string; error?: string }> {
  onProgress?.(`Starting content fetch from ${url}`);

  try {
    const serverUrl =
      import.meta.env.VITE_SERVER_URL || "http://localhost:3001";
    const response = await fetch(
      `${serverUrl}/fetch-content?url=${encodeURIComponent(url)}`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    onProgress?.("Content extracted successfully");
    return { content: data.content };
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
    return extractContent(html);
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
