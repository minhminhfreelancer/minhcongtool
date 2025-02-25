import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Copy,
  PencilLine,
  Check,
  Info,
} from "lucide-react";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export interface Step4AnalysisProps {
  modelConfig: ModelConfig;
  keyword: string;
  researchContent: string;
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
    name: "claude-3-5-sonnet",
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
  const [contentPreviewExpanded, setContentPreviewExpanded] = useState(false);

  // New states for analysis results, processing states, and copy status
  const [analysisResult, setAnalysisResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Generate a sample writing style analysis
  const generateStyleAnalysis = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI API
      // For demonstration, we'll simulate a 2 second delay and return sample analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Sample style analysis result
      const sampleResult = `# Writing Style Analysis for "${keyword}"

## Overview
The analyzed content demonstrates a professional yet accessible writing style, aimed at general readers seeking information about ${keyword}. The content balances educational value with practical guidance.

## Tone and Voice
* **Tone**: Informational and authoritative, yet conversational
* **Voice**: Second-person ("you") used frequently to engage readers directly
* **Formality Level**: Semi-formal; avoids overly academic language while maintaining credibility

## Sentence Structure
* **Length**: Varied sentence length with a preference for medium-length sentences (15-20 words)
* **Complexity**: Alternates between simple declarative sentences and more complex structures
* **Transitions**: Strong use of transitional phrases to guide readers between ideas

## Vocabulary
* **Level**: Moderate complexity, accessible to general readers with high school education
* **Technical Terms**: Specialized terminology related to ${keyword} is introduced but immediately defined
* **Consistency**: Core terms are used consistently throughout the content

## Paragraph Organization
* **Structure**: Short paragraphs (3-4 sentences) organized around single ideas
* **Flow**: Clear logical progression using signposting and transitional phrases
* **Introduction and Conclusion**: Each section has a clear introduction and summary

## Engagement Techniques
* **Questions**: Rhetorical questions used to introduce new sections
* **Commands**: Imperative sentences used for advice and recommendations
* **Examples**: Practical examples and scenarios to illustrate abstract concepts

## Formatting Patterns
* **Headers**: H2 and H3 headers used to create clear content hierarchy
* **Lists**: Bulleted lists for features, numbered lists for sequential steps
* **Emphasis**: Bold text for key points, italics for term definitions

## Readability
* **Target Audience**: General audience with specific interest in ${keyword}
* **Reading Level**: Approximately 8th-10th grade reading level
* **Accessibility**: Well-structured for both detailed reading and scanning

## Writing Guidance
To match this style when writing about ${keyword}:
1. Use a confident but friendly tone
2. Address the reader directly using "you"
3. Introduce technical terms carefully with clear definitions
4. Vary sentence structures to maintain interest
5. Keep paragraphs focused on single ideas
6. Use formatting to enhance readability
7. Include practical examples to illustrate concepts`;

      setAnalysisResult(sampleResult);
      setShowResults(true);
    } catch (error) {
      console.error("Error generating analysis:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;

    navigator.clipboard
      .writeText(analysisResult)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleDownload = () => {
    if (!analysisResult) return;

    const filename = `${keyword.replace(/\s+/g, "-")}-style-analysis.md`;
    const blob = new Blob([analysisResult], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Ensure we have analysis results before proceeding
      if (!analysisResult && !isGenerating) {
        await generateStyleAnalysis();
      }
      // Move to next step
      onNext(analysisResult);
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
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium text-blue-800">Content Information</h3>
              <p className="text-sm text-blue-700">
                Keyword: <span className="font-semibold">{keyword}</span>
              </p>
              <p className="text-sm text-blue-700">
                Research:{" "}
                <span className="font-semibold">
                  {Math.round(researchContent.length / 100) / 10}KB
                </span>{" "}
                of data
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

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setContentPreviewExpanded(!contentPreviewExpanded)}
          >
            {contentPreviewExpanded
              ? "Hide Research Preview"
              : "Show Research Preview"}
          </Button>

          <Button
            variant="default"
            className="gap-1"
            onClick={generateStyleAnalysis}
            disabled={isGenerating}
          >
            <PencilLine className="h-4 w-4" />
            {isGenerating
              ? "Generating Analysis..."
              : "Generate Style Analysis"}
          </Button>
        </div>

        {contentPreviewExpanded && (
          <Card className="mt-2">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Research Content Preview
                </h4>
                <div className="text-xs bg-slate-50 p-4 rounded max-h-40 overflow-y-auto">
                  {researchContent
                    ? researchContent.substring(0, 500) + "..."
                    : "No research content available."}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {showResults && (
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold">
                Writing Style Analysis Results
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1"
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 prose prose-sm max-w-none">
                {analysisResult.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} className="text-xl font-bold mt-2">
                        {line.substring(2)}
                      </h1>
                    );
                  } else if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-lg font-semibold mt-4">
                        {line.substring(3)}
                      </h2>
                    );
                  } else if (line.startsWith("* ")) {
                    return (
                      <li key={i} className="ml-4">
                        {line.substring(2)}
                      </li>
                    );
                  } else if (
                    line.startsWith("1. ") ||
                    line.startsWith("2. ") ||
                    line.startsWith("3. ") ||
                    line.startsWith("4. ") ||
                    line.startsWith("5. ") ||
                    line.startsWith("6. ") ||
                    line.startsWith("7. ")
                  ) {
                    return (
                      <li key={i} className="ml-5">
                        {line.substring(3)}
                      </li>
                    );
                  } else if (line === "") {
                    return <br key={i} />;
                  } else {
                    return (
                      <p key={i} className="my-1">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing || isGenerating}
        >
          {isProcessing ? "Processing..." : "Continue to Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default Step4Analysis;
