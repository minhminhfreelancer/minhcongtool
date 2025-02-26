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
import { useState, useEffect } from "react";
import { SearchCredentials, loadSearchCredentials, saveSearchCredentials } from "@/lib/searchConfig";
import { toast } from "@/components/ui/use-toast";

export interface ConfigManagerProps {
  onConfigChange: (config: SearchCredentials) => void;
}

const ConfigManager = ({ onConfigChange }: ConfigManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [searchEngineId, setSearchEngineId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const config = await loadSearchCredentials();
        if (config) {
          setApiKey(config.apiKey);
          setSearchEngineId(config.searchEngineId);
          onConfigChange(config);
        }
      } catch (error) {
        console.error("Error loading search config:", error);
        toast({
          title: "Error",
          description: "Failed to load search configuration from server",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = () => {
    if (!apiKey || !searchEngineId) return;

    const config = { apiKey, searchEngineId };
    saveSearchCredentials(config);
    onConfigChange(config);
    setIsOpen(false);
  };

  const refreshConfig = async () => {
    setIsLoading(true);
    try {
      const config = await loadSearchCredentials();
      if (config) {
        setApiKey(config.apiKey);
        setSearchEngineId(config.searchEngineId);
        onConfigChange(config);
        toast({
          title: "Success",
          description: "Search configuration loaded from server",
        });
      } else {
        toast({
          title: "No Configuration",
          description: "No search configuration found on the server",
        });
      }
    } catch (error) {
      console.error("Error refreshing search config:", error);
      toast({
        title: "Error",
        description: "Failed to refresh search configuration from server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <span className="text-xs">🔍</span>
            Configure Search
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
            <div className="space-y-2 border-t pt-2">
              <p className="text-xs text-muted-foreground">
                Search configuration is loaded from the server. You can add additional credentials below for testing.
              </p>
            </div>
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
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshConfig}
        disabled={isLoading}
      >
        <span className={`text-xs ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
      </Button>
    </div>
  );
};

export default ConfigManager;
