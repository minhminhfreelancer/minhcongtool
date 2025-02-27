const SEARCH_CONFIG_KEY = "google-search-config";

export interface SearchCredentials {
  apiKey: string;
  searchEngineId: string;
}

// Load search credentials from the server
export const loadSearchCredentials = async (): Promise<SearchCredentials | null> => {
  try {
    // Check if we have environment variables available
    if (import.meta.env.VITE_GOOGLE_SEARCH_API_KEY && import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID) {
      return {
        apiKey: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY,
        searchEngineId: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID
      };
    }
    
    // Try to load from the server
    const response = await fetch('/api/search-config');
    
    if (response.ok) {
      const data = await response.json();
      return data.config || null;
    }
    
    // Fallback to localStorage if server request fails
    console.warn("Failed to load search config from server, falling back to localStorage");
    const stored = localStorage.getItem(SEARCH_CONFIG_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load search credentials:", error);
    
    // Last resort fallback
    const stored = localStorage.getItem(SEARCH_CONFIG_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  }
};

// Save search credentials to localStorage (for fallback)
export const saveSearchCredentials = (credentials: SearchCredentials) => {
  try {
    localStorage.setItem(SEARCH_CONFIG_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error("Failed to save search credentials:", error);
  }
};
