import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Info } from "lucide-react";
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
  keyword: string;
  researchContent: string;
  styleAnalysis: string;
  contentOutline: string;
  contentTypeName: string;
  onBack: () => void;
  onNext: (styleGuide: string, finalOutline: string) => void;
}

const RECOMMENDED_MODELS = [
  {
    name: "gemini-1.5-pro",
    description: "Best choice - Complex reasoning and analysis",
  },
  {
    name: "claude-3-5-sonnet",
    description: "Alternative - Specialized in content review",
  },
];

const Step6Review = ({
  modelConfig,
  keyword,
  researchContent,
  styleAnalysis,
  contentOutline,
  contentTypeName,
  onBack,
  onNext,
}: Step6ReviewProps) => {
  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [guideContent, setGuideContent] = useState("");
  const [outlineContent, setOutlineContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStyleGuide, setShowStyleGuide] = useState(true);
  const [showContentOutline, setShowContentOutline] = useState(true);

  // Initialize with actual data from previous steps
  useEffect(() => {
    console.log("Step6Review received data:", {
      keyword,
      contentTypeName,
      styleAnalysis: styleAnalysis?.substring(0, 50) + "...",
      contentOutline: contentOutline?.substring(0, 50) + "...",
    });

    setGuideContent(styleAnalysis || "No style analysis available");
    setOutlineContent(contentOutline || "No content outline available");
  }, [styleAnalysis, contentOutline]);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Pass the finalized style guide and outline to the next step
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
            Review and edit the generated style guide and content outline
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-medium text-blue-800">Content Summary</h3>
            <p className="text-sm text-blue-700">
              Keyword: <span className="font-semibold">{keyword}</span>
            </p>
            <p className="text-sm text-blue-700">
              Content Type:{" "}
              <span className="font-semibold">{contentTypeName}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Review Model</label>
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
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div
              className="bg-slate-100 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => setShowStyleGuide(!showStyleGuide)}
            >
              <h4 className="text-md font-medium">Writing Style Guide</h4>
              <span>
                {showStyleGuide ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </div>

            {showStyleGuide && (
              <div className="p-3">
                <p className="text-xs text-slate-500 mb-2">
                  Review and edit the writing style guide that will inform the
                  tone and structure of your content.
                </p>
                <Textarea
                  value={guideContent}
                  onChange={(e) => setGuideContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Writing style guide will appear here"
                />
              </div>
            )}
          </div>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <div
              className="bg-slate-100 p-3 flex justify-between items-center cursor-pointer"
              onClick={() => setShowContentOutline(!showContentOutline)}
            >
              <h4 className="text-md font-medium">Content Outline</h4>
              <span>
                {showContentOutline ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </div>

            {showContentOutline && (
              <div className="p-3">
                <p className="text-xs text-slate-500 mb-2">
                  Review and edit the content outline that will structure your
                  final article.
                </p>
                <Textarea
                  value={outlineContent}
                  onChange={(e) => setOutlineContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Content outline will appear here"
                />
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Approve and Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Step6Review;
