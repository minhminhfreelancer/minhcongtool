import { useState, useEffect } from "react";
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

export interface Step6ReviewProps {
  modelConfig: ModelConfig;
  onBack: () => void;
  onNext: (guideContent: string, outlineContent: string) => void;
}

const RECOMMENDED_MODELS = [
  {
    name: "gemini-1.5-pro",
    description: "Best choice - Complex reasoning and analysis",
  },
  {
    name: "gemini-2.0-flash-thinking-exp-01-21",
    description: "Alternative - Specialized in content review",
  },
];

const Step6Review = ({ modelConfig, onBack, onNext }: Step6ReviewProps) => {
  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [guideContent, setGuideContent] = useState("");
  const [outlineContent, setOutlineContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Simulate loading content from files
    setGuideContent("[Content from GUIDE.TXT will appear here]");
    setOutlineContent("[Content from OUTLINE.TXT will appear here]");
  }, []);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Save updated content
      onNext(guideContent, outlineContent);
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
          <h2 className="text-2xl font-semibold">Step 6: Review Content</h2>
          <p className="text-sm text-muted-foreground">
            Review and edit the generated content
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
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

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Writing Style Guide</label>
            <Textarea
              value={guideContent}
              onChange={(e) => setGuideContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder="Content from GUIDE.TXT will appear here"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Content Outline</label>
            <Textarea
              value={outlineContent}
              onChange={(e) => setOutlineContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Content from OUTLINE.TXT will appear here"
            />
          </div>
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

export default Step6Review;
