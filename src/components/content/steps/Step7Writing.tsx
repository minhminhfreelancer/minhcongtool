import { useState, useEffect } from "react";
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

export interface Step7WritingProps {
  modelConfig: ModelConfig;
  onBack: () => void;
  onNext: (content: string) => void;
  partNumber: number;
}

const DEFAULT_PROMPT = `Based on 'KEYWORD.TXT', 'GUIDE.TXT', 'OUTLINE.TXT' and Content Template Type, write section [section name]:
1. HTML format ready for WordPress
2. Include:
   - Paragraph tags
   - Table HTML
   - Image placeholders
   - Affiliate link placeholders
   - Internal link placeholders
3. Optimize readability:
   - Short paragraphs
   - Transition sentences
   - Bullet points when needed
   - Pull quotes
4. Reference researched sources`;

const RECOMMENDED_MODELS = [
  {
    name: "gemini-1.5-pro",
    description: "Best choice - Complex reasoning and analysis",
  },
  {
    name: "gemini-2.0-flash-thinking-exp-01-21",
    description: "Alternative - Specialized in content writing",
  },
];

const Step7Writing = ({
  modelConfig,
  onBack,
  onNext,
  partNumber,
}: Step7WritingProps) => {
  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [currentSection, setCurrentSection] = useState(1);
  const [sectionContent, setSectionContent] = useState("");
  const [allContent, setAllContent] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessSection = async () => {
    setIsProcessing(true);
    try {
      // Add current section to all content
      const newAllContent = [...allContent];
      newAllContent[currentSection - 1] = sectionContent;
      setAllContent(newAllContent);

      if (currentSection < partNumber) {
        // Move to next section
        setCurrentSection(currentSection + 1);
        setSectionContent("");
      } else {
        // Combine all sections and save to CONTENT.TXT
        const finalContent = newAllContent.join("\n\n");
        const contentBlob = new Blob([finalContent], { type: "text/plain" });
        const contentUrl = URL.createObjectURL(contentBlob);
        const a = document.createElement("a");
        a.href = contentUrl;
        a.download = "CONTENT.TXT";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(contentUrl);

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
            Writing section {currentSection} of {partNumber}
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
          <label className="text-sm font-medium">Section Content</label>
          <Textarea
            value={sectionContent}
            onChange={(e) => setSectionContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder={`Write content for section ${currentSection} here...`}
          />
        </div>

        <Button
          onClick={handleProcessSection}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : currentSection < partNumber
              ? "Next Section"
              : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default Step7Writing;
