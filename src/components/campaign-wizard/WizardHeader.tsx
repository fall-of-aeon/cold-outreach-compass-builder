
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Step } from "./types";

interface WizardHeaderProps {
  currentStep: number;
  steps: Step[];
  onClose: () => void;
  createdCampaignId?: string | null;
}

export const WizardHeader = ({ currentStep, steps, onClose, createdCampaignId }: WizardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center space-x-6">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="hover:scale-110 transition-all duration-300 hover:bg-white/50 backdrop-blur-sm rounded-full p-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-5xl font-light text-slate-900 mb-2 tracking-tight">
            Create Campaign
          </h1>
          <p className="text-lg text-slate-600 font-light">
            {createdCampaignId 
              ? `Campaign ID: ${createdCampaignId.slice(0, 8)}...` 
              : "Set up your automated outreach campaign"
            }
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-slate-500 mb-1">Step {currentStep} of {steps.length}</div>
        <div className="text-xl font-medium text-slate-900">{steps[currentStep - 1]?.title}</div>
      </div>
    </div>
  );
};
