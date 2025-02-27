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

  // Group models by family and version
  const gemini2Models = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini-2"),
  );
  const gemini15Models = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini-1.5"),
  );
  const gemini10Models = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini-1.0"),
  );

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
                Gemini 2.0 Models
              </SelectLabel>
              {gemini2Models.map((model) => (
                <SelectItem
                  key={model.name}
                  value={model.name}
                  className="text-slate-900 hover:bg-slate-100"
                >
                  {model.name} {model.releaseStage && `(${model.releaseStage})`}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-slate-500">
                Gemini 1.5 Models
              </SelectLabel>
              {gemini15Models.map((model) => (
                <SelectItem
                  key={model.name}
                  value={model.name}
                  className="text-slate-900 hover:bg-slate-100"
                >
                  {model.name} {model.releaseStage && `(${model.releaseStage})`}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-slate-500">
                Gemini 1.0 Models
              </SelectLabel>
              {gemini10Models.map((model) => (
                <SelectItem
                  key={model.name}
                  value={model.name}
                  className="text-slate-900 hover:bg-slate-100"
                >
                  {model.name} {model.releaseStage && `(${model.releaseStage})`}
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
            <div className="flex gap-4 flex-wrap">
              <span>Context: {currentModel.tokenLimit.toLocaleString()}</span>
              {currentModel.maxOutputTokens && (
                <span>Max Output: {currentModel.maxOutputTokens.toLocaleString()}</span>
              )}
              <span>Requests/min: {currentModel.requestsPerMin}</span>
              {currentModel.releaseStage && (
                <span>Stage: {currentModel.releaseStage}</span>
              )}
            </div>
            {currentModel.knowledgeCutoff && (
              <div className="text-xs">
                Knowledge cutoff: {currentModel.knowledgeCutoff}
              </div>
            )}
            <div className="text-xs">
              Features: {currentModel.features.slice(0, 3).join(", ")}
              {currentModel.features.length > 3 ? "..." : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
