const STORAGE_KEY = "google-search-config";

export interface GoogleSearchConfig {
  apiKey: string;
  searchEngineId: string;
}

export const loadConfig = (): GoogleSearchConfig | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load config:", error);
    return null;
  }
};

export const saveConfig = (config: GoogleSearchConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save config:", error);
  }
};
