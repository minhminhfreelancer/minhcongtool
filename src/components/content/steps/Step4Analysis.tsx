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

export interface Step4AnalysisProps {
  modelConfig: ModelConfig;
  onBack: () => void;
  onNext: (analysis: string) => void;
}

const DEFAULT_PROMPT = `Based on 'KEYWORD.TXT', analyze the characteristics of the content writer. Detail the writing style to guide others in writing similarly.`;

const RECOMMENDED_MODELS = [
  {
    name: "gemini-1.5-pro",
    description: "Best choice - Complex reasoning and analysis",
  },
  {
    name: "gemini-2.0-flash-thinking-exp-01-21",
    description: "Alternative - Specialized in writing style analysis",
  },
];

const Step4Analysis = ({ modelConfig, onBack, onNext }: Step4AnalysisProps) => {
  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Save prompt to GUIDE.TXT
      const promptBlob = new Blob([prompt], { type: "text/plain" });
      const promptUrl = URL.createObjectURL(promptBlob);
      const a = document.createElement("a");
      a.href = promptUrl;
      a.download = "GUIDE.TXT";
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
          <h2 className="text-2xl font-semibold">
            Step 4: Writing Style Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Analyze the writing style from the research content
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

export default Step4Analysis;
