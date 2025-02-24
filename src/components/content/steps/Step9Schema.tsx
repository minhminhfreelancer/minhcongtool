import { useState } from "react";
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

export interface Step9SchemaProps {
  modelConfig: ModelConfig;
  onBack: () => void;
  onNext: (schemaContent: string) => void;
}

const DEFAULT_PROMPT = `1. Search Google for "[KEYWORD]" and extract questions from "People Also Ask"
2. For each PAA question:
   - Create 1-2 similar but not identical questions
   - Focus on the same topic but with different wording/perspective
3. Add 3 new relevant questions based on the overall PAA themes
4. Generate schema markup for:
   - Product review schema
   - Article schema
   - FAQ schema (using both PAA-inspired and new questions)
   - Rating schema
   - Price schema`;

const RECOMMENDED_MODELS = [
  {
    name: "gemini-1.5-pro",
    description: "Best choice - Complex reasoning and analysis",
  },
  {
    name: "gemini-2.0-flash-thinking-exp-01-21",
    description: "Alternative - Specialized in schema generation",
  },
];

const Step9Schema = ({ modelConfig, onBack, onNext }: Step9SchemaProps) => {
  const [selectedModel, setSelectedModel] = useState(
    RECOMMENDED_MODELS[0].name,
  );
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [isProcessing, setIsProcessing] = useState(false);

  interface EnhancedQuestion {
    original: string;
    variations: string[];
  }

  const searchPeopleAlsoAsk = async (keyword: string, config: SearchConfig) => {
    try {
      // Search Google with the keyword
      const results = await searchGoogle(
        keyword,
        "us", // Default to US for consistency
        config.apiKey,
        config.searchEngineId,
      );

      // Extract and process PAA questions
      const paaQuestions = results
        .filter((result) => result.snippet.includes("?"))
        .map((result) => {
          const questions = result.snippet
            .split(".")
            .filter((s) => s.includes("?"))
            .map((s) => s.trim());
          return questions;
        })
        .flat()
        .filter((q, i, arr) => arr.indexOf(q) === i); // Remove duplicates

      // Process each question to create variations
      const enhancedQuestions: EnhancedQuestion[] = paaQuestions.map(
        (question) => ({
          original: question,
          variations: [], // Will be filled by AI
        }),
      );

      return enhancedQuestions;
    } catch (error) {
      console.error("Error fetching PAA questions:", error);
      return [];
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      // Save prompt to SCHEMA.TXT
      const promptBlob = new Blob([prompt], { type: "text/plain" });
      const promptUrl = URL.createObjectURL(promptBlob);
      const a = document.createElement("a");
      a.href = promptUrl;
      a.download = "SCHEMA.TXT";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(promptUrl);

      // Move to next step
      onNext(prompt);
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
            Generate schema markup for SEO
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
          <label className="text-sm font-medium">Analysis Command</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Next Step"}
        </Button>
      </div>
    </div>
  );
};

export default Step9Schema;
