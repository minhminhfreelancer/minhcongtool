import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, PencilLine } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Step8SEOProps {
  modelConfig: ModelConfig;
  keyword: string;
  contentTypeName: string;
  contentOutline: string;
  finalContent: string;
  onBack: () => void;
  onNext: (metaContent: string) => void;
}

const Step8SEO = ({
  modelConfig,
  keyword,
  contentTypeName,
  contentOutline,
  finalContent,
  onBack,
  onNext,
}: Step8SEOProps) => {
  // Create a more comprehensive prompt using all available data
  const DEFAULT_PROMPT = `Based on the keyword "${keyword || "[KEYWORD]"}" and the final content, create optimized SEO metadata that will maximize search visibility.

Content Type: ${contentTypeName || "[CONTENT_TYPE]"}

Please generate:

1. Title Tag Options (3-5 variants, each under 60 characters)
   • Include primary keyword naturally
   • Use power words to increase CTR
   • Consider search intent

2. Meta Description Options (2-3 variants, each under 155 characters)
   • Include primary keyword and secondary keywords
   • Include a clear value proposition
   • Add a call-to-action

3. URL Structure
   • Recommend a clean, keyword-focused URL
   • Remove unnecessary words (a, the, and, etc.)
   • Separate words with hyphens

4. Social Sharing Optimization
   • Twitter Card Description (under 200 characters)
   • Facebook/LinkedIn Description (under 250 characters)
   • Social Media Title (under 70 characters)

5. Featured Image Recommendations
   • Image alt text recommendations
   • Image caption suggestions
   • Image subject/content recommendations

6. Additional Meta Tags
   • Suggested canonical URL format
   • Schema.org type recommendation
   • Open Graph type
   
Format the output clearly with appropriate headings and subheadings.`;

  const RECOMMENDED_MODELS = [
    {
      name: "gemini-1.5-pro",
      description: "Best choice - Complex reasoning and analysis",
    },
    {
      name: "claude-3-5-sonnet",
      description: "Alternative - Specialized in SEO optimization",
    },
  ];

  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [metaContent, setMetaContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Set initial prompt with actual data
  useEffect(() => {
    if (keyword) {
      setPrompt(DEFAULT_PROMPT);
    }
  }, [keyword, contentTypeName]);

  const handleGenerateMetadata = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI API
      // For now, we'll simulate generation with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate sample SEO metadata
      const sampleMetadata = `# SEO Metadata for "${keyword}"

## Title Tag Options
1. "Best ${keyword} in 2025: Top Picks for Every Budget" (52 chars)
2. "${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Expert Reviews & Buying Guide" (47 chars)
3. "Top 10 ${keyword} - Tested & Reviewed by Experts" (45 chars)
4. "Ultimate Guide to Choosing the Perfect ${keyword}" (54 chars)

## Meta Description Options
1. "Looking for the best ${keyword}? Our comprehensive guide covers top options, expert reviews, and buying tips to help you make the perfect choice. Compare now!" (152 chars)
2. "Discover the highest-rated ${keyword} of 2025. We've tested dozens to bring you honest reviews and practical recommendations for every need and budget." (145 chars)

## URL Structure
Recommended: /best-${keyword.replace(/\s+/g, "-").toLowerCase()}/
Alternative: /${keyword.replace(/\s+/g, "-").toLowerCase()}-reviews-guide/

## Social Sharing Optimization
### Twitter Card Description
"Our experts tested 20+ ${keyword} to find the absolute best options for every use case and budget. See which ones earned our top recommendations!"

### Facebook/LinkedIn Description
"After extensive testing and research, we've identified the top ${keyword} options for 2025. Our comprehensive guide includes detailed reviews, comparison charts, and a buyer's guide to help you make an informed decision."

### Social Media Title
"Best ${keyword} for 2025: Expert Reviews & Top Picks"

## Featured Image Recommendations
### Image Alt Text
"Comparison of top-rated ${keyword} options showing key features and benefits"

### Image Caption
"Our top picks for ${keyword} in 2025, tested and reviewed by our expert team"

### Image Content Recommendation
Feature a high-quality hero image showcasing multiple ${keyword} models arranged in a comparison-style layout with visible rating indicators.

## Additional Meta Tags
### Canonical URL
https://yoursite.com/best-${keyword.replace(/\s+/g, "-").toLowerCase()}/

### Schema.org Type
Article > ReviewArticle

### Open Graph Type
article`;

      setMetaContent(sampleMetadata);
    } catch (error) {
      console.error("Error generating metadata:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Move to next step with the metadata
      onNext(metaContent);
    } catch (error) {
      console.error("Error processing content:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulated preview of how the metadata might appear in search results
  const previewTitleTag =
    metaContent.match(/Title Tag Options[\s\S]*?1\. "([^"]+)"/)?.[1] ||
    "Title tag preview";
  const previewMetaDescription =
    metaContent.match(/Meta Description Options[\s\S]*?1\. "([^"]+)"/)?.[1] ||
    "Meta description preview";
  const previewUrl =
    metaContent.match(/Recommended: (\S+)/)?.[1] || "/example-url/";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Step 8: SEO Optimization</h2>
          <p className="text-sm text-muted-foreground">
            Generate optimized meta information for search visibility
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
            <h3 className="font-medium text-blue-800">Content Information</h3>
            <p className="text-sm text-blue-700">
              Keyword: <span className="font-semibold">{keyword}</span>
            </p>
            <p className="text-sm text-blue-700">
              Content Type:{" "}
              <span className="font-semibold">{contentTypeName}</span>
            </p>
            <p className="text-sm text-blue-700">
              Content Length:{" "}
              <span className="font-semibold">
                {Math.round(finalContent.length / 6)} words
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Select Model</label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateMetadata}
              disabled={isGenerating}
              className="gap-1 h-8"
            >
              <PencilLine className="h-3.5 w-3.5" />
              {isGenerating ? "Generating..." : "Generate Metadata"}
            </Button>
          </div>
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
          <label className="text-sm font-medium">
            Metadata Generation Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">
              Generated SEO Metadata
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-7 text-xs"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>

          {showPreview && metaContent && (
            <Card className="mb-4 border-slate-200">
              <CardHeader className="py-2 px-4 bg-slate-50">
                <CardTitle className="text-sm text-blue-800">
                  SERP Preview
                </CardTitle>
                <CardDescription className="text-xs">
                  How your content might appear in search results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-1 font-sans">
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {previewTitleTag}
                  </div>
                  <div className="text-green-700 text-xs">
                    https://yoursite.com{previewUrl}
                  </div>
                  <div className="text-slate-700 text-sm">
                    {previewMetaDescription}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Textarea
            value={metaContent}
            onChange={(e) => setMetaContent(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder="Generated SEO metadata will appear here..."
          />
        </div>

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing || metaContent.trim().length === 0}
        >
          {isProcessing ? "Processing..." : "Save Metadata & Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Step8SEO;
