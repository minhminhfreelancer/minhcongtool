import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Info,
  PencilLine,
  Copy,
  Download,
  Check,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [contentPreviewExpanded, setContentPreviewExpanded] = useState(false);

  // New states for outline results, processing states, and copy status
  const [outlineResult, setOutlineResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [partNumber, setPartNumber] = useState(5); // Default to 5 sections

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

  // Generate a sample content outline
  const generateContentOutline = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI API
      // For demonstration, simulate a 2 second delay and return sample outline
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set a random number of H2 sections between 3-7
      const newPartNumber = Math.floor(Math.random() * 5) + 3;
      setPartNumber(newPartNumber);

      // Sample outline result - this would come from the AI in a real implementation
      const sampleOutline = `# Comprehensive Content Outline for "${keyword}"

## Introduction to ${keyword}
- **Key Points**: Define ${keyword}, explain importance, establish reader context
- **Target Word Count**: 250-300 words
- **Key Questions to Answer**: 
  - What is ${keyword}?
  - Why is ${keyword} important?
  - Who needs to understand ${keyword}?
- **Visual Element**: Introductory infographic showing key statistics
- **Internal Linking**: Link to related guides and tutorials

## Core Components of ${keyword}
- **Key Points**: Break down fundamental elements, explain technical aspects
- **Target Word Count**: 400-500 words
- **Subsections**:
  ### Essential Features
  - Detailed explanation of critical features
  - Comparison table of feature importance
  ### Technical Specifications
  - Industry standards and specifications
  - Common variations and alternatives
- **Key Questions to Answer**:
  - What are the core elements of ${keyword}?
  - How do these components work together?
- **Visual Element**: Component breakdown diagram
- **Internal Linking**: Deep links to individual component guides

## ${keyword} Selection Guide
- **Key Points**: Decision criteria, evaluation framework, comparison methodology
- **Target Word Count**: 600-700 words
- **Subsections**:
  ### Evaluation Criteria
  - Primary factors to consider
  - Weighted importance of different factors
  ### Common Scenarios
  - Appropriate selections for different use cases
  - Decision matrix for various situations
- **Key Questions to Answer**:
  - How to evaluate ${keyword} options?
  - Which factors matter most for my situation?
- **Visual Element**: Decision flowchart
- **Internal Linking**: Links to reviews and comparison articles

## Best Practices for ${keyword} Implementation
- **Key Points**: Step-by-step process, common pitfalls, expert tips
- **Target Word Count**: 550-650 words
- **Subsections**:
  ### Implementation Process
  - Preparation steps
  - Execution guidelines
  ### Common Mistakes to Avoid
  - Typical errors
  - Troubleshooting guidelines
- **Key Questions to Answer**:
  - How do I implement ${keyword} properly?
  - What mistakes should I avoid?
- **Visual Element**: Process checklist infographic
- **Internal Linking**: Links to case studies and tutorials

## Advanced ${keyword} Strategies
- **Key Points**: Advanced techniques, optimization approaches, expert-level insights
- **Target Word Count**: 500-600 words
- **Subsections**:
  ### Optimization Techniques
  - Performance enhancement methods
  - Efficiency improvements
  ### Integration Strategies
  - Combining with complementary systems
  - Ecosystem considerations
- **Key Questions to Answer**:
  - How can I get the most out of ${keyword}?
  - What advanced techniques exist?
- **Visual Element**: Before/after comparison chart
- **Internal Linking**: Links to advanced guides and expert discussions

## Future Trends in ${keyword}
- **Key Points**: Emerging developments, industry forecasts, future applications
- **Target Word Count**: 350-450 words
- **Key Questions to Answer**:
  - How is ${keyword} evolving?
  - What future developments should I anticipate?
- **Visual Element**: Timeline of predicted advancements
- **Internal Linking**: Links to news and updates section

## Conclusion and Next Steps
- **Key Points**: Summary of key takeaways, actionable recommendations, resource links
- **Target Word Count**: 200-250 words
- **Key Questions to Answer**:
  - What are the most important points to remember?
  - What should I do next?
- **Visual Element**: Summary checklist or key points callout
- **Internal Linking**: Links to related content and resources

## FAQ Section
- Compilation of most common questions with concise answers
- Target Word Count: 400-500 words
- Internal Linking: Contextual links to relevant sections within the article

---

**Total Estimated Word Count**: 3,250-3,950 words
**Primary Target Keyword**: ${keyword}
**Secondary Keywords**: [List relevant secondary keywords]
**Content Type**: ${contentTypeName}
**Target Audience**: [Define primary audience segments]`;

      setOutlineResult(sampleOutline);
      setShowResults(true);
    } catch (error) {
      console.error("Error generating outline:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!outlineResult) return;

    navigator.clipboard
      .writeText(outlineResult)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleDownload = () => {
    if (!outlineResult) return;

    const filename = `${keyword.replace(/\s+/g, "-")}-content-outline.md`;
    const blob = new Blob([outlineResult], { type: "text/markdown" });
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
      // Ensure we have outline results before proceeding
      if (!outlineResult && !isGenerating) {
        await generateContentOutline();
      }
      // Move to next step with outline and part number
      onNext(outlineResult, partNumber);
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

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setContentPreviewExpanded(!contentPreviewExpanded)}
          >
            {contentPreviewExpanded
              ? "Hide Style Analysis"
              : "Show Style Analysis"}
          </Button>

          <Button
            variant="default"
            className="gap-1"
            onClick={generateContentOutline}
            disabled={isGenerating}
          >
            <PencilLine className="h-4 w-4" />
            {isGenerating
              ? "Generating Outline..."
              : "Generate Content Outline"}
          </Button>
        </div>

        {contentPreviewExpanded && (
          <Card className="mt-2">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-sm">
                Writing Style Analysis Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-xs bg-slate-50 p-4 rounded max-h-40 overflow-y-auto">
                {styleAnalysis
                  ? styleAnalysis.substring(0, 500) + "..."
                  : "No style analysis available."}
              </div>
            </CardContent>
          </Card>
        )}

        {showResults && (
          <div className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold">Content Outline Results</h3>
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
                {outlineResult.split("\n").map((line, i) => {
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
                  } else if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="text-md font-medium mt-3">
                        {line.substring(4)}
                      </h3>
                    );
                  } else if (line.startsWith("- ")) {
                    return (
                      <li key={i} className="ml-4">
                        {line.substring(2)}
                      </li>
                    );
                  } else if (line.startsWith("  - ")) {
                    return (
                      <li key={i} className="ml-8">
                        {line.substring(4)}
                      </li>
                    );
                  } else if (line.startsWith("**")) {
                    return (
                      <p key={i} className="my-1 font-semibold">
                        {line}
                      </p>
                    );
                  } else if (line === "---") {
                    return <hr key={i} className="my-4" />;
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

            <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-2">
              <p className="text-sm text-green-800">
                <span className="font-medium">Sections detected:</span>{" "}
                {partNumber} main sections
              </p>
              <p className="text-xs text-green-700 mt-1">
                This outline will be used to structure your content creation
                process in the following steps.
              </p>
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

export default Step5Structure;
