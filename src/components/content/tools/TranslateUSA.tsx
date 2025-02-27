import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface TranslateUSAProps {
  modelConfig: ModelConfig;
  onComplete: () => void;
  onBack: () => void;
}

const TranslateUSA = ({ modelConfig, onComplete, onBack }: TranslateUSAProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [htmlInput, setHtmlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [activeTab, setActiveTab] = useState("html");
  const [selectedModel, setSelectedModel] = useState(modelConfig.model);
  
  // Group models by family for the dropdown
  const geminiStandardModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && !m.name.includes("flash"),
  );
  const geminiFlashModels = AVAILABLE_MODELS.filter(
    (m) => m.name.startsWith("gemini") && m.name.includes("flash"),
  );

  // Function to chunk HTML content for better translation
  const chunkHtml = (html: string, maxChunkSize = 5000): string[] => {
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
  
  // Function to translate HTML content with chunking
  const translateHtmlWithChunking = async (html: string, model: string): Promise<string> => {
    const chunks = chunkHtml(html);
    let translatedHtml = "";
    
    // Use the correct server URL
    const translationServerUrl = "http://localhost:3000/translate-html";
    
    for (let i = 0; i < chunks.length; i++) {
      setProgressMessage(`Translating chunk ${i + 1}/${chunks.length}...`);
      
      try {
        const response = await fetch(translationServerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            sourceLang: "Vietnamese",
            targetLang: "English",
            html: chunks[i],
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          translatedHtml += data.translatedHTML;
        } else {
          throw new Error(data.error || "Translation failed");
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

    setIsLoading(true);
    setProgressMessage("Preparing translation...");
    
    try {
      // Use the correct server URL
      const serverUrl = "http://localhost:3000/translate-html";
      
      // For small content, translate directly
      if (htmlInput.length < 5000) {
        const response = await fetch(serverUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: selectedModel,
            sourceLang: "Vietnamese",
            targetLang: "English",
            html: htmlInput,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setHtmlOutput(data.translatedHTML);
          toast({
            title: "Translation Complete",
            description: "HTML content has been translated successfully",
          });
        } else {
          throw new Error(data.error || "Translation failed");
        }
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
        description: "Could not connect to translation server. Please make sure the translation server is running at the correct path.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgressMessage("");
    }
  };

  const handleTextTranslate = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgressMessage("Translating text...");
    
    try {
      // Use the correct server URL
      const serverUrl = "http://localhost:3000/translate-text";
      
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          text: textInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setTextOutput(data.translatedText);
        toast({
          title: "Translation Complete",
          description: "Text has been translated successfully",
        });
      } else {
        throw new Error(data.error || "Translation failed");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation Error",
        description: "Could not connect to translation server. Please make sure the translation server is running at the correct path.",
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
          <h2 className="text-2xl font-semibold">Translate for USA</h2>
          <p className="text-sm text-muted-foreground">
            Translate content from Vietnamese to English with US-friendly style
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="html">HTML Translation</TabsTrigger>
          <TabsTrigger value="text">Text Translation</TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input HTML (Vietnamese)</label>
              <textarea
                className="w-full h-64 p-3 border rounded-md font-mono text-sm"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Paste Vietnamese HTML content here..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Output HTML (English)</label>
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
        </TabsContent>

        <TabsContent value="text" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input Text (Vietnamese)</label>
              <textarea
                className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter Vietnamese text here..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Text (English)</label>
              <div className="relative">
                <textarea
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                  value={textOutput}
                  readOnly
                  placeholder="Translated text will appear here..."
                />
                {textOutput && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(textOutput)}
                  >
                    Copy
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={handleTextTranslate} 
              disabled={isLoading || !textInput.trim()}
              className="w-1/3"
            >
              {isLoading ? "Translating..." : "Translate Text"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TranslateUSA;
