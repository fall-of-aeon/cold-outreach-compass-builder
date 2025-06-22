
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Step } from "./types";

interface WizardHeaderProps {
  currentStep: number;
  steps: Step[];
  onClose: () => void;
}

export const WizardHeader = ({ currentStep, steps, onClose }: WizardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-16">
      <div className="flex items-center space-x-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="h-10 w-10 rounded-full hover:bg-slate-100 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-5xl font-light text-slate-900 tracking-tight">
            Create Campaign
          </h1>
          <p className="text-slate-600 mt-3 text-lg font-light">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full">
        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
        <span className="text-sm font-medium text-slate-700">
          Step {currentStep} of {steps.length}
        </span>
      </div>
    </div>
  );
};
