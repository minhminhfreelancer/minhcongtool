interface ModelPricing {
  input: number;
  output: number;
  input128k?: number;
  output128k?: number;
}

export interface ModelInfo {
  name: string;
  tokenLimit: number;
  maxOutputTokens?: number;
  requestsPerMin: number;
  requestsPerDay: number;
  features: string[];
  pricing?: ModelPricing;
  releaseStage?: string;
  releaseDate?: string;
  knowledgeCutoff?: string;
  inputTypes?: string[];
  outputTypes?: string[];
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
    name: "gemini-2.0-flash-001",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 2000,
    requestsPerDay: 1500,
    releaseStage: "General Availability",
    releaseDate: "2025-02-05",
    knowledgeCutoff: "June 2024",
    features: [
      "Text and code generation",
      "Multimodal understanding",
      "Structured output (JSON)",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0.1,
      output: 0.4,
    },
  },
  {
    name: "gemini-2.0-flash",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 2000,
    requestsPerDay: 1500,
    releaseStage: "General Availability",
    releaseDate: "2025-02-10",
    knowledgeCutoff: "June 2024",
    features: [
      "Text and code generation",
      "Multimodal understanding",
      "Structured output (JSON)",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0.1,
      output: 0.4,
    },
  },
  {
    name: "gemini-2.0-flash-lite-001",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 4000,
    requestsPerDay: 1500,
    releaseStage: "General Availability",
    releaseDate: "2025-02-25",
    knowledgeCutoff: "June 2024",
    features: [
      "Cost effective",
      "Low latency",
      "High throughput",
      "Multimodal understanding",
      "Function calling"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0.075,
      output: 0.3,
    },
  },
  {
    name: "gemini-2.0-flash-lite",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 4000,
    requestsPerDay: 1500,
    releaseStage: "General Availability",
    releaseDate: "2025-02-25",
    knowledgeCutoff: "June 2024",
    features: [
      "Cost effective",
      "Low latency",
      "High throughput",
      "Multimodal understanding",
      "Function calling"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0.075,
      output: 0.3,
    },
  },
  {
    name: "gemini-2.0-pro-exp-02-05",
    tokenLimit: 2097152, // 2M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 5,
    requestsPerDay: 50,
    releaseStage: "Experimental",
    releaseDate: "2025-02-05",
    knowledgeCutoff: "June 2024",
    features: [
      "Strongest model quality",
      "Code generation",
      "World knowledge",
      "2M long context",
      "Multimodal understanding"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0,
      output: 0,
    },
  },
  {
    name: "gemini-2.0-flash-thinking-exp-01-21",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 10,
    requestsPerDay: 1500,
    releaseStage: "Experimental",
    releaseDate: "2025-01-21",
    knowledgeCutoff: "June 2024",
    features: [
      "Stronger reasoning capabilities",
      "Includes thinking process in responses",
      "Function calling"
    ],
    inputTypes: ["text", "code", "PDFs", "images"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0,
      output: 0,
    },
  },
  // Gemini 1.5 Models
  {
    name: "gemini-1.5-pro-002",
    tokenLimit: 2097152, // 2M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 1000,
    requestsPerDay: 50,
    releaseStage: "General Availability",
    releaseDate: "2024-09-24",
    knowledgeCutoff: "May 2024",
    features: [
      "Complex reasoning tasks",
      "Long 2M context",
      "Multimodal understanding",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 1.25,
      output: 5.0,
      input128k: 2.5,
      output128k: 10.0,
    },
  },
  {
    name: "gemini-1.5-pro-001",
    tokenLimit: 2097152, // 2M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 1000,
    requestsPerDay: 50,
    releaseStage: "General Availability",
    releaseDate: "2024-05-24",
    knowledgeCutoff: "May 2024",
    features: [
      "Complex reasoning tasks",
      "Long 2M context",
      "Multimodal understanding",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 1.25,
      output: 5.0,
      input128k: 2.5,
      output128k: 10.0,
    },
  },
  {
    name: "gemini-1.5-pro",
    tokenLimit: 2097152, // 2M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 1000,
    requestsPerDay: 50,
    releaseStage: "General Availability",
    releaseDate: "2024-09-24",
    knowledgeCutoff: "May 2024",
    features: [
      "Complex reasoning tasks",
      "Long 2M context",
      "Multimodal understanding",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 1.25,
      output: 5.0,
      input128k: 2.5,
      output128k: 10.0,
    },
  },
  {
    name: "gemini-1.5-flash-002",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 2000,
    requestsPerDay: 1500,
    releaseStage: "General Availability",
    releaseDate: "2024-09-24",
    knowledgeCutoff: "May 2024",
    features: [
      "Fast and versatile performance",
      "Diverse task handling",
      "Multimodal understanding",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0.075,
      output: 0.3,
      input128k: 0.15,
      output128k: 0.6,
    },
  },
  {
    name: "gemini-1.5-flash-001",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 2000,
    requestsPerDay: 1500,
    releaseStage: "General Availability",
    releaseDate: "2024-05-24",
    knowledgeCutoff: "May 2024",
    features: [
      "Fast and versatile performance",
      "Diverse task handling",
      "Multimodal understanding",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0.075,
      output: 0.3,
      input128k: 0.15,
      output128k: 0.6,
    },
  },
  {
    name: "gemini-1.5-flash",
    tokenLimit: 1048576, // ~1M tokens
    maxOutputTokens: 8192,
    requestsPerMin: 2000,
    requestsPerDay: 1500,
    releaseStage: "General Availability",
    releaseDate: "2024-09-24",
    knowledgeCutoff: "May 2024",
    features: [
      "Fast and versatile performance",
      "Diverse task handling",
      "Multimodal understanding",
      "Function calling",
      "System instructions"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video", "audio"],
    outputTypes: ["text", "code", "JSON"],
    pricing: {
      input: 0.075,
      output: 0.3,
      input128k: 0.15,
      output128k: 0.6,
    },
  },
  // Legacy Gemini 1.0 Models (still supported but approaching discontinuation)
  {
    name: "gemini-1.0-pro-vision-001",
    tokenLimit: 16384,
    maxOutputTokens: 2048,
    requestsPerMin: 60,
    requestsPerDay: 100,
    releaseStage: "General Availability",
    releaseDate: "2024-02-15",
    knowledgeCutoff: "February 2023",
    features: [
      "Text from text/image/video input",
      "Basic function calling"
    ],
    inputTypes: ["text", "code", "PDFs", "images", "video (frames only)"],
    outputTypes: ["text", "code"],
    pricing: {
      input: 0.5,
      output: 1.5,
    },
  },
  {
    name: "gemini-1.0-pro-002",
    tokenLimit: 32760,
    maxOutputTokens: 8192,
    requestsPerMin: 60,
    requestsPerDay: 50,
    releaseStage: "General Availability",
    releaseDate: "2024-04-09",
    knowledgeCutoff: "February 2023",
    features: [
      "Natural language tasks",
      "Multi-turn chat",
      "Code generation",
      "Basic function calling"
    ],
    inputTypes: ["text", "code"],
    outputTypes: ["text", "code"],
    pricing: {
      input: 0.125,
      output: 0.375,
    },
  }
]);