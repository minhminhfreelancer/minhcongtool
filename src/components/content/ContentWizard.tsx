import { useState, useEffect } from "react";
import Search from "./tools/Search";
import ToolSelection from "./tools/ToolSelection";
import TranslateUSA from "./tools/TranslateUSA";
import TranslateVN from "./tools/TranslateVN";
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

export type ToolType = "search" | "translate-usa" | "translate-vn";

const ContentWizard = () => {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);

  // Default model configuration
  const defaultModelConfig: ModelConfig = {
    model: "gemini-1.5-flash",
    temperature: 0.7,
    topP: 0.7,
    maxTokens: 32000
  };

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

  // Tool Selection
  const handleToolSelect = (tool: ToolType) => {
    setSelectedTool(tool);
  };

  // Search complete handler
  const handleSearchComplete = (results: SearchResult[]) => {
    try {
      setSearchResults(results);
      toast({
        title: "Search Complete",
        description: `Found ${results.length} results.`,
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

  // Translation complete handlers
  const handleTranslationComplete = () => {
    toast({
      title: "Translation Complete",
      description: "Translation has been completed successfully.",
    });
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

  // Back to tool selection
  const handleBack = () => {
    setSelectedTool(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {!selectedTool && (
        <ToolSelection onSelect={handleToolSelect} />
      )}

      {selectedTool === "search" && (
        <Search
          getConfig={getSearchCredentials}
          modelConfig={defaultModelConfig}
          onComplete={handleSearchComplete}
          onBack={handleBack}
        />
      )}

      {selectedTool === "translate-usa" && (
        <TranslateUSA
          modelConfig={defaultModelConfig}
          onComplete={handleTranslationComplete}
          onBack={handleBack}
        />
      )}

      {selectedTool === "translate-vn" && (
        <TranslateVN
          modelConfig={defaultModelConfig}
          onComplete={handleTranslationComplete}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default ContentWizard;
