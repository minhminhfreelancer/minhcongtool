import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ModelConfig } from "../ContentWizard";
import { toast } from "@/components/ui/use-toast";
import { AVAILABLE_MODELS } from "@/types/models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TranslateVNProps {
  modelConfig: ModelConfig;
  onComplete: () => void;
  onBack: () => void;
}

const TranslateVN = ({ modelConfig, onComplete, onBack }: TranslateVNProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [htmlInput, setHtmlInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [selectedModel, setSelectedModel] = useState(modelConfig.model);
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  
  // Get API keys from environment variables
  useEffect(() => {
    // Access environment variables from Cloudflare Pages
    const geminiApiKeysStr = process.env.GEMINI_API_KEYS || '';
    if (geminiApiKeysStr) {
      setApiKeys(geminiApiKeysStr.split(',').map(key => key.trim()));
    }
  }, []);
  
  // Function to get a random API key
  const getRandomApiKey = () => {
    if (apiKeys.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * apiKeys.length);
    return apiKeys[randomIndex];
  };
  
  // Group models by family for the dropdown
  const geminiStandardModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && !m.name.includes("flash"),
  );
  const geminiFlashModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && m.name.includes("flash"),
  );
  
  // Function to chunk HTML content for better translation
  const chunkHtml = (html: string, maxChunkSize = 2500): string[] => {
    // If content is small enough, return as is
    if (html.length <= maxChunkSize) return [html];
    
    const chunks: string[] = [];
    let currentChunk = "";
    
    // Simple tag-aware splitting
    const lines = html.split(/(<[^>]+>|\n)/g);
    
    for (const line of lines) {
      // If adding this line would exceed the chunk size, start a new chunk
      if (currentChunk.length + line.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      
      currentChunk += line;
    }
    
    // Add the last chunk if it's not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  };
  
  // Direct call to Gemini API for text translation
  const translateTextWithGemini = async (text: string, model: string): Promise<string> => {
    const apiKey = getRandomApiKey();
    if (!apiKey) {
      throw new Error("No API key available for Gemini");
    }
    
    // Prepare the Gemini API endpoint URL
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    
    const prompt = `Translate the following text from English to Vietnamese, keeping the original formatting and preserving any HTML tags:

Text to translate:
${text}

Please only return the translated text without any explanations or additional formatting.`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    };
    
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      // Extract the translated text from the response
      if (data.candidates && 
          data.candidates[0] && 
          data.candidates[0].content && 
          data.candidates[0].content.parts && 
          data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected Gemini API response structure");
      }
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  };
  
  // Function to translate HTML content with chunking using Gemini API
  const translateHtmlWithChunking = async (html: string, model: string): Promise<string> => {
    const chunks = chunkHtml(html);
    let translatedHtml = "";
    
    for (let i = 0; i < chunks.length; i++) {
      setProgressMessage(`Translating chunk ${i + 1}/${chunks.length}...`);
      
      try {
        const translatedChunk = await translateTextWithGemini(chunks[i], model);
        translatedHtml += translatedChunk;
        
        // Add a small delay between chunks to avoid rate limiting
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error translating chunk ${i + 1}:`, error);
        throw error;
      }
    }
    
    return translatedHtml;
  };
  
  // Progress message state
  const [progressMessage, setProgressMessage] = useState("");

  const handleHtmlTranslate = async () => {
    if (!htmlInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter HTML content to translate",
        variant: "destructive",
      });
      return;
    }

    if (apiKeys.length === 0) {
      toast({
        title: "Configuration Error",
        description: "No Gemini API keys available. Please check environment variables.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgressMessage("Preparing translation...");
    
    try {
      // For small content, translate directly
      if (htmlInput.length < 2500) {
        const translatedHtml = await translateTextWithGemini(htmlInput, selectedModel);
        setHtmlOutput(translatedHtml);
        toast({
          title: "Translation Complete",
          description: "HTML content has been translated successfully",
        });
      } else {
        // For larger content, use chunking
        setProgressMessage("Content is large, breaking into chunks...");
        const translatedHtml = await translateHtmlWithChunking(htmlInput, selectedModel);
        setHtmlOutput(translatedHtml);
        toast({
          title: "Translation Complete",
          description: "HTML content has been translated successfully",
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation Error",
        description: "Failed to translate content. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgressMessage("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to Clipboard",
          description: "Content has been copied to clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy content to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Translate for Vietnam</h2>
          <p className="text-sm text-muted-foreground">
            Translate content from English to Vietnamese with local style
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Model Selection</label>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full max-w-xs">
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
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input HTML (English)</label>
            <textarea
              className="w-full h-64 p-3 border rounded-md font-mono text-sm"
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Paste English HTML content here..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Output HTML (Vietnamese)</label>
            <div className="relative">
              <textarea
                className="w-full h-64 p-3 border rounded-md font-mono text-sm"
                value={htmlOutput}
                readOnly
                placeholder="Translated content will appear here..."
              />
              {htmlOutput && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(htmlOutput)}
                >
                  Copy
                </Button>
              )}
            </div>
          </div>
        </div>
        {isLoading && progressMessage && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4">
            <p className="text-blue-700 text-center">{progressMessage}</p>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 animate-pulse"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            onClick={handleHtmlTranslate} 
            disabled={isLoading || !htmlInput.trim()}
            className="w-1/3"
          >
            {isLoading ? "Translating..." : "Translate HTML"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TranslateVN;