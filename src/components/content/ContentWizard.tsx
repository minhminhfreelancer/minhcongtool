import { useState } from "react";
import Step1Config from "./steps/Step1Config";
import Step2Search from "./steps/Step2Search";
import Step3Review from "./steps/Step3Review";
import Step4Analysis from "./steps/Step4Analysis";
import Step5Structure from "./steps/Step5Structure";
import Step6Review from "./steps/Step6Review";
import Step7Writing from "./steps/Step7Writing";
import Step8SEO from "./steps/Step8SEO";
import Step9Schema from "./steps/Step9Schema";
import Step10FinalOutput from "./steps/Step10FinalOutput";
import { StoredApiKey } from "@/lib/storage";
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

export interface SearchConfig {
  apiKey: string;
  searchEngineId: string;
}

const ContentWizard = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [keyword, setKeyword] = useState("");
  const [researchContent, setResearchContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [researchData, setResearchData] = useState<{
    keyword: string;
    research: string;
    analysis: string;
  } | null>(null);
  const [partNumber, setPartNumber] = useState(0);

  // Store configurations
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);

  const handleStep1Complete = (config: ModelConfig) => {
    try {
      // Validate API key exists
      const activeKey = apiKeys.find((key) => key.isActive);
      const searchCredentials = loadSearchCredentials();

      if (!activeKey) {
        toast({
          title: "Configuration Error",
          description: "Please add and select an API key before proceeding",
          variant: "destructive",
        });
        return;
      }

      if (!searchCredentials) {
        toast({
          title: "Configuration Error",
          description:
            "Please enter Google Search credentials before proceeding",
          variant: "destructive",
        });
        return;
      }

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

  const handleStep2Complete = (results: SearchResult[]) => {
    try {
      setSearchResults(results);
      setCurrentStep(3);
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

  // Get active API key for search
  const getSearchConfig = (): SearchConfig | null => {
    const activeKey = apiKeys.find((key) => key.isActive);
    const searchCredentials = loadSearchCredentials();

    if (!activeKey || !searchCredentials) return null;

    return {
      apiKey: searchCredentials.apiKey,
      searchEngineId: searchCredentials.searchEngineId,
    };
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
          config={getSearchConfig()}
          modelConfig={modelConfig}
          onNext={handleStep2Complete}
          onBack={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 3 && modelConfig && (
        <Step3Review
          results={searchResults}
          modelConfig={modelConfig}
          onNext={(analysis, kw, research) => {
            setAnalysisPrompt(analysis);
            setKeyword(kw);
            setResearchContent(research);
            setResearchData({
              keyword: kw,
              research: research,
              analysis: analysis,
            });
            setCurrentStep(4);
          }}
          onBack={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 4 && modelConfig && (
        <Step4Analysis
          modelConfig={modelConfig}
          onNext={(analysis) => setCurrentStep(5)}
          onBack={() => setCurrentStep(3)}
        />
      )}
      {currentStep === 5 && modelConfig && (
        <Step5Structure
          modelConfig={modelConfig}
          onNext={(analysis, number) => {
            setPartNumber(number);
            setCurrentStep(6);
          }}
          onBack={() => setCurrentStep(4)}
        />
      )}
      {currentStep === 6 && modelConfig && (
        <Step6Review
          modelConfig={modelConfig}
          onNext={() => setCurrentStep(7)}
          onBack={() => setCurrentStep(5)}
        />
      )}
      {currentStep === 7 && modelConfig && (
        <Step7Writing
          modelConfig={modelConfig}
          partNumber={partNumber}
          onNext={() => setCurrentStep(8)}
          onBack={() => setCurrentStep(6)}
        />
      )}
      {currentStep === 8 && modelConfig && (
        <Step8SEO
          modelConfig={modelConfig}
          onNext={() => setCurrentStep(9)}
          onBack={() => setCurrentStep(7)}
        />
      )}
      {currentStep === 9 && modelConfig && (
        <Step9Schema
          modelConfig={modelConfig}
          onNext={() => setCurrentStep(10)}
          onBack={() => setCurrentStep(8)}
        />
      )}
      {currentStep === 10 && modelConfig && (
        <Step10FinalOutput
          modelConfig={modelConfig}
          onNext={() => setCurrentStep(1)}
          onBack={() => setCurrentStep(9)}
          onFinish={() => setCurrentStep(1)}
        />
      )}
    </div>
  );
};

export default ContentWizard;
