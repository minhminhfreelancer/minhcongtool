/**
 * Processes search results and generates formatted research content
 *
 * This function transforms search results into properly formatted markdown content
 * in the same format as the downloadable text file from Step2. It handles HTML-to-markdown
 * conversion and structures each search result with consistent headings and sections.
 *
 * @param {SearchResult[]} searchResults - Array of search results from previous step
 * @returns {string} - Formatted markdown content ready for analysis
 */
const generateResearchContent = (searchResults) => {
  return searchResults
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
}; /**
 * Simulates an analysis of the research content
 *
 * In a production environment, this would call an AI API or backend service to generate
 * actual analysis of the research content. For demonstration purposes, we generate
 * a simulated analysis result based on the content structure.
 *
 * @param {string} keyword - The search keyword
 * @param {string} content - The research content to analyze
 * @param {SearchResult[]} results - Original search results for additional context
 * @returns {string} - Analysis results as formatted text
 */
const generateContentAnalysis = async (keyword, content, results) => {
  // This would normally be an API call to a backend service or AI model
  // For demo purposes, we'll create a simulated analysis

  // Calculate some statistics from the content
  const titleCount = (content.match(/^# /gm) || []).length;
  const wordCount = content.split(/\s+/).length;
  const sourceCount = (content.match(/^Source: /gm) || []).length;

  // Extract some sample topics by looking at titles
  const titles = results.map((r) => r.title).slice(0, 3);

  // Calculate simulated reading time (1 word takes about 0.3 seconds to read)
  const readingTimeMinutes = Math.round((wordCount * 0.3) / 60);

  // Create a formatted analysis document
  return `# Content Analysis for "${keyword}"

## Research Summary
* **Analyzed Content**: ${titleCount} articles with approximately ${wordCount} words
* **Estimated Reading Time**: ${readingTimeMinutes} minutes
* **Content Type**: ${CONTENT_TEMPLATES[contentType].name}

## Common Article Structures
Based on the analyzed content, most articles about "${keyword}" follow these structures:
1. Introduction with problem statement
2. Background information or context
3. Main solution points or alternatives
4. Practical recommendations
5. Conclusion with call to action

## Key Points Mentioned
The most frequently mentioned topics across all articles include:
* ${titles[0] || "Product comparisons and reviews"}
* ${titles[1] || "Best practices and recommendations"}
* ${titles[2] || "Common challenges and solutions"}

## Unique Perspectives
Each source approaches the topic differently, with some focusing on:
* Technical specifications and performance metrics
* User experience and practical applications
* Cost-benefit analysis and value propositions

## Content Opportunities
To differentiate your content on "${keyword}" consider:
1. Creating more comprehensive comparison guides
2. Focusing on specific use cases with detailed walkthroughs
3. Providing expert insights not commonly found in existing articles
4. Addressing common misconceptions about the topic

## Optimization Recommendations
Based on the ${CONTENT_TEMPLATES[contentType].name} template:
${CONTENT_TEMPLATES[contentType].template.optimization
  .slice(0, 3)
  .map((tip) => `* ${tip}`)
  .join("\n")}

---
Analysis completed on ${new Date().toLocaleString()}
`;
};
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ClipboardCopy } from "lucide-react";
import { SearchResult } from "@/types/search";
import { CONTENT_TEMPLATES } from "@/lib/templates";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import { htmlToMarkdown, downloadTextFile } from "@/lib/search";
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
  const [processedContent, setProcessedContent] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [finalKeyword, setFinalKeyword] = useState("");
  const [finalPrompt, setFinalPrompt] = useState("");

  // Added state for analysis results
  const [analysisResults, setAnalysisResults] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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
      // Generate research content using our dedicated function
      const content = generateResearchContent(results);

      // Create the final analysis prompt with the content
      const generatedPrompt = prompt.replace("[CONTENT]", content);

      // Store the processed content and final keyword
      setProcessedContent(content);
      setFinalKeyword(keyword);
      setFinalPrompt(generatedPrompt);

      // Show the results section
      setShowResults(true);

      // Generate analysis results
      setIsAnalyzing(true);
      const analysis = await generateContentAnalysis(keyword, content, results);
      setAnalysisResults(analysis);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error processing content:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    // Now proceed to the next step with our processed data
    onNext(finalPrompt, finalKeyword, processedContent);
  };

  const handleCopyAnalysis = () => {
    if (!analysisResults) return;

    navigator.clipboard
      .writeText(analysisResults)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleDownloadAnalysis = () => {
    if (!analysisResults) return;

    downloadTextFile(
      `${finalKeyword.replace(/\s+/g, "-")}-analysis.md`,
      analysisResults,
    );
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
          <div className="space-y-1">
            <p className="text-xs text-slate-500">
              The command automatically includes your search keyword.
            </p>
            <p className="text-xs font-medium text-blue-600">
              Note: The [CONTENT] placeholder will be automatically replaced
              with all the research data when you click "Next Step".
            </p>
          </div>
        </div>

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing || isAnalyzing || !results.length}
        >
          {isProcessing
            ? "Processing Content..."
            : isAnalyzing
              ? "Analyzing Content..."
              : "Generate Content Analysis"}
        </Button>

        {!showResults && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-700 mb-1">
              How this works:
            </h4>
            <p className="text-xs text-blue-600">
              1. The text area above shows the command template with your
              keyword already inserted.
            </p>
            <p className="text-xs text-blue-600">
              2. When you click the button above, your research data will be
              processed and analyzed.
            </p>
            <p className="text-xs text-blue-600">
              3. You'll see the analysis results before continuing to the next
              step.
            </p>
          </div>
        )}

        {showResults && (
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Content Analysis Complete
              </h3>
              <p className="text-sm text-green-700">
                {analysisResults
                  ? "Your content has been analyzed! Review the results below."
                  : "Processing content..."}
              </p>
            </div>

            {analysisResults && (
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <div className="bg-slate-100 p-3 flex justify-between items-center">
                  <h4 className="text-md font-semibold">
                    Content Analysis Results
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={handleCopyAnalysis}
                    >
                      <ClipboardCopy className="h-4 w-4" />
                      {copySuccess ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={handleDownloadAnalysis}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto p-4 bg-white">
                  <div className="prose prose-sm">
                    {analysisResults.split("\n").map((line, index) => {
                      if (line.startsWith("# ")) {
                        return (
                          <h1
                            key={index}
                            className="text-xl font-bold mt-4 mb-2"
                          >
                            {line.substring(2)}
                          </h1>
                        );
                      } else if (line.startsWith("## ")) {
                        return (
                          <h2
                            key={index}
                            className="text-lg font-semibold mt-3 mb-2"
                          >
                            {line.substring(3)}
                          </h2>
                        );
                      } else if (line.startsWith("* ")) {
                        return (
                          <div key={index} className="flex gap-2 my-1">
                            <span>•</span>
                            <span>{line.substring(2)}</span>
                          </div>
                        );
                      } else if (line.startsWith("---")) {
                        return (
                          <hr key={index} className="my-3 border-slate-200" />
                        );
                      } else if (line.match(/^\d+\./)) {
                        const parts = line.split(". ");
                        return (
                          <div key={index} className="flex gap-2 my-1">
                            <span>{parts[0]}.</span>
                            <span>{parts.slice(1).join(". ")}</span>
                          </div>
                        );
                      } else if (line === "") {
                        return <div key={index} className="h-2"></div>;
                      } else {
                        return (
                          <p key={index} className="my-1">
                            {line}
                          </p>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <div className="text-center font-medium text-slate-500">
                  Analyzing your content...
                </div>
              </div>
            )}

            <Button
              onClick={handleContinue}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!analysisResults}
            >
              Continue to Next Step
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3Review;
