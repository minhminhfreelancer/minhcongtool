import { useState } from "react";
import Step1Config from "./steps/Step1Config";
import Step2Search from "./steps/Step2Search";

export interface ModelConfig {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}

const ContentWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);

  const handleStep1Complete = (config: ModelConfig) => {
    setModelConfig(config);
    setCurrentStep(2);
  };

  const handleStep2Complete = (results: any) => {
    console.log("Search results:", results);
    // Will handle in next step
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {currentStep === 1 && <Step1Config onNext={handleStep1Complete} />}
      {currentStep === 2 && modelConfig && (
        <Step2Search config={modelConfig} onNext={handleStep2Complete} />
      )}
    </div>
  );
};

export default ContentWizard;
