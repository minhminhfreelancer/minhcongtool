const STORAGE_KEY = "gemini-api-keys";

export interface StoredApiKey {
  key: string;
  isActive?: boolean;
}

// Load API keys from the server
export const loadApiKeys = async (): Promise<StoredApiKey[]> => {
  try {
    // First try to load from the server
    const response = await fetch('/api/gemini-keys');
    
    if (response.ok) {
      const data = await response.json();
      return data.apiKeys || [];
    }
    
    // Fallback to localStorage if server request fails
    console.warn("Failed to load API keys from server, falling back to localStorage");
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load API keys:", error);
    
    // Last resort fallback
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  }
};

// Save API keys to localStorage (for fallback)
export const saveApiKeys = (keys: StoredApiKey[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (error) {
    console.error("Failed to save API keys:", error);
  }
};

// Set the active API key
export const setActiveApiKey = (keys: StoredApiKey[], index: number): StoredApiKey[] => {
  const updatedKeys = keys.map((key, i) => ({
    ...key,
    isActive: i === index,
  }));
  
  saveApiKeys(updatedKeys);
  return updatedKeys;
};
