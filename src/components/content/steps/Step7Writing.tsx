import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, PencilLine, Save } from "lucide-react";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Step7WritingProps {
  modelConfig: ModelConfig;
  keyword: string;
  contentTypeName: string;
  styleGuide: string;
  contentOutline: string;
  onBack: () => void;
  onNext: (content: string) => void;
  partNumber: number;
}

const Step7Writing = ({
  modelConfig,
  keyword,
  contentTypeName,
  styleGuide,
  contentOutline,
  onBack,
  onNext,
  partNumber,
}: Step7WritingProps) => {
  // Extract section titles from the outline
  const getSectionTitles = (outline: string): string[] => {
    const lines = outline.split("\n");
    // Look for H2 headers which are typically section titles
    const h2Pattern = /^##\s+(.+)$|^[0-9]+\.\s+(.+)$/;
    const titles = lines
      .filter((line) => h2Pattern.test(line))
      .map((line) => {
        const match = line.match(h2Pattern);
        return match[1] || match[2];
      });

    // If no section titles found, create generic ones
    if (titles.length === 0) {
      return Array(partNumber)
        .fill(0)
        .map((_, i) => `Section ${i + 1}`);
    }

    // If we have fewer titles than partNumber, add generic ones
    while (titles.length < partNumber) {
      titles.push(`Section ${titles.length + 1}`);
    }

    return titles.slice(0, partNumber);
  };

  const DEFAULT_PROMPT = `Based on the keyword "${keyword || "[KEYWORD]"}" and content type "${contentTypeName || "[CONTENT_TYPE]"}", write the following section:

[SECTION_TITLE]

Follow these guidelines:
1. Use the writing style described in the style guide
2. Include HTML formatting ready for WordPress
3. Format includes:
   - Proper paragraph tags (<p>)
   - Table HTML where appropriate
   - Image placeholders with descriptive alt text
   - Affiliate link placeholders using [AFFILIATE]text[/AFFILIATE]
   - Internal link placeholders using [INTERNAL]text|url[/INTERNAL]
4. Optimize for readability:
   - Use short paragraphs (2-3 sentences max)
   - Include transition sentences between paragraphs
   - Use bullet points or numbered lists when appropriate
   - Include engaging pull quotes for important points
5. Reference researched sources when mentioning facts or statistics
6. Match the tone and style identified in the style guide
7. Follow the outline structure for this section

Write approximately 500-700 words for this section.`;

  const RECOMMENDED_MODELS = [
    {
      name: "gemini-1.5-pro",
      description: "Best choice - Complex reasoning and analysis",
    },
    {
      name: "claude-3-5-sonnet",
      description: "Alternative - Specialized in content writing",
    },
  ];

  const sectionTitles = getSectionTitles(contentOutline);

  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [currentSection, setCurrentSection] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [allContent, setAllContent] = useState<string[]>(
    Array(partNumber).fill(""),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Update prompt when section changes
  useEffect(() => {
    const sectionTitle =
      sectionTitles[currentSection - 1] || `Section ${currentSection}`;
    setPrompt(DEFAULT_PROMPT.replace("[SECTION_TITLE]", sectionTitle));
  }, [currentSection, sectionTitles]);

  const handleGenerateSection = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI API
      // For now, we'll simulate generation with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate sample content based on the prompt and section
      const sectionTitle = sectionTitles[currentSection - 1];
      const simulatedContent = `<h2>${sectionTitle}</h2>
<p>This is generated content for the ${sectionTitle} section about ${keyword}. The content follows the ${contentTypeName} format and adheres to the writing style guidelines provided.</p>

<p>When discussing ${keyword}, it's important to consider several key factors that consumers look for. According to our research, durability, comfort, and price are the top three considerations.</p>

<h3>Key Considerations</h3>
<ul>
  <li>Feature one with detailed explanation</li>
  <li>Feature two with practical examples</li>
  <li>Feature three with comparison to alternatives</li>
</ul>

<p>As noted by [INTERNAL]expert sources|/experts[/INTERNAL], the best ${keyword} options typically include models from leading manufacturers like Brand X and Brand Y.</p>

<table>
  <tr>
    <th>Feature</th>
    <th>Importance</th>
    <th>What to Look For</th>
  </tr>
  <tr>
    <td>Durability</td>
    <td>High</td>
    <td>Materials, construction quality</td>
  </tr>
  <tr>
    <td>Comfort</td>
    <td>High</td>
    <td>Padding, ergonomic design</td>
  </tr>
  <tr>
    <td>Price</td>
    <td>Medium</td>
    <td>Value for money, not just lowest cost</td>
  </tr>
</table>

<blockquote>
  <p>"Finding the perfect ${keyword} isn't just about brand names - it's about finding the right features that match your specific needs."</p>
</blockquote>

<p>If you're looking for the best value option, the [AFFILIATE]Product Z[/AFFILIATE] offers an excellent balance of quality and affordability.</p>

<p>In the next section, we'll explore more specific use cases and scenarios.</p>`;

      setSectionContent(simulatedContent);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSection = () => {
    setIsProcessing(true);
    try {
      // Save current section content
      const newAllContent = [...allContent];
      newAllContent[currentSection - 1] = sectionContent;
      setAllContent(newAllContent);

      if (currentSection < partNumber) {
        // Move to next section
        setCurrentSection(currentSection + 1);
        setSectionContent("");
      } else {
        // Combine all sections
        const finalContent = newAllContent.join("\n\n");

        // Move to next step
        onNext(finalContent);
      }
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
          <h2 className="text-2xl font-semibold">Step 7: Section Writing</h2>
          <p className="text-sm text-muted-foreground">
            Writing section {currentSection} of {partNumber}:{" "}
            {sectionTitles[currentSection - 1]}
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
            <h3 className="font-medium text-blue-800">Writing Progress</h3>
            <Progress
              value={(currentSection / partNumber) * 100}
              className="h-2"
            />
            <p className="text-xs text-blue-700 mt-1">
              Section {currentSection} of {partNumber}:{" "}
              {sectionTitles[currentSection - 1]}
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
              onClick={handleGenerateSection}
              disabled={isGenerating}
              className="gap-1 h-8"
            >
              <PencilLine className="h-3.5 w-3.5" />
              {isGenerating ? "Generating..." : "Generate Section"}
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
          <label className="text-sm font-medium">Generation Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[150px] font-mono text-sm text-slate-600 bg-slate-50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Section Content</label>
          <Textarea
            value={sectionContent}
            onChange={(e) => setSectionContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder={`Write or generate content for section ${currentSection}: ${sectionTitles[currentSection - 1]}...`}
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentSection > 1) {
                // Save current section before moving back
                const newAllContent = [...allContent];
                newAllContent[currentSection - 1] = sectionContent;
                setAllContent(newAllContent);

                // Move to previous section
                setCurrentSection(currentSection - 1);
                setSectionContent(allContent[currentSection - 2]);
              }
            }}
            disabled={currentSection === 1 || isProcessing}
          >
            Previous Section
          </Button>

          <Button
            onClick={handleSaveSection}
            className="gap-2"
            disabled={isProcessing || sectionContent.trim().length === 0}
          >
            <Save className="h-4 w-4" />
            {isProcessing
              ? "Processing..."
              : currentSection < partNumber
                ? "Save & Next Section"
                : "Complete & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step7Writing;
