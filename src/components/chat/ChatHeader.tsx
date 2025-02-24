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
import ApiKeyManager from "./ApiKeyManager";
import { StoredApiKey } from "@/lib/storage";

export interface ChatHeaderProps {
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  apiKeys?: StoredApiKey[];
  onApiKeysChange?: (keys: StoredApiKey[]) => void;
}

const ChatHeader = ({
  selectedModel = AVAILABLE_MODELS[0].name,
  onModelChange,
  apiKeys = [],
  onApiKeysChange = () => {},
}: ChatHeaderProps) => {
  const currentModel = AVAILABLE_MODELS.find((m) => m.name === selectedModel);

  // Group models by family and type
  const geminiStandardModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && !m.name.includes("flash"),
  );
  const geminiFlashModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && m.name.includes("flash"),
  );
  const palmModels = AVAILABLE_MODELS.filter((m) => m.name.startsWith("palm2"));

  return (
    <div className="flex items-center justify-between gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
      <div className="flex items-center gap-4">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-[280px] bg-white border-slate-200">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            <SelectGroup>
              <SelectLabel className="text-slate-500">
                Gemini Standard Models
              </SelectLabel>
              {geminiStandardModels.map((model) => (
                <SelectItem
                  key={model.name}
                  value={model.name}
                  className="text-slate-900 hover:bg-slate-100"
                >
                  {model.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-slate-500">
                Gemini Flash Models
              </SelectLabel>
              {geminiFlashModels.map((model) => (
                <SelectItem
                  key={model.name}
                  value={model.name}
                  className="text-slate-900 hover:bg-slate-100"
                >
                  {model.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-slate-500">PaLM2 Models</SelectLabel>
              {palmModels.map((model) => (
                <SelectItem
                  key={model.name}
                  value={model.name}
                  className="text-slate-900 hover:bg-slate-100"
                >
                  {model.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <ApiKeyManager apiKeys={apiKeys} onApiKeysChange={onApiKeysChange} />
      </div>

      <div className="text-sm text-slate-500">
        {currentModel && (
          <div className="flex flex-col gap-1">
            <div className="flex gap-4">
              <span>Tokens: {currentModel.tokenLimit.toLocaleString()}</span>
              <span>Requests/min: {currentModel.requestsPerMin}</span>
            </div>
            <div className="text-xs">
              Features: {currentModel.features.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
