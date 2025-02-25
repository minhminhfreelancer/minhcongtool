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
  keyword: string;
  researchContent: string; // Add researchContent as a prop
  onBack: () => void;
  onNext: (analysis: string) => void;
}

const DEFAULT_PROMPT = `Based on the following research content about "[KEYWORD]", analyze the characteristics of the content writers. Detail the writing style to guide others in writing similarly on this topic.

Include analysis of:
1. Tone and voice (formal, conversational, technical)
2. Sentence structure and length
3. Vocabulary level and specialized terminology usage
4. Paragraph organization and flow
5. Use of questions, commands, or other engagement techniques
6. Content formatting patterns (lists, headers, quotes)
7. Overall readability and target audience level

Research content:
[CONTENT]`;

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

const Step4Analysis = ({
  modelConfig,
  keyword,
  researchContent,
  onBack,
  onNext,
}: Step4AnalysisProps) => {
  // Initialize the prompt with the actual keyword and content
  const initializedPrompt = DEFAULT_PROMPT.replace(
    "[KEYWORD]",
    keyword,
  ).replace("[CONTENT]", researchContent);

  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [prompt, setPrompt] = useState(initializedPrompt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contentPreviewExpanded, setContentPreviewExpanded] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
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
          <p className="text-xs text-slate-500">
            The prompt automatically includes your keyword and research content.
            You can customize the analysis instructions above.
          </p>
        </div>

        <div className="border border-slate-200 rounded-md overflow-hidden">
          <div
            className="bg-slate-100 p-3 flex justify-between items-center cursor-pointer"
            onClick={() => setContentPreviewExpanded(!contentPreviewExpanded)}
          >
            <h4 className="text-sm font-medium">Content Preview</h4>
            <span>{contentPreviewExpanded ? "▲" : "▼"}</span>
          </div>

          {contentPreviewExpanded && (
            <div className="max-h-60 overflow-y-auto p-4 bg-white">
              <div className="space-y-2">
                <p>
                  <strong>Keyword:</strong> {keyword}
                </p>
                <p>
                  <strong>Research Content:</strong> {researchContent.length}{" "}
                  characters
                </p>
                <div className="text-xs font-mono bg-slate-50 p-2 rounded">
                  {researchContent.substring(0, 300)}...
                </div>
              </div>
            </div>
          )}
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
