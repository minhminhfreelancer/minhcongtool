import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import ApiKeyManager from "@/components/chat/ApiKeyManager";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AVAILABLE_MODELS } from "@/types/models";
import { ModelConfig } from "../ContentWizard";
import { HelpCircle } from "lucide-react";
import {
  loadSearchCredentials,
  saveSearchCredentials,
} from "@/lib/searchConfig";

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
  const [searchApiKey, setSearchApiKey] = useState(() => {
    const saved = loadSearchCredentials();
    return saved?.apiKey || "";
  });
  const [searchEngineId, setSearchEngineId] = useState(() => {
    const saved = loadSearchCredentials();
    return saved?.searchEngineId || "";
  });

  // Group models by family
  const geminiStandardModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && !m.name.includes("flash"),
  );
  const geminiFlashModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && m.name.includes("flash"),
  );
  const medModels = AVAILABLE_MODELS.filter((m) => m.name.startsWith("med"));

  const currentModel = AVAILABLE_MODELS.find((m) => m.name === selectedModel);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Step 1: API Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Set up your API keys and model parameters
        </p>
      </div>

      <div className="space-y-6">
        {/* Gemini API Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Gemini API Configuration</h3>
          <div className="flex items-center gap-4">
            <ApiKeyManager
              apiKeys={apiKeys}
              onApiKeysChange={onApiKeysChange}
            />
          </div>
        </div>

        {/* Google Custom Search Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              Google Custom Search Configuration
            </h3>
            <Button variant="ghost" size="icon" className="h-5 w-5" asChild>
              <a
                href="https://programmablesearchengine.google.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HelpCircle className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Search API Key</Label>
              <Input
                type="password"
                value={searchApiKey}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchApiKey(newValue);
                  saveSearchCredentials({
                    apiKey: newValue,
                    searchEngineId,
                  });
                }}
                placeholder="Enter your Google Custom Search API Key"
              />
            </div>
            <div className="space-y-2">
              <Label>Search Engine ID</Label>
              <Input
                value={searchEngineId}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchEngineId(newValue);
                  saveSearchCredentials({
                    apiKey: searchApiKey,
                    searchEngineId: newValue,
                  });
                }}
                placeholder="Enter your Search Engine ID (cx)"
              />
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="setup-guide">
              <AccordionTrigger className="text-sm">
                Setup Guide
              </AccordionTrigger>
              <AccordionContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">
                    1. Create Custom Search Engine
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>
                      Go to{" "}
                      <a
                        href="https://programmablesearchengine.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Google Programmable Search Engine
                      </a>
                    </li>
                    <li>Click "Create a new search engine"</li>
                    <li>Enter a name and select "Search the entire web"</li>
                    <li>
                      After creation, find your Search Engine ID (cx) in the
                      setup details
                    </li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">2. Get API Key</h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>
                      Visit{" "}
                      <a
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </li>
                    <li>Create a new project or select existing one</li>
                    <li>Enable Custom Search API in API Library</li>
                    <li>Go to Credentials and create an API key</li>
                  </ol>
                </div>

                <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
                  <strong>Note:</strong> Free tier includes 100 searches per
                  day. For higher limits, billing must be enabled.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
        onClick={() => {
          onNext({
            model: selectedModel,
            temperature,
            topP,
            maxTokens,
          });
        }}
        disabled={!searchApiKey || !searchEngineId}
      >
        Next Step
      </Button>
    </div>
  );
};

export default Step1Config;
