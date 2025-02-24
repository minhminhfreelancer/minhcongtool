import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export interface ModelSettings {
  temperature: number;
  topP: number;
  maxTokens: number;
}

export interface SettingsPanelProps {
  settings: ModelSettings;
  onSettingsChange: (settings: ModelSettings) => void;
}

const SettingsPanel = ({ settings, onSettingsChange }: SettingsPanelProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-700">
          Temperature: {settings.temperature}
        </Label>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[settings.temperature]}
          onValueChange={([value]) =>
            onSettingsChange({ ...settings, temperature: value })
          }
          className="[&_[role=slider]]:bg-blue-600"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">Top P: {settings.topP}</Label>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[settings.topP]}
          onValueChange={([value]) =>
            onSettingsChange({ ...settings, topP: value })
          }
          className="[&_[role=slider]]:bg-blue-600"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">
          Max Tokens: {settings.maxTokens}
        </Label>
        <Slider
          min={1}
          max={32000}
          step={1}
          value={[settings.maxTokens]}
          onValueChange={([value]) =>
            onSettingsChange({ ...settings, maxTokens: value })
          }
          className="[&_[role=slider]]:bg-blue-600"
        />
      </div>
    </div>
  );
};

export default SettingsPanel;
