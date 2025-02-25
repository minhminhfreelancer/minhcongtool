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

  // Search and content data
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [keyword, setKeyword] = useState("");
  const [researchContent, setResearchContent] = useState("");

  // Analysis data
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [styleAnalysis, setStyleAnalysis] = useState("");

  // Content structure data
  const [contentOutline, setContentOutline] = useState("");
  const [detectedContentType, setDetectedContentType] = useState({
    key: "pillar",
    name: "Pillar Content",
  });
  const [partNumber, setPartNumber] = useState(0);

  // Content writing data
  const [styleGuide, setStyleGuide] = useState("");
  const [finalOutline, setFinalOutline] = useState("");
  const [finalContent, setFinalContent] = useState("");

  // SEO and schema data
  const [metaContent, setMetaContent] = useState("");
  const [schemaContent, setSchemaContent] = useState("");

  // Store configurations
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);

  // Step 1: Configuration
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

  // Step 2: Search
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

  // Step 3: Content Review
  const handleStep3Complete = (
    analysis: string,
    kw: string,
    research: string,
  ) => {
    try {
      setAnalysisPrompt(analysis);
      setKeyword(kw);
      setResearchContent(research);
      setCurrentStep(4);
    } catch (error) {
      console.error("Content review error:", error);
      toast({
        title: "Content Analysis Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 4: Style Analysis
  const handleStep4Complete = (analysis: string) => {
    try {
      setStyleAnalysis(analysis);
      setCurrentStep(5);
    } catch (error) {
      console.error("Style analysis error:", error);
      toast({
        title: "Style Analysis Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 5: Content Structure
  const handleStep5Complete = (outline: string, parts: number) => {
    try {
      setContentOutline(outline);
      setPartNumber(parts);
      setCurrentStep(6);
    } catch (error) {
      console.error("Structure error:", error);
      toast({
        title: "Content Structure Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 6: Content Review
  const handleStep6Complete = (style: string, outline: string) => {
    try {
      setStyleGuide(style);
      setFinalOutline(outline);
      setCurrentStep(7);
    } catch (error) {
      console.error("Review error:", error);
      toast({
        title: "Content Review Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 7: Content Writing
  const handleStep7Complete = (content: string) => {
    try {
      setFinalContent(content);
      setCurrentStep(8);
    } catch (error) {
      console.error("Writing error:", error);
      toast({
        title: "Content Writing Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 8: SEO
  const handleStep8Complete = (meta: string) => {
    try {
      setMetaContent(meta);
      setCurrentStep(9);
    } catch (error) {
      console.error("SEO error:", error);
      toast({
        title: "SEO Optimization Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 9: Schema
  const handleStep9Complete = (schema: string) => {
    try {
      setSchemaContent(schema);
      setCurrentStep(10);
    } catch (error) {
      console.error("Schema error:", error);
      toast({
        title: "Schema Generation Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Step 10: Final Output
  const handleFinish = () => {
    // Reset all state to start fresh
    setCurrentStep(1);
    setSearchResults([]);
    setKeyword("");
    setResearchContent("");
    setAnalysisPrompt("");
    setStyleAnalysis("");
    setContentOutline("");
    setPartNumber(0);
    setStyleGuide("");
    setFinalOutline("");
    setFinalContent("");
    setMetaContent("");
    setSchemaContent("");

    toast({
      title: "Content Generation Complete",
      description: "Your content has been successfully generated and exported.",
    });
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
          onNext={handleStep3Complete}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && modelConfig && (
        <Step4Analysis
          modelConfig={modelConfig}
          keyword={keyword}
          researchContent={researchContent}
          onNext={handleStep4Complete}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && modelConfig && (
        <Step5Structure
          modelConfig={modelConfig}
          keyword={keyword}
          researchContent={researchContent}
          styleAnalysis={styleAnalysis}
          contentTypeKey={detectedContentType.key}
          contentTypeName={detectedContentType.name}
          onNext={handleStep5Complete}
          onBack={() => setCurrentStep(4)}
        />
      )}

      {currentStep === 6 && modelConfig && (
        <Step6Review
          modelConfig={modelConfig}
          keyword={keyword}
          researchContent={researchContent}
          styleAnalysis={styleAnalysis}
          contentOutline={contentOutline}
          contentTypeName={detectedContentType.name}
          onNext={handleStep6Complete}
          onBack={() => setCurrentStep(5)}
        />
      )}

      {currentStep === 7 && modelConfig && (
        <Step7Writing
          modelConfig={modelConfig}
          keyword={keyword}
          contentTypeName={detectedContentType.name}
          styleGuide={styleGuide}
          contentOutline={finalOutline}
          partNumber={partNumber}
          onNext={handleStep7Complete}
          onBack={() => setCurrentStep(6)}
        />
      )}

      {currentStep === 8 && modelConfig && (
        <Step8SEO
          modelConfig={modelConfig}
          keyword={keyword}
          contentTypeName={detectedContentType.name}
          contentOutline={finalOutline}
          finalContent={finalContent}
          onNext={handleStep8Complete}
          onBack={() => setCurrentStep(7)}
        />
      )}

      {currentStep === 9 && modelConfig && (
        <Step9Schema
          modelConfig={modelConfig}
          keyword={keyword}
          contentTypeName={detectedContentType.name}
          finalContent={finalContent}
          metaContent={metaContent}
          onNext={handleStep9Complete}
          onBack={() => setCurrentStep(8)}
        />
      )}

      {currentStep === 10 && modelConfig && (
        <Step10FinalOutput
          modelConfig={modelConfig}
          keyword={keyword}
          contentTypeName={detectedContentType.name}
          finalContent={finalContent}
          metaContent={metaContent}
          schemaContent={schemaContent}
          styleGuide={styleGuide}
          contentOutline={finalOutline}
          onBack={() => setCurrentStep(9)}
          onFinish={handleFinish}
        />
      )}
    </div>
  );
};

export default ContentWizard;
