const STORAGE_KEY = "gemini-api-keys";

export interface StoredApiKey {
  key: string;
  isActive?: boolean;
}

export const loadApiKeys = (): StoredApiKey[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load API keys:", error);
    return [];
  }
};

export const saveApiKeys = (keys: StoredApiKey[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error("Failed to save API keys:", error);
  }
};
