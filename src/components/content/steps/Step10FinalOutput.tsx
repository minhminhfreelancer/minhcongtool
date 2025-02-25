import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Copy,
  Download,
  Check,
  Share,
  Clipboard,
  Share2,
} from "lucide-react";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Step10FinalOutputProps {
  modelConfig: ModelConfig;
  keyword: string;
  contentTypeName: string;
  finalContent: string;
  metaContent: string;
  schemaContent: string;
  styleGuide: string;
  contentOutline: string;
  onBack: () => void;
  onFinish: () => void;
}

const Step10FinalOutput = ({
  modelConfig,
  keyword,
  contentTypeName,
  finalContent,
  metaContent,
  schemaContent,
  styleGuide,
  contentOutline,
  onBack,
  onFinish,
}: Step10FinalOutputProps) => {
  const [activeTab, setActiveTab] = useState("content");
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: boolean }>({});
  const [wordCount, setWordCount] = useState(0);
  const [exportFormat, setExportFormat] = useState("markdown"); // markdown, html, or plain

  // Calculate word count
  useEffect(() => {
    if (finalContent) {
      const text = finalContent.replace(/<[^>]*>/g, " "); // Remove HTML tags
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
    }
  }, [finalContent]);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);

    // Set copy status for this section
    setCopyStatus({ ...copyStatus, [section]: true });

    // Reset copy status after 2 seconds
    setTimeout(() => {
      setCopyStatus({ ...copyStatus, [section]: false });
    }, 2000);
  };

  const handleDownloadAll = () => {
    // Format the content based on selected export format
    let formattedContent;

    if (exportFormat === "html") {
      // Create an HTML file with proper structure
      formattedContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${extractTitle()}</title>
    
    <!-- Meta Tags -->
    ${formatMetaTags()}
    
    <!-- Schema Markup -->
    <script type="application/ld+json">
    ${extractSchemaJson()}
    </script>
</head>
<body>
    <article>
        ${finalContent}
    </article>
    
    <!-- FAQ Section -->
    <section class="faq-section">
        ${extractFaqHtml()}
    </section>
</body>
</html>`;
    } else if (exportFormat === "markdown") {
      // Create a markdown file with all sections
      formattedContent = `# ${extractTitle()}

${finalContent}

## FAQ Section
${extractFaqMarkdown()}

## Metadata
\`\`\`
${metaContent}
\`\`\`

## Schema
\`\`\`json
${extractSchemaJson()}
\`\`\`

## Content Information
- Keyword: ${keyword}
- Content Type: ${contentTypeName}
- Word Count: ${wordCount}
`;
    } else {
      // Plain text format
      formattedContent =
        `TITLE: ${extractTitle()}\n\n` +
        `CONTENT:\n${finalContent.replace(/<[^>]*>/g, "")}\n\n` +
        `FAQ SECTION:\n${extractFaqText()}\n\n` +
        `METADATA:\n${metaContent}\n\n` +
        `SCHEMA:\n${schemaContent}\n\n` +
        `CONTENT INFORMATION:\n` +
        `- Keyword: ${keyword}\n` +
        `- Content Type: ${contentTypeName}\n` +
        `- Word Count: ${wordCount}`;
    }

    // Create filename based on keyword
    const filename = `${keyword.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.${exportFormat === "html" ? "html" : exportFormat === "markdown" ? "md" : "txt"}`;

    // Create and download file
    const blob = new Blob([formattedContent], {
      type: exportFormat === "html" ? "text/html" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper function to extract title from metadata
  const extractTitle = (): string => {
    if (!metaContent) return keyword || "Content Title";
    const titleMatch = metaContent.match(
      /Title Tag Options[\s\S]*?1\. "([^"]+)"/,
    );
    return titleMatch ? titleMatch[1] : keyword || "Content Title";
  };

  // Helper function to extract meta tags in HTML format
  const formatMetaTags = (): string => {
    if (!metaContent) return "";

    let metaTags = "";

    // Extract meta description
    const descMatch = metaContent.match(
      /Meta Description Options[\s\S]*?1\. "([^"]+)"/,
    );
    if (descMatch) {
      metaTags += `    <meta name="description" content="${descMatch[1]}">\n`;
    }

    // Extract social media title
    const socialTitleMatch = metaContent.match(
      /Social Media Title[\s\S]*?"([^"]+)"/,
    );
    if (socialTitleMatch) {
      metaTags += `    <meta property="og:title" content="${socialTitleMatch[1]}">\n`;
      metaTags += `    <meta name="twitter:title" content="${socialTitleMatch[1]}">\n`;
    }

    // Extract Facebook description
    const fbDescMatch = metaContent.match(
      /Facebook\/LinkedIn Description[\s\S]*?"([^"]+)"/,
    );
    if (fbDescMatch) {
      metaTags += `    <meta property="og:description" content="${fbDescMatch[1]}">\n`;
    }

    // Extract Twitter description
    const twitterDescMatch = metaContent.match(
      /Twitter Card Description[\s\S]*?"([^"]+)"/,
    );
    if (twitterDescMatch) {
      metaTags += `    <meta name="twitter:description" content="${twitterDescMatch[1]}">\n`;
    }

    // Add canonical URL
    const canonicalMatch = metaContent.match(
      /Canonical URL[\s\S]*?(https?:\/\/[^\s]+)/,
    );
    if (canonicalMatch) {
      metaTags += `    <link rel="canonical" href="${canonicalMatch[1]}">\n`;
    }

    return metaTags;
  };

  // Helper function to extract FAQ section in HTML format
  const extractFaqHtml = (): string => {
    if (!schemaContent) return "";

    // Try to extract FAQ content
    const faqMatch = schemaContent.match(
      /## FAQ Content\s+([\s\S]*?)(?=\n## JSON-LD Schema Markup)/,
    );
    if (!faqMatch) return "";

    const faqContent = faqMatch[1];

    // Convert to HTML
    let html = '<div class="faq-container">\n';

    // Match each Q&A pair
    const qaRegex = /### (Q\d+: .+?)\n\*\*Answer:\*\* (.+?)(?=\n\n|\n###|$)/gs;
    let match;

    while ((match = qaRegex.exec(faqContent)) !== null) {
      const question = match[1].replace(/^Q\d+: /, "");
      const answer = match[2];

      html += `    <div class="faq-item">
        <h3 class="faq-question">${question}</h3>
        <div class="faq-answer">
            <p>${answer}</p>
        </div>
    </div>\n`;
    }

    html += "</div>";
    return html;
  };

  // Helper function to extract FAQ section in Markdown format
  const extractFaqMarkdown = (): string => {
    if (!schemaContent) return "";

    // Try to extract FAQ content
    const faqMatch = schemaContent.match(
      /## FAQ Content\s+([\s\S]*?)(?=\n## JSON-LD Schema Markup)/,
    );
    if (!faqMatch) return "";

    return faqMatch[1];
  };

  // Helper function to extract FAQ section in plain text
  const extractFaqText = (): string => {
    if (!schemaContent) return "";

    // Try to extract FAQ content
    const faqMatch = schemaContent.match(
      /## FAQ Content\s+([\s\S]*?)(?=\n## JSON-LD Schema Markup)/,
    );
    if (!faqMatch) return "";

    // Convert markdown to plain text
    return faqMatch[1]
      .replace(/### (Q\d+: .+?)\n\*\*Answer:\*\* /g, "$1\n") // Convert headers and bold to plain text
      .replace(/\*\*/g, ""); // Remove remaining bold markers
  };

  // Helper function to extract schema JSON
  const extractSchemaJson = (): string => {
    if (!schemaContent) return "{}";

    // Try to extract article schema
    const articleMatch = schemaContent.match(
      /### Article Schema\s+```json\s+([\s\S]*?)```/,
    );
    const faqMatch = schemaContent.match(
      /### FAQ Schema\s+```json\s+([\s\S]*?)```/,
    );
    const breadcrumbMatch = schemaContent.match(
      /### Breadcrumb Schema\s+```json\s+([\s\S]*?)```/,
    );

    // Combine available schemas
    const schemas = [];
    if (articleMatch) schemas.push(articleMatch[1]);
    if (faqMatch) schemas.push(faqMatch[1]);
    if (breadcrumbMatch) schemas.push(breadcrumbMatch[1]);

    if (schemas.length === 0) return "{}";

    if (schemas.length === 1) return schemas[0];

    // Return an array of schemas
    return `[\n${schemas.join(",\n")}\n]`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Step 10: Final Output</h2>
          <p className="text-sm text-muted-foreground">
            Review and export the complete content package
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{extractTitle()}</CardTitle>
          <CardDescription>
            {contentTypeName} • {wordCount} words • Keyword: {keyword}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Content:</span>
            <span className="font-medium">
              {Math.round(finalContent.length / 100) / 10}KB
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Metadata:</span>
            <span className="font-medium">
              {Math.round(metaContent.length / 100) / 10}KB
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Schema:</span>
            <span className="font-medium">
              {Math.round(schemaContent.length / 100) / 10}KB
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 mb-2">
        <div className="flex items-center space-x-1">
          <span className="text-sm">Export as:</span>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="text-sm border rounded p-1"
          >
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="plain">Plain Text</option>
          </select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadAll}
          className="gap-2"
        >
          <Download className="h-4 w-4" /> Download All
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="meta">Metadata</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="faq">FAQ Section</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(finalContent, "content")}
              className="gap-2"
            >
              {copyStatus["content"] ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </Button>
          </div>
          <div
            className="border rounded-md p-4 min-h-[400px] overflow-auto"
            dangerouslySetInnerHTML={{ __html: finalContent }}
          />
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(metaContent, "meta")}
              className="gap-2"
            >
              {copyStatus["meta"] ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={metaContent}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(schemaContent, "schema")}
              className="gap-2"
            >
              {copyStatus["schema"] ? (
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
              onClick={() => handleCopy(extractSchemaJson(), "json")}
              className="gap-2"
            >
              {copyStatus["json"] ? (
                <>
                  <Check className="h-4 w-4" /> JSON Copied
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" /> Copy JSON Only
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={schemaContent}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(extractFaqMarkdown(), "faq")}
              className="gap-2"
            >
              {copyStatus["faq"] ? (
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
              onClick={() => handleCopy(extractFaqHtml(), "faqHtml")}
              className="gap-2"
            >
              {copyStatus["faqHtml"] ? (
                <>
                  <Check className="h-4 w-4" /> HTML Copied
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" /> Copy as HTML
                </>
              )}
            </Button>
          </div>
          <div className="border rounded-md p-4 min-h-[400px] overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: extractFaqHtml() }} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleDownloadAll}
            className="gap-2"
          >
            <Download className="h-4 w-4" /> Download All
          </Button>
          <Button onClick={onFinish}>Finish</Button>
        </div>
      </div>
    </div>
  );
};

export default Step10FinalOutput;
