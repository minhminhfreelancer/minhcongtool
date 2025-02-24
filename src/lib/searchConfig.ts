const SEARCH_CONFIG_KEY = "google-search-config";

export interface SearchCredentials {
  apiKey: string;
  searchEngineId: string;
}

export const loadSearchCredentials = (): SearchCredentials | null => {
  try {
    const stored = localStorage.getItem(SEARCH_CONFIG_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load search credentials:", error);
    return null;
  }
};

export const saveSearchCredentials = (credentials: SearchCredentials) => {
  try {
    localStorage.setItem(SEARCH_CONFIG_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error("Failed to save search credentials:", error);
  }
};
