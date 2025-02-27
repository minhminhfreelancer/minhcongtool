import { Button } from "@/components/ui/button";
import { ToolType } from "../ContentWizard";

interface ToolSelectionProps {
  onSelect: (tool: ToolType) => void;
}

const ToolSelection = ({ onSelect }: ToolSelectionProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Select Tool</h2>
        <p className="text-sm text-muted-foreground">
          Choose which tool you want to use
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div 
          className="p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
          onClick={() => onSelect("search")}
        >
          <h3 className="text-lg font-medium mb-2">Search</h3>
          <p className="text-sm text-slate-600">
            Search and fetch results by keyword from different regions
          </p>
        </div>

        <div 
          className="p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
          onClick={() => onSelect("translate-usa")}
        >
          <h3 className="text-lg font-medium mb-2">Translate for USA</h3>
          <p className="text-sm text-slate-600">
            Translate content from Vietnamese to English with US-friendly style
          </p>
        </div>

        <div 
          className="p-6 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
          onClick={() => onSelect("translate-vn")}
        >
          <h3 className="text-lg font-medium mb-2">Translate for Vietnam</h3>
          <p className="text-sm text-slate-600">
            Translate content from English to Vietnamese with local style
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolSelection;
