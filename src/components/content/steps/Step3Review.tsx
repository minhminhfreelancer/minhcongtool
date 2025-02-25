import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SearchResult } from "@/types/search";
import { CONTENT_TEMPLATES } from "@/lib/templates";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import { htmlToMarkdown } from "@/lib/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Step3ReviewProps {
  results: SearchResult[];
  modelConfig: ModelConfig;
  onBack: () => void;
  onNext: (analysis: string, keyword: string, research: string) => void;
}

const Step3Review = ({
  results,
  modelConfig,
  onBack,
  onNext,
}: Step3ReviewProps) => {
  // Extract keyword from results
  const keyword = results[0]?.searchKeyword || "";

  // Initialize prompt with the keyword already filled in
  const DEFAULT_PROMPT = `This is research content about articles on [keyword]: [CONTENT]

Please analyze and provide:
1. Common article structures
2. Main and secondary sections
3. Key points mentioned
4. Unique perspectives from each article
5. Strengths/weaknesses of each article
6. Opportunities for differentiation
7. Content type (choose 1): Pillar Content/Supporting Content/Informational Content/Commercial Content/Engagement Content/News/Updates`;

  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("pillar");
  const [isProcessing, setIsProcessing] = useState(false);

  // Set the initial prompt with the keyword filled in
  useEffect(() => {
    if (keyword) {
      setPrompt(DEFAULT_PROMPT.replace("[keyword]", keyword));
    } else {
      setPrompt(DEFAULT_PROMPT);
    }
  }, [keyword]);

  const handleProcess = async () => {
    if (!results.length) return;

    setIsProcessing(true);
    try {
      // Format the content exactly like the downloadTextFile function in Step2Search
      const content = results
        .map((result) => {
          // Convert HTML content to markdown if available
          const markdownContent = result.content
            ? typeof htmlToMarkdown === "function"
              ? htmlToMarkdown(result.content)
              : result.content
            : result.snippet || "No content available";

          // Create a formatted markdown document - using the same format as downloadTextFile
          return `# ${result.title}\n\nSource: ${result.url}\n\n## Summary\n${result.snippet || "No summary available"}\n\n## Full Content\n${markdownContent}\n\n---\n`;
        })
        .join("\n");

      // Create the final analysis prompt with the content
      const finalPrompt = prompt.replace("[CONTENT]", content);

      // Move to next step with analysis, keyword and research content
      onNext(finalPrompt, keyword, content);
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
          <h2 className="text-2xl font-semibold">Step 3: Review Command</h2>
          <p className="text-sm text-muted-foreground">
            Customize the analysis command and select content type
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type Template</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CONTENT_TEMPLATES).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {contentType && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Structure</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  {CONTENT_TEMPLATES[contentType].template.structure.map(
                    (item, index) => (
                      <div key={index}>{item}</div>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Optimization Tips</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  {CONTENT_TEMPLATES[contentType].template.optimization.map(
                    (item, index) => (
                      <div key={index}>• {item}</div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Analysis Command</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-xs text-slate-500">
            The command automatically includes your search keyword. Use
            [CONTENT] as placeholder for the research content.
          </p>
        </div>

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing || !results.length}
        >
          {isProcessing ? "Processing..." : "Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default Step3Review;
