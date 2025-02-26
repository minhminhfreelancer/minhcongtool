// Import Cloudflare Workers types
import { D1Database, ExecutionContext } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
  GEMINI_API_KEYS: string; // Comma-separated list of API keys
  GOOGLE_SEARCH_API_KEY: string;
  GOOGLE_SEARCH_ENGINE_ID: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    // Handle different routes
    switch (url.pathname) {
      case "/api/fetch-content":
        return handleFetchContent(request);
      case "/api/search-history":
        return handleSearchHistory(request, env);
      case "/api/gemini-keys":
        return handleGeminiKeys(env);
      case "/api/search-config":
        return handleSearchConfig(env);
      default:
        return new Response("Not found", { status: 404 });
    }
  },
};

// Return the Gemini API keys
async function handleGeminiKeys(env: Env): Promise<Response> {
  try {
    // Get the API keys from environment variable
    const apiKeysString = env.GEMINI_API_KEYS || "";
    const apiKeys = apiKeysString.split(",").map((key, index) => ({
      key: key.trim(),
      isActive: index === 0, // Make the first key active by default
    }));

    return new Response(JSON.stringify({ apiKeys }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
}

// Return the Google Search configuration
async function handleSearchConfig(env: Env): Promise<Response> {
  try {
    const config = {
      apiKey: env.GOOGLE_SEARCH_API_KEY || "",
      searchEngineId: env.GOOGLE_SEARCH_ENGINE_ID || "",
    };

    return new Response(JSON.stringify({ config }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
}

async function handleFetchContent(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing URL parameter", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();
    const content = extractContent(html);

    return new Response(JSON.stringify({ content }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
}

async function handleSearchHistory(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM searches ORDER BY created_at DESC LIMIT 10",
    ).all();

    return new Response(JSON.stringify({ history: results }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
}

function extractContent(html: string): string {
  // Simple content extraction
  const content = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // Remove scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // Remove styles
    .replace(/<[^>]+>/g, " ") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  return content;
}
