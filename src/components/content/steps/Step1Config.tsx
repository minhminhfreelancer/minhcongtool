import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ApiKeyManager from "@/components/chat/ApiKeyManager";
import ConfigManager from "@/components/chat/ConfigManager";
import { StoredApiKey } from "@/lib/storage";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_MODELS } from "@/types/models";
import { ModelConfig } from "../ContentWizard";
import { SearchCredentials } from "@/lib/searchConfig";
import { toast } from "@/components/ui/use-toast";

export interface Step1ConfigProps {
  onNext: (config: ModelConfig) => void;
  apiKeys: StoredApiKey[];
  onApiKeysChange: (keys: StoredApiKey[]) => void;
}

const Step1Config = ({
  onNext,
  apiKeys,
  onApiKeysChange,
}: Step1ConfigProps) => {
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash-8b");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(32000);
  const [searchConfig, setSearchConfig] = useState<SearchCredentials | null>(null);
  const [isConfigValid, setIsConfigValid] = useState(false);

  // Validate configuration whenever dependencies change
  useEffect(() => {
    const hasActiveKey = apiKeys.some(key => key.isActive);
    const hasSearchConfig = searchConfig && searchConfig.apiKey && searchConfig.searchEngineId;
    
    setIsConfigValid(hasActiveKey && !!hasSearchConfig);
  }, [apiKeys, searchConfig]);

  // Group models by family
  const geminiStandardModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && !m.name.includes("flash"),
  );
  const geminiFlashModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && m.name.includes("flash"),
  );
  const medModels = AVAILABLE_MODELS.filter((m) => m.name.startsWith("med"));

  const currentModel = AVAILABLE_MODELS.find((m) => m.name === selectedModel);

  const handleConfigChange = (config: SearchCredentials) => {
    setSearchConfig(config);
  };

  const handleNext = () => {
    if (!isConfigValid) {
      toast({
        title: "Configuration Error",
        description: "Please ensure you have valid API keys and search configuration",
        variant: "destructive",
      });
      return;
    }

    onNext({
      model: selectedModel,
      temperature,
      topP,
      maxTokens,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Step 1: API Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Set up your API keys and model parameters
        </p>
      </div>

      <div className="space-y-6">
        {/* API Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Configuration</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <ApiKeyManager
              apiKeys={apiKeys}
              onApiKeysChange={onApiKeysChange}
            />
            <ConfigManager onConfigChange={handleConfigChange} />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              API keys and search configuration are loaded from the server. 
              The refresh buttons will reload the latest configuration.
            </p>
          </div>
        </div>

        {/* Model Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Model Configuration</h3>

          <div className="space-y-2">
            <Label>Model Selection</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gemini Standard Models</SelectLabel>
                  {geminiStandardModels.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Gemini Flash Models</SelectLabel>
                  {geminiFlashModels.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Medical Models</SelectLabel>
                  {medModels.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {currentModel && (
              <div className="mt-2 text-sm text-slate-500">
                <div className="flex gap-4">
                  <span>
                    Tokens: {currentModel.tokenLimit.toLocaleString()}
                  </span>
                  <span>Requests/min: {currentModel.requestsPerMin}</span>
                </div>
                <div className="text-xs mt-1">
                  Features: {currentModel.features.join(", ")}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Temperature</Label>
                <span className="text-sm text-muted-foreground">
                  {temperature}
                </span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={([value]) => setTemperature(value)}
                min={0}
                max={1}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">
                Controls randomness: Lower values make output more focused
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Top P</Label>
                <span className="text-sm text-muted-foreground">{topP}</span>
              </div>
              <Slider
                value={[topP]}
                onValueChange={([value]) => setTopP(value)}
                min={0}
                max={1}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground">
                Controls diversity: Lower values make output more focused
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Max Output Tokens</Label>
                <span className="text-sm text-muted-foreground">
                  {maxTokens}
                </span>
              </div>
              <Slider
                value={[maxTokens]}
                onValueChange={([value]) => setMaxTokens(value)}
                min={1}
                max={32000}
                step={1000}
              />
              <p className="text-xs text-muted-foreground">
                Maximum length of generated response
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleNext}
        disabled={!isConfigValid}
      >
        Next Step
      </Button>
    </div>
  );
};

export default Step1Config;
