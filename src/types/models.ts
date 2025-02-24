export interface ModelInfo {
  name: string;
  tokenLimit: number;
  requestsPerMin: number;
  requestsPerDay: number;
  features: string[];
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    name: "chat-bard",
    tokenLimit: Infinity,
    requestsPerMin: 18,
    requestsPerDay: 2520000,
    features: ["Chat completion", "Basic conversation"],
  },
  {
    name: "gemini-1.0-pro",
    tokenLimit: 32000,
    requestsPerMin: 15,
    requestsPerDay: 30,
    features: ["Text generation", "Code completion", "Chat"],
  },
  {
    name: "gemini-1.5-pro",
    tokenLimit: 32000,
    requestsPerMin: 2,
    requestsPerDay: 50,
    features: ["Advanced reasoning", "Long context", "Improved accuracy"],
  },
  {
    name: "gemini-1.5-pro-exp",
    tokenLimit: 1000000,
    requestsPerMin: 5,
    requestsPerDay: 100,
    features: ["Experimental features", "Advanced reasoning", "Long context"],
  },
  {
    name: "gemini-2.0-pro-exp",
    tokenLimit: 32000,
    requestsPerMin: 2,
    requestsPerDay: 50,
    features: ["Next-gen reasoning", "Enhanced context", "Best accuracy"],
  },
  {
    name: "gemini-1.5-flash",
    tokenLimit: 1000000,
    requestsPerMin: 15,
    requestsPerDay: 1.5,
    features: ["Fast responses", "High throughput"],
  },
  {
    name: "gemini-1.5-flash-exp",
    tokenLimit: 1000000,
    requestsPerMin: 5,
    requestsPerDay: 1.5,
    features: ["Experimental flash", "Fast responses"],
  },
  {
    name: "gemini-2.0-flash",
    tokenLimit: 1000000,
    requestsPerMin: 15,
    requestsPerDay: 1.5,
    features: ["Next-gen flash", "Maximum throughput"],
  },
  {
    name: "gemini-2.0-flash-lite",
    tokenLimit: 1000000,
    requestsPerMin: 30,
    requestsPerDay: 1.5,
    features: ["Lightweight flash", "Fast responses"],
  },
  {
    name: "gemini-2.0-flash-exp",
    tokenLimit: 4000000,
    requestsPerMin: 10,
    requestsPerDay: Infinity,
    features: ["Experimental next-gen flash", "Enhanced throughput"],
  },
  {
    name: "gemini-2.0-flash-exp-audio",
    tokenLimit: 4000000,
    requestsPerMin: 2,
    requestsPerDay: Infinity,
    features: ["Audio processing", "Fast responses"],
  },
  {
    name: "gemini-2.0-flash-exp-image",
    tokenLimit: 4000000,
    requestsPerMin: 2,
    requestsPerDay: Infinity,
    features: ["Image processing", "Fast responses"],
  },
  {
    name: "med-gemini",
    tokenLimit: Infinity,
    requestsPerMin: 60,
    requestsPerDay: 50,
    features: ["Medical domain", "Healthcare assistance"],
  },
];
