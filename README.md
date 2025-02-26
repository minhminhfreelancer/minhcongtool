# Content Assistant

A content research and analysis tool that uses Gemini API for AI processing and Google Custom Search API for searching.

## Deployment Guide for Cloudflare Pages

This guide will help you deploy the Content Assistant to Cloudflare Pages with 30 Gemini API keys and Google Search API configuration.

### Prerequisites

1. A Cloudflare account
2. 30 Gemini API keys
3. Google Custom Search API key and Search Engine ID

### Step 1: Clone and Build the Repository

1. Clone the repository to your local machine
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

### Step 2: Set Up Cloudflare Pages

1. Log in to your Cloudflare dashboard
2. Navigate to "Pages"
3. Click "Create a project"
4. Choose "Connect to Git" and select your repository
5. Configure your build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (or the directory containing your project)

### Step 3: Configure Environment Variables

After creating your project, you need to add environment variables for your API keys:

1. Go to your Pages project settings
2. Navigate to "Environment variables"
3. Add the following environment variables:

#### Gemini API Keys

Add your 30 Gemini API keys as a comma-separated list in the `GEMINI_API_KEYS` environment variable:

```
GEMINI_API_KEYS=key1,key2,key3,...,key30
```

#### Google Search API Configuration

Add your Google Search API key and Search Engine ID:

```
GOOGLE_SEARCH_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

### Step 4: Deploy Your Application

1. Trigger a deployment from the Cloudflare Pages dashboard
2. Wait for the build and deployment to complete
3. Your application will be available at the URL provided by Cloudflare Pages

### Step 5: Verify API Key Integration

1. Open your deployed application
2. Navigate to the configuration page
3. Verify that the Gemini API keys and Google Search configuration are loaded correctly
4. Test the search functionality to ensure everything is working properly

## Local Development

To run the application locally:

1. Create a `.env` file in the root directory with the following variables:
   ```
   GEMINI_API_KEYS=key1,key2,key3,...
   GOOGLE_SEARCH_API_KEY=your_google_api_key
   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Obtaining API Keys

### Gemini API Keys

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for each account you have (up to 30)
3. Copy the API keys and add them to your environment variables

### Google Custom Search API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Custom Search API
4. Create an API key
5. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
6. Create a new search engine
7. Get your Search Engine ID (cx)
8. Add both the API key and Search Engine ID to your environment variables
