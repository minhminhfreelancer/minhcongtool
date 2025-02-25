import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, PencilLine, Save, HelpCircle } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Step7WritingProps {
  modelConfig: ModelConfig;
  keyword: string;
  contentTypeName: string;
  styleGuide: string;
  contentOutline: string;
  researchContent: string;
  partNumber: number;
  onBack: () => void;
  onNext: (content: string) => void;
}

const Step7Writing = ({
  modelConfig,
  keyword,
  contentTypeName,
  styleGuide,
  contentOutline,
  researchContent,
  onBack,
  onNext,
  partNumber,
}: Step7WritingProps) => {
  // Extract section titles from the outline
  const getSectionTitles = (outline: string): string[] => {
    const lines = outline.split('\n');
    // Look for H2 headers which are typically section titles
    const h2Pattern = /^##\s+(.+)$|^[0-9]+\.\s+(.+)$/;
    const titles = lines
      .filter(line => h2Pattern.test(line))
      .map(line => {
        const match = line.match(h2Pattern);
        return match[1] || match[2];
      });
    
    // If no section titles found, create generic ones
    if (titles.length === 0) {
      return Array(partNumber).fill(0).map((_, i) => `Section ${i + 1}`);
    }
    
    // If we have fewer titles than partNumber, add generic ones
    while (titles.length < partNumber) {
      titles.push(`Section ${titles.length + 1}`);
    }
    
    return titles.slice(0, partNumber);
  };

  // Extract section content for each H2 section
  const getSectionContent = (outline: string, sectionTitle: string): string => {
    const lines = outline.split('\n');
    
    // Find the index of our section title
    const sectionTitlePattern = new RegExp(`^##\\s+${sectionTitle}$|^[0-9]+\\.\\s+${sectionTitle}$`);
    const sectionIndex = lines.findIndex(line => sectionTitlePattern.test(line));
    
    if (sectionIndex === -1) return "";
    
    // Find the next section title or the end of the content
    const nextSectionPattern = /^##\s+|^[0-9]+\.\s+/;
    let nextSectionIndex = lines.findIndex((line, i) => i > sectionIndex && nextSectionPattern.test(line));
    if (nextSectionIndex === -1) nextSectionIndex = lines.length;
    
    // Extract everything between the section title and the next section title
    return lines.slice(sectionIndex + 1, nextSectionIndex).join('\n').trim();
  };

  // This function is no longer used as we're including the full research content
  // Keeping it commented for reference in case there's a need to revert back
  /*
  const getCondensedResearch = (content: string, maxLength: number = 2000): string => {
    if (!content || content.length <= maxLength) return content;
    
    // Get the first part
    const firstPart = content.substring(0, maxLength / 2);
    
    // Get the last part
    const lastPart = content.substring(content.length - maxLength / 2);
    
    return `${firstPart}\n\n[...additional research content omitted for brevity...]\n\n${lastPart}`;
  };
  */

  const buildPrompt = (sectionTitle: string, sectionContent: string): string => {
    return `Based on the following information, write the "${sectionTitle}" section for an article about "${keyword}":

WRITING STYLE GUIDE:
${styleGuide ? styleGuide.substring(0, 1000) : "Use a professional, informative tone appropriate for the subject matter."}

SECTION DETAILS:
${sectionContent || `Write the "${sectionTitle}" section for an article about ${keyword}`}

CONTENT TYPE:
${contentTypeName}

RELEVANT RESEARCH:
${researchContent}

FORMAT REQUIREMENTS:
1. Use HTML formatting: <p>, <h3>, <ul>, <ol>, <li>, <table>, etc.
2. Include necessary HTML structure but focus on quality content
3. Use <h3> for subheadings (not <h2> which is already used for section titles)
4. Create proper paragraph breaks with <p> tags
5. Include:
   - Informative and engaging content
   - Relevant examples where appropriate
   - Bullet or numbered lists where appropriate
   - A table if the data would benefit from tabular format
   - Image suggestions with descriptive alt text using <img src="placeholder.jpg" alt="Description">
6. For links, use:
   - Internal: <a href="#section-name">Link Text</a>
   - External: <a href="https://example.com">Link Text</a>
7. Write approximately 300-500 words for this section, focusing on depth and value

Write the complete "${sectionTitle}" section now, including HTML formatting:`;
  };

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
  
  const [selectedModel, setSelectedModel] = useState(RECOMMENDED_MODELS[0].name);
  const [currentSection, setCurrentSection] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [sectionContent, setSectionContent] = useState("");
  const [allContent, setAllContent] = useState<string[]>(Array(partNumber).fill(""));
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSectionContent, setShowSectionContent] = useState(false);

  // Update prompt when section changes
  useEffect(() => {
    const sectionTitle = sectionTitles[currentSection - 1] || `Section ${currentSection}`;
    const sectionDetails = getSectionContent(contentOutline, sectionTitle);
    setPrompt(buildPrompt(sectionTitle, sectionDetails));
  }, [currentSection, sectionTitles, contentOutline]);

  const handleGenerateSection = async () => {
    setIsGenerating(true);
    try {
      // In a real implementation, this would call an AI API
      // No sample content generation - would be replaced with actual API call
      
      // The content would be returned from the API and set here
      setSectionContent("");
      setShowSectionContent(true);
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
        setShowSectionContent(false);
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
            Writing section {currentSection} of {partNumber}: {sectionTitles[currentSection - 1]}
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
            <Progress value={(currentSection / partNumber) * 100} className="h-2" />
            <p className="text-xs text-blue-700 mt-1">
              Section {currentSection} of {partNumber}: {sectionTitles[currentSection - 1]}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Select Model</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="text-xs">Writing Guide</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-80 p-4">
                  <h5 className="font-medium mb-1">Writing Style Notes</h5>
                  <p className="text-xs leading-relaxed">{styleGuide ? styleGuide.substring(0, 300) + "..." : "No writing style guide available."}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Generation Prompt</label>
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
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[150px] font-mono text-sm text-slate-600 bg-slate-50"
          />
          <p className="text-xs text-slate-500">
            This prompt includes writing style guidelines, research content, and section-specific details.
            It will guide the AI to create well-structured content with proper HTML formatting.
          </p>
        </div>

        {showSectionContent && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Section Content</label>
            <div className="border border-slate-200 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sectionContent }}></div>
            </div>
          </div>
        )}

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
                setShowSectionContent(!!allContent[currentSection - 2]);
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