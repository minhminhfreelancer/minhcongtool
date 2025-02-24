import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Key, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { StoredApiKey, loadApiKeys, saveApiKeys } from "@/lib/storage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ApiKeyManagerProps {
  apiKeys: StoredApiKey[];
  onApiKeysChange: (keys: StoredApiKey[]) => void;
}

const ApiKeyManager = ({ apiKeys, onApiKeysChange }: ApiKeyManagerProps) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Load saved keys on mount
  useEffect(() => {
    const savedKeys = loadApiKeys();
    if (savedKeys.length > 0) {
      onApiKeysChange(savedKeys);
    }
  }, []);

  const handleImport = () => {
    const newKeys = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .map((key) => ({ key, isActive: false }));

    if (newKeys.length > 0) {
      if (apiKeys.length === 0) {
        newKeys[0].isActive = true;
      }
      const updatedKeys = [...apiKeys, ...newKeys];
      onApiKeysChange(updatedKeys);
      saveApiKeys(updatedKeys);
      setInput("");
    }
  };

  const removeKey = (index: number) => {
    const newKeys = apiKeys.filter((_, i) => i !== index);
    if (apiKeys[index].isActive && newKeys.length > 0) {
      newKeys[0].isActive = true;
    }
    onApiKeysChange(newKeys);
    saveApiKeys(newKeys);
  };

  const setActiveKey = (index: number) => {
    const newKeys = apiKeys.map((key, i) => ({
      ...key,
      isActive: i === index,
    }));
    onApiKeysChange(newKeys);
    saveApiKeys(newKeys);
  };

  const activeKey = apiKeys.find((key) => key.isActive);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Key className="h-4 w-4" />
          {activeKey ? (
            <span className="font-mono text-xs">
              {activeKey.key.slice(0, 8)}...
            </span>
          ) : (
            "Add API Key"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">API Keys</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your API keys here (one per line)"
              className="min-h-[80px] font-mono text-sm"
            />
            <Button
              onClick={handleImport}
              disabled={!input.trim()}
              className="w-full"
              size="sm"
            >
              Add Keys
            </Button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {apiKeys.map((key, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded border ${key.isActive ? "bg-primary/10 border-primary" : "bg-background"}`}
              >
                <div className="flex-1 font-mono text-xs truncate">
                  {key.key}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={key.isActive ? "default" : "outline"}
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => setActiveKey(index)}
                  >
                    {key.isActive ? <Check className="h-3 w-3" /> : "Use"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeKey(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ApiKeyManager;
