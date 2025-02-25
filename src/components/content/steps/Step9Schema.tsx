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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface Step9SchemaProps {
  modelConfig: ModelConfig;
  keyword: string;
  contentTypeName: string;
  finalContent: string;
  metaContent: string;
  onBack: () => void;
  onNext: (schemaContent: string) => void;
}

const Step9Schema = ({
  modelConfig,
  keyword,
  contentTypeName,
  finalContent,
  metaContent,
  onBack,
  onNext,
}: Step9SchemaProps) => {
  // Create a FAQs and schema generation prompt using available data
  const DEFAULT_PROMPT = `Based on the keyword "${keyword || "[KEYWORD]"}" and content type "${contentTypeName || "[CONTENT_TYPE]"}", generate the following:

1. FAQ Section
   a. Extract potential questions from "People Also Ask" for "${keyword || "[KEYWORD]"}"
   b. For each question:
      - Provide a clear, concise answer (50-75 words)
      - Include relevant keywords naturally
      - Ensure answers are factually accurate and helpful
   c. Create 3-5 additional relevant questions and answers that users might have

2. Schema Markup
   a. Generate complete JSON-LD schema markup for:
      - Article Schema (or appropriate content type)
      - FAQ Schema (using the questions/answers from above)
      - BreadcrumbList Schema
      - Organization Schema
      
   b. If applicable based on content type, also include:
      - Product Schema (for product reviews)
      - HowTo Schema (for instructional content)
      - Review Schema (for review content)

Ensure all schema is properly nested, valid JSON-LD format, and follows Schema.org standards.`;

  const RECOMMENDED_MODELS = [
    {
      name: "gemini-1.5-pro",
      description: "Best choice - Complex reasoning and analysis",
    },
    {
      name: "claude-3-5-sonnet",
      description: "Alternative - Specialized in schema generation",
    },
  ];

  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [schemaContent, setSchemaContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchemas, setGeneratedSchemas] = useState<{
    [key: string]: string;
  }>({});
  const [activeTab, setActiveTab] = useState<string>("faq");

  // Extract title from metadata if available
  const extractTitle = (): string => {
    if (!metaContent) return keyword || "";
    const titleMatch = metaContent.match(
      /Title Tag Options[\s\S]*?1\. "([^"]+)"/,
    );
    return titleMatch ? titleMatch[1] : keyword || "";
  };

  // Set initial prompt with data
  useEffect(() => {
    if (keyword) {
      setPrompt(DEFAULT_PROMPT);
    }
  }, [keyword, contentTypeName]);

  const handleGenerateSchema = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI API
      // For now, we'll simulate generation with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const title = extractTitle();

      // Generate sample FAQ content
      const faqContent = `# FAQ Section for "${keyword}"

## Frequently Asked Questions

### Q1: What are the best ${keyword} for beginners?
**Answer:** For beginners, look for ${keyword} with user-friendly features, durability, and good value. Top recommendations include Brand X Model A, which offers excellent support and ease of use, and Brand Y Model B, known for its reliability and simplified controls.

### Q2: How much should I expect to spend on quality ${keyword}?
**Answer:** Quality ${keyword} typically range from $50-$300 depending on features and brand. Entry-level options with basic functionality cost $50-$100, mid-range options with better performance run $100-$200, while premium ${keyword} with advanced features cost $200-$300+.

### Q3: What features are most important when choosing ${keyword}?
**Answer:** When selecting ${keyword}, prioritize durability, comfort, compatibility with your specific needs, and warranty coverage. Additional important features include ergonomic design, energy efficiency, and ease of maintenance depending on your intended use case.

### Q4: How long do ${keyword} typically last?
**Answer:** Quality ${keyword} generally last 3-7 years with proper maintenance. Factors affecting lifespan include frequency of use, maintenance routine, initial build quality, and environmental conditions. Premium models with higher-grade materials may extend to 8-10 years of reliable service.

### Q5: Can I use ${keyword} for professional purposes?
**Answer:** Yes, many ${keyword} are suitable for professional use, but look specifically for models labeled "professional" or "commercial grade." These versions offer enhanced durability, better performance under continuous use, and often come with extended warranties designed for business applications.`;

      // Generate sample JSON-LD schema
      const articleSchema = `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${title}",
  "description": "Comprehensive guide to finding the best ${keyword} with expert reviews and buying advice.",
  "image": "https://example.com/images/${keyword.replace(/\s+/g, "-")}.jpg",
  "author": {
    "@type": "Person",
    "name": "Expert Author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Website",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "${new Date().toISOString().split("T")[0]}",
  "dateModified": "${new Date().toISOString().split("T")[0]}"
}`;

      const faqSchema = `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the best ${keyword} for beginners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For beginners, look for ${keyword} with user-friendly features, durability, and good value. Top recommendations include Brand X Model A, which offers excellent support and ease of use, and Brand Y Model B, known for its reliability and simplified controls."
      }
    },
    {
      "@type": "Question",
      "name": "How much should I expect to spend on quality ${keyword}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quality ${keyword} typically range from $50-$300 depending on features and brand. Entry-level options with basic functionality cost $50-$100, mid-range options with better performance run $100-$200, while premium ${keyword} with advanced features cost $200-$300+."
      }
    },
    {
      "@type": "Question",
      "name": "What features are most important when choosing ${keyword}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When selecting ${keyword}, prioritize durability, comfort, compatibility with your specific needs, and warranty coverage. Additional important features include ergonomic design, energy efficiency, and ease of maintenance depending on your intended use case."
      }
    },
    {
      "@type": "Question",
      "name": "How long do ${keyword} typically last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Quality ${keyword} generally last 3-7 years with proper maintenance. Factors affecting lifespan include frequency of use, maintenance routine, initial build quality, and environmental conditions. Premium models with higher-grade materials may extend to 8-10 years of reliable service."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use ${keyword} for professional purposes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, many ${keyword} are suitable for professional use, but look specifically for models labeled \\"professional\\" or \\"commercial grade.\\" These versions offer enhanced durability, better performance under continuous use, and often come with extended warranties designed for business applications."
      }
    }
  ]
}`;

      const breadcrumbSchema = `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "${contentTypeName || "Guides"}",
      "item": "https://example.com/guides/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "${title}",
      "item": "https://example.com/guides/${keyword.replace(/\s+/g, "-").toLowerCase()}/"
    }
  ]
}`;

      // For product reviews
      const reviewSchema = contentTypeName.toLowerCase().includes("review")
        ? `{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "Top-rated ${keyword}",
    "image": "https://example.com/images/${keyword.replace(/\s+/g, "-")}.jpg",
    "description": "High-quality ${keyword} with excellent features and performance.",
    "brand": {
      "@type": "Brand",
      "name": "Leading Brand"
    }
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4.8",
    "bestRating": "5"
  },
  "author": {
    "@type": "Person",
    "name": "Expert Reviewer"
  },
  "datePublished": "${new Date().toISOString().split("T")[0]}"
}`
        : "";

      // Store generated schemas
      const schemas = {
        faq: faqContent,
        article: articleSchema,
        faqSchema: faqSchema,
        breadcrumb: breadcrumbSchema,
      };

      if (reviewSchema) {
        schemas["review"] = reviewSchema;
      }

      setGeneratedSchemas(schemas);

      // Combine all schema for the main content
      const combinedContent = `# Schema Markup for "${keyword}"

## FAQ Content
${faqContent}

## JSON-LD Schema Markup

### Article Schema
\`\`\`json
${articleSchema}
\`\`\`

### FAQ Schema
\`\`\`json
${faqSchema}
\`\`\`

### Breadcrumb Schema
\`\`\`json
${breadcrumbSchema}
\`\`\`
${
  reviewSchema
    ? `
### Review Schema
\`\`\`json
${reviewSchema}
\`\`\`
`
    : ""
}

## Implementation Instructions
1. Add the FAQ section to your content, ideally after the main article content.
2. Place the JSON-LD schema in the <head> section of your HTML or via Google Tag Manager.
3. You can combine all schemas into a single script tag or use separate script tags.

Example implementation:
\`\`\`html
<script type="application/ld+json">
[
  ${articleSchema},
  ${faqSchema},
  ${breadcrumbSchema}${
    reviewSchema
      ? `,
  ${reviewSchema}`
      : ""
  }
]
</script>
\`\`\``;

      setSchemaContent(combinedContent);
    } catch (error) {
      console.error("Error generating schema:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Move to next step with the schema content
      onNext(schemaContent);
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
          <h2 className="text-2xl font-semibold">Step 9: Schema Markup</h2>
          <p className="text-sm text-muted-foreground">
            Generate FAQ content and schema markup for SEO
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
            <h3 className="font-medium text-blue-800">Schema Generation</h3>
            <p className="text-sm text-blue-700">
              Creating structured data helps search engines understand your
              content and can enhance your search listings with rich results.
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Content Type:{" "}
              <span className="font-semibold">{contentTypeName}</span>
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
              onClick={handleGenerateSchema}
              disabled={isGenerating}
              className="gap-1 h-8"
            >
              <PencilLine className="h-3.5 w-3.5" />
              {isGenerating ? "Generating..." : "Generate Schema"}
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
            Schema Generation Prompt
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        {Object.keys(generatedSchemas).length > 0 && (
          <Accordion
            type="single"
            collapsible
            defaultValue="faq"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <AccordionItem value="faq">
              <AccordionTrigger className="text-sm font-medium">
                FAQ Content
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={generatedSchemas.faq || ""}
                  onChange={(e) => {
                    setGeneratedSchemas({
                      ...generatedSchemas,
                      faq: e.target.value,
                    });

                    // Also update the main schema content
                    setSchemaContent(
                      schemaContent.replace(
                        /## FAQ Content\n(.*?)(?=\n## JSON-LD Schema Markup)/s,
                        `## FAQ Content\n${e.target.value}\n`,
                      ),
                    );
                  }}
                  className="min-h-[200px] font-mono text-sm"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="article">
              <AccordionTrigger className="text-sm font-medium">
                Article Schema
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={generatedSchemas.article || ""}
                  onChange={(e) => {
                    setGeneratedSchemas({
                      ...generatedSchemas,
                      article: e.target.value,
                    });
                  }}
                  className="min-h-[200px] font-mono text-sm"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faqSchema">
              <AccordionTrigger className="text-sm font-medium">
                FAQ Schema
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={generatedSchemas.faqSchema || ""}
                  onChange={(e) => {
                    setGeneratedSchemas({
                      ...generatedSchemas,
                      faqSchema: e.target.value,
                    });
                  }}
                  className="min-h-[200px] font-mono text-sm"
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="breadcrumb">
              <AccordionTrigger className="text-sm font-medium">
                Breadcrumb Schema
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={generatedSchemas.breadcrumb || ""}
                  onChange={(e) => {
                    setGeneratedSchemas({
                      ...generatedSchemas,
                      breadcrumb: e.target.value,
                    });
                  }}
                  className="min-h-[200px] font-mono text-sm"
                />
              </AccordionContent>
            </AccordionItem>

            {generatedSchemas.review && (
              <AccordionItem value="review">
                <AccordionTrigger className="text-sm font-medium">
                  Review Schema
                </AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    value={generatedSchemas.review || ""}
                    onChange={(e) => {
                      setGeneratedSchemas({
                        ...generatedSchemas,
                        review: e.target.value,
                      });
                    }}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Complete Schema Package</label>
          <Textarea
            value={schemaContent}
            onChange={(e) => setSchemaContent(e.target.value)}
            className="min-h-[250px] font-mono text-sm"
            placeholder="Generated schema content will appear here..."
          />
          <p className="text-xs text-slate-500">
            This includes FAQ content and all schema markup types appropriate
            for your content.
          </p>
        </div>

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing || schemaContent.trim().length === 0}
        >
          {isProcessing ? "Processing..." : "Save Schema & Continue"}
        </Button>
      </div>
    </div>
  );
};

export default Step9Schema;
