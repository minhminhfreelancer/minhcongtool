import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { AVAILABLE_MODELS } from "@/types/models";
import { ModelConfig } from "../ContentWizard";

export interface Step1ConfigProps {
  onNext: (config: ModelConfig) => void;
}

const Step1Config = ({ onNext }: Step1ConfigProps) => {
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-pro");
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(32000);

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
        <h2 className="text-2xl font-semibold">Step 1: Model Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure the AI model and its parameters
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ApiKeyManager apiKeys={apiKeys} onApiKeysChange={setApiKeys} />
      </div>

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
              <span>Tokens: {currentModel.tokenLimit.toLocaleString()}</span>
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
            <span className="text-sm text-muted-foreground">{temperature}</span>
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
            <span className="text-sm text-muted-foreground">{maxTokens}</span>
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
      >
        Next Step
      </Button>
    </div>
  );
};

export default Step1Config;
