import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Step8SEOProps {
  modelConfig: ModelConfig;
  onBack: () => void;
  onNext: (metaContent: string) => void;
}

const DEFAULT_PROMPT = `Create optimized meta information:
1. 3-5 title tag versions
2. Meta description versions
3. Featured image alt text
4. Social sharing snippets
5. URL structure suggestion`;

const RECOMMENDED_MODELS = [
  {
    name: "gemini-1.5-pro",
    description: "Best choice - Complex reasoning and analysis",
  },
  {
    name: "gemini-2.0-flash-thinking-exp-01-21",
    description: "Alternative - Specialized in SEO optimization",
  },
];

const Step8SEO = ({ modelConfig, onBack, onNext }: Step8SEOProps) => {
  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Save prompt to META.TXT
      const promptBlob = new Blob([prompt], { type: "text/plain" });
      const promptUrl = URL.createObjectURL(promptBlob);
      const a = document.createElement("a");
      a.href = promptUrl;
      a.download = "META.TXT";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(promptUrl);

      // Move to next step
      onNext(prompt);
    } catch (error) {
      console.error("Error processing content:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Step 8: SEO Optimization</h2>
          <p className="text-sm text-muted-foreground">
            Generate optimized meta information
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Model</label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {RECOMMENDED_MODELS.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.name} - {model.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Analysis Command</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default Step8SEO;
