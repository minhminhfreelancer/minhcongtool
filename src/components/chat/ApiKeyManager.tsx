import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { StoredApiKey, loadApiKeys, saveApiKeys, setActiveApiKey } from "@/lib/storage";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";

export interface ApiKeyManagerProps {
  apiKeys: StoredApiKey[];
  onApiKeysChange: (keys: StoredApiKey[]) => void;
}

const ApiKeyManager = ({ apiKeys, onApiKeysChange }: ApiKeyManagerProps) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved keys on mount
  useEffect(() => {
    const fetchApiKeys = async () => {
      setIsLoading(true);
      try {
        const savedKeys = await loadApiKeys();
        if (savedKeys.length > 0) {
          onApiKeysChange(savedKeys);
        }
      } catch (error) {
        console.error("Error loading API keys:", error);
        toast({
          title: "Error",
          description: "Failed to load API keys from server",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
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
    const updatedKeys = setActiveApiKey(apiKeys, index);
    onApiKeysChange(updatedKeys);
  };

  const refreshApiKeys = async () => {
    setIsLoading(true);
    try {
      const savedKeys = await loadApiKeys();
      if (savedKeys.length > 0) {
        onApiKeysChange(savedKeys);
        toast({
          title: "Success",
          description: `Loaded ${savedKeys.length} API keys from server`,
        });
      } else {
        toast({
          title: "No API Keys",
          description: "No API keys found on the server",
        });
      }
    } catch (error) {
      console.error("Error refreshing API keys:", error);
      toast({
        title: "Error",
        description: "Failed to refresh API keys from server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activeKey = apiKeys.find((key) => key.isActive);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex gap-2">
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-xs">🔑</span>
            {activeKey ? (
              <span className="font-mono text-xs">
                {activeKey.key.slice(0, 8)}...
              </span>
            ) : (
              "API Keys"
            )}
          </Button>
        </PopoverTrigger>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshApiKeys}
          disabled={isLoading}
        >
          <span className={`text-xs ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
        </Button>
      </div>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">API Keys {apiKeys.length > 0 ? `(${apiKeys.length})` : ''}</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xs">✖️</span>
            </Button>
          </div>
          <div className="space-y-2 border-t pt-2">
            <p className="text-xs text-muted-foreground">
              API keys are loaded from the server. You can add additional keys below for testing.
            </p>
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
                    {key.isActive ? <span className="text-xs">✓</span> : "Use"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeKey(index)}
                  >
                    <span className="text-xs">🗑️</span>
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
