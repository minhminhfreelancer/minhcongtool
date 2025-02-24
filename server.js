import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import rateLimit from "express-rate-limit";
import cheerio from "cheerio";

const app = express();
let browser;

// Enable CORS for Tempo platform
app.use(
  cors({
    origin: [
      "https://suspicious-nightingale4-3uu47.dev-2.tempolabs.ai",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Cache-Control", "Pragma"],
  }),
);

// Disable Express caching
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Content fetching endpoint
app.get("/fetch-content", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    console.log(`Fetching content from: ${url}`);
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // Set headers
    await page.setExtraHTTPHeaders({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    });

    // Navigate with timeout and wait options
    await page.goto(url, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    });

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Auto-scroll to load lazy content
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.documentElement.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    // Click show more buttons
    const buttonSelectors = [
      'button[aria-label*="show more"]',
      'button[aria-label*="expand"]',
      'button:contains("Show More")',
      'button:contains("Read More")',
      'a:contains("Show More")',
      'a:contains("Read More")',
      '[class*="show-more"]',
      '[class*="read-more"]',
    ];

    for (const selector of buttonSelectors) {
      try {
        await page.evaluate((sel) => {
          document.querySelectorAll(sel).forEach((button) => button.click());
        }, selector);
        await page.waitForTimeout(500);
      } catch (e) {
        // Ignore errors for individual button clicks
      }
    }

    // Get the full HTML
    const html = await page.content();

    // Parse with cheerio
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $(
      "script, style, noscript, iframe, nav, footer, header, .ads, .comments, .sidebar, .navigation, .menu, .popup, .modal",
    ).remove();

    // Try to find main content
    const contentSelectors = [
      "article",
      "main",
      ".article-content",
      ".post-content",
      ".entry-content",
      ".content",
      "#content",
      ".main-content",
      ".article",
      ".post",
      // Reddit specific
      ".Post",
      ".PostContent",
      ".Post__content",
      // Quora specific
      ".q-box",
      ".qu-contents",
      // Amazon specific
      "#productDescription",
      "#feature-bullets",
      "#aplus",
      "#dpx-content",
      ".a-section",
    ];

    let mainContent = "";
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length) {
        // Get text content with preserved structure
        const content = element.html() || "";
        if (content.length > mainContent.length) {
          mainContent = content;
        }
      }
    }

    // If no content found with selectors, get body content
    if (!mainContent) {
      mainContent = $("body").html() || "";
    }

    // Clean up content
    mainContent = mainContent
      .replace(/<\/?[^>]+(>|$)/g, "\n") // Convert HTML tags to newlines
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\n\s*\n/g, "\n\n") // Remove multiple blank lines
      .trim();

    // Cleanup
    await page.close();
    await context.close();

    console.log(`Successfully fetched content from: ${url}`);
    res.json({ content: mainContent });
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

// Initialize browser when server starts
// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, HOST, async () => {
  console.log(`Proxy server running on port ${PORT}`);
  browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-cache",
      "--disk-cache-size=0",
      "--aggressive-cache-discard",
    ],
  });
});

// Cleanup on server shutdown
process.on("SIGTERM", async () => {
  if (browser) await browser.close();
  process.exit(0);
});
