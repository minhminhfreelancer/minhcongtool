interface ModelPricing {
  input: number;
  output: number;
  input128k?: number;
  output128k?: number;
}

export interface ModelInfo {
  name: string;
  tokenLimit: number;
  requestsPerMin: number;
  requestsPerDay: number;
  features: string[];
  pricing?: ModelPricing;
}

// Helper function to deduplicate models
function deduplicateModels(models: ModelInfo[]): ModelInfo[] {
  const seen = new Set<string>();
  return models.filter((model) => {
    if (seen.has(model.name)) {
      return false;
    }
    seen.add(model.name);
    return true;
  });
}

export const AVAILABLE_MODELS: ModelInfo[] = deduplicateModels([
  // Gemini 2.0 Models
  {
    name: "gemini-2.0-flash",
    tokenLimit: 128000,
    requestsPerMin: 2000,
    requestsPerDay: 1500,
    features: [
      "Multimodal understanding",
      "Realtime streaming",
      "Native tool use",
    ],
    pricing: {
      input: 0.1,
      output: 0.4,
    },
  },
  {
    name: "gemini-2.0-flash-lite-preview-02-05",
    tokenLimit: 128000,
    requestsPerMin: 4000,
    requestsPerDay: 1500,
    features: ["Long Context", "Realtime streaming", "Native tool use"],
    pricing: {
      input: 0.075,
      output: 0.3,
    },
  },
  {
    name: "gemini-2.0-pro-exp-02-05",
    tokenLimit: 128000,
    requestsPerMin: 5,
    requestsPerDay: 50,
    features: [
      "Multimodal understanding",
      "Realtime streaming",
      "Native tool use",
    ],
    pricing: {
      input: 0,
      output: 0,
    },
  },
  {
    name: "gemini-2.0-flash-thinking-exp-01-21",
    tokenLimit: 128000,
    requestsPerMin: 10,
    requestsPerDay: 1500,
    features: ["Multimodal understanding", "Reasoning", "Coding"],
    pricing: {
      input: 0,
      output: 0,
    },
  },
  // Gemini 1.5 Models
  {
    name: "gemini-1.5-pro",
    tokenLimit: 128000,
    requestsPerMin: 1000,
    requestsPerDay: 50,
    features: ["Long Context", "Complex Reasoning", "Math Reasoning"],
    pricing: {
      input: 1.25,
      output: 5.0,
      input128k: 2.5,
      output128k: 10.0,
    },
  },
  {
    name: "gemini-1.5-flash",
    tokenLimit: 128000,
    requestsPerMin: 2000,
    requestsPerDay: 1500,
    features: [
      "Image understanding",
      "Video understanding",
      "Audio understanding",
    ],
    pricing: {
      input: 0.075,
      output: 0.3,
      input128k: 0.15,
      output128k: 0.6,
    },
  },
  {
    name: "gemini-1.5-flash-8b",
    tokenLimit: 128000,
    requestsPerMin: 4000,
    requestsPerDay: 1500,
    features: ["Low latency", "Multilingual", "Summarization"],
    pricing: {
      input: 0.0375,
      output: 0.15,
      input128k: 0.075,
      output128k: 0.3,
    },
  },
  {
    name: "med-gemini",
    tokenLimit: Infinity,
    requestsPerMin: 60,
    requestsPerDay: 50,
    features: ["Medical domain", "Healthcare assistance"],
  },
]);
