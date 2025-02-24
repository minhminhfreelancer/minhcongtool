import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download } from "lucide-react";
import { ModelConfig } from "../ContentWizard";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Step10FinalOutputProps {
  modelConfig: ModelConfig;
  onBack: () => void;
  onFinish: () => void;
}

const Step10FinalOutput = ({
  modelConfig,
  onBack,
  onFinish,
}: Step10FinalOutputProps) => {
  const [contentText, setContentText] = useState("");
  const [metaText, setMetaText] = useState("");
  const [schemaText, setSchemaText] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    // Simulate loading content from files
    setContentText("[Content from CONTENT.TXT will appear here]");
    setMetaText("[Content from META.TXT will appear here]");
    setSchemaText("[Content from SCHEMA.TXT will appear here]");
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownloadAll = () => {
    const combinedContent = `# Content\n\n${contentText}\n\n# Meta Information\n\n${metaText}\n\n# Schema Markup\n\n${schemaText}`;

    const blob = new Blob([combinedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "final-output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="meta">Meta Info</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(contentText)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
          <Textarea
            value={contentText}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(metaText)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
          <Textarea
            value={metaText}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="schema" className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(schemaText)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
          <Textarea
            value={schemaText}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
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
