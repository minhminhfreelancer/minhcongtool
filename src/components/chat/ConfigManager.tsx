import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { GoogleSearchConfig, loadConfig, saveConfig } from "@/lib/config";

export interface ConfigManagerProps {
  onConfigChange: (config: GoogleSearchConfig) => void;
}

const ConfigManager = ({ onConfigChange }: ConfigManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [searchEngineId, setSearchEngineId] = useState("");

  useEffect(() => {
    const config = loadConfig();
    if (config) {
      setApiKey(config.apiKey);
      setSearchEngineId(config.searchEngineId);
      onConfigChange(config);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey || !searchEngineId) return;

    const config = { apiKey, searchEngineId };
    saveConfig(config);
    onConfigChange(config);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Configure API
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Search API Configuration</DialogTitle>
          <DialogDescription>
            Enter your Google Search API credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google API Key"
              type="password"
            />
          </div>
          <div className="space-y-2">
            <Label>Search Engine ID</Label>
            <Input
              value={searchEngineId}
              onChange={(e) => setSearchEngineId(e.target.value)}
              placeholder="Enter your Search Engine ID"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={!apiKey || !searchEngineId}
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigManager;
