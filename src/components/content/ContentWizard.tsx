import { useState, useEffect } from "react";
import Step1Config from "./steps/Step1Config";
import Step2Search from "./steps/Step2Search";
import { StoredApiKey, loadApiKeys } from "@/lib/storage";
import { toast } from "@/components/ui/use-toast";
import { loadSearchCredentials } from "@/lib/searchConfig";
import { SearchResult } from "@/types/search";

// Define interfaces for type safety
export interface ModelConfig {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}

export interface SearchCredentials {
  apiKey: string;
  searchEngineId: string;
}

const ContentWizard = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Search data
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Store configurations
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);

  // Load API keys on mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const keys = await loadApiKeys();
        if (keys.length > 0) {
          setApiKeys(keys);
        }
      } catch (error) {
        console.error("Error loading API keys:", error);
        toast({
          title: "Error",
          description: "Failed to load API keys from server",
          variant: "destructive",
        });
      }
    };

    fetchApiKeys();
  }, []);

  // Step 1: Configuration
  const handleStep1Complete = (config: ModelConfig) => {
    try {
      setModelConfig(config);
      setCurrentStep(2);
    } catch (error) {
      console.error("Configuration error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 2: Search
  const handleStep2Complete = (results: SearchResult[]) => {
    try {
      setSearchResults(results);
      // Reset to step 1 after search is complete
      setCurrentStep(1);
      toast({
        title: "Search Complete",
        description: `Found ${results.length} results. You can now start a new search.`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Get search credentials for the search step
  const getSearchCredentials = async (): Promise<SearchCredentials | null> => {
    try {
      return await loadSearchCredentials();
    } catch (error) {
      console.error("Error loading search credentials:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {currentStep === 1 && (
        <Step1Config
          onNext={handleStep1Complete}
          apiKeys={apiKeys}
          onApiKeysChange={setApiKeys}
        />
      )}

      {currentStep === 2 && modelConfig && (
        <Step2Search
          getConfig={getSearchCredentials}
          modelConfig={modelConfig}
          onNext={handleStep2Complete}
          onBack={() => setCurrentStep(1)}
        />
      )}
    </div>
  );
};

export default ContentWizard;
