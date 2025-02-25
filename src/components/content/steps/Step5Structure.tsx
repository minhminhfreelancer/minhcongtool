import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Step5StructureProps {
  modelConfig: ModelConfig;
  keyword: string;
  researchContent: string;
  styleAnalysis: string;
  contentTypeKey?: string;
  contentTypeName?: string;
  onBack: () => void;
  onNext: (analysis: string, partNumber: number) => void;
}

const Step5Structure = ({
  modelConfig,
  keyword,
  researchContent,
  styleAnalysis,
  contentTypeKey = "pillar",
  contentTypeName = "Pillar Content",
  onBack,
  onNext,
}: Step5StructureProps) => {
  // Default prompt template with placeholders
  const DEFAULT_PROMPT = `Create a detailed content outline for ${keyword ? `"${keyword}"` : "[TOPIC]"} that follows the ${contentTypeName || "[CONTENT_TYPE]"} format.

Use the following inputs to guide your outline creation:
1. Research data: The provided research contains information about existing content structure, key topics, and approaches used by others.
2. Content type: This should be structured as ${contentTypeName || "[CONTENT_TYPE]"} which requires comprehensive coverage and logical organization.
3. Writing style: Follow the writing style identified in the analysis to maintain consistency.

Please generate:
1. A complete outline with H2, H3 headers following SEO best practices
2. Key points that should be covered under each section
3. Internal linking opportunities between sections
4. Word count recommendations for each major section
5. Questions to answer in each section
6. Key statistics or data points to include
7. Suggested visual elements (tables, charts, infographics)

Structure the outline in a hierarchical format using proper heading levels (H2, H3, H4) with clear section numbering.`;

  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [contentPreviewExpanded, setContentPreviewExpanded] = useState(false);

  // Initialize prompt with actual data
  useEffect(() => {
    if (keyword && contentTypeName) {
      setPrompt(DEFAULT_PROMPT);
    }
  }, [keyword, contentTypeName]);

  const RECOMMENDED_MODELS = [
    {
      name: "gemini-1.5-pro",
      description: "Best choice - Complex reasoning and analysis",
    },
    {
      name: "claude-3-5-sonnet",
      description: "Alternative - Excellent for content structuring",
    },
  ];

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // For demo, we'll set a random number of H2 sections between 3-7
      const partNumber = Math.floor(Math.random() * 5) + 3;

      // Move to next step
      onNext(prompt, partNumber);
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
          <h2 className="text-2xl font-semibold">Step 5: Content Structure</h2>
          <p className="text-sm text-muted-foreground">
            Generate a detailed content outline
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-blue-800">
                Content Analysis Summary
              </h3>
              <p className="text-sm text-blue-700">
                Keyword: <span className="font-semibold">{keyword}</span>
              </p>
              <p className="text-sm text-blue-700">
                Content Type:{" "}
                <span className="font-semibold">{contentTypeName}</span>
              </p>
              <p className="text-sm text-blue-700">
                Research:{" "}
                <span className="font-semibold">
                  {Math.round(researchContent.length / 100) / 10}KB
                </span>{" "}
                of data analyzed
              </p>
            </div>
          </div>
        </div>

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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Content Outline Command
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                  >
                    <Info className="h-3.5 w-3.5" />
                    Prompt Guide
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-80">
                  <p className="text-xs">
                    This prompt automatically incorporates your keyword, content
                    type, and research data. The AI will create a comprehensive
                    outline based on all previous analysis.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <div
          className="border border-slate-200 rounded-md overflow-hidden cursor-pointer"
          onClick={() => setContentPreviewExpanded(!contentPreviewExpanded)}
        >
          <div className="bg-slate-100 p-3 flex justify-between items-center">
            <h4 className="text-sm font-medium">
              Research & Style Data Preview
            </h4>
            <span>{contentPreviewExpanded ? "▲" : "▼"}</span>
          </div>

          {contentPreviewExpanded && (
            <div className="p-4 space-y-3">
              <div>
                <h5 className="text-xs font-semibold text-slate-700 mb-1">
                  Writing Style Analysis
                </h5>
                <div className="text-xs bg-slate-50 p-2 rounded max-h-20 overflow-y-auto">
                  {styleAnalysis
                    ? styleAnalysis.substring(0, 200) + "..."
                    : "No style analysis available."}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-semibold text-slate-700 mb-1">
                  Research Content Preview
                </h5>
                <div className="text-xs bg-slate-50 p-2 rounded max-h-20 overflow-y-auto">
                  {researchContent
                    ? researchContent.substring(0, 200) + "..."
                    : "No research content available."}
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
          {isProcessing ? "Generating Outline..." : "Generate Content Outline"}
        </Button>
      </div>
    </div>
  );
};

export default Step5Structure;
