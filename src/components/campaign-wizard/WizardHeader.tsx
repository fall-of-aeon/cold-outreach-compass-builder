
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Step } from "./types";

interface WizardHeaderProps {
  currentStep: number;
  steps: Step[];
  onClose: () => void;
  createdCampaignId?: string | null;
}

export const WizardHeader = ({
  currentStep,
  steps,
  onClose,
  createdCampaignId
}: WizardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 lg:mb-12">
      <div className="flex items-start gap-4 sm:gap-6">
        <Button 
          variant="ghost" 
          onClick={onClose} 
          className="hover:bg-accent transition-colors rounded-md p-2 sm:p-3 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-2 tracking-tight text-foreground">
            Create Campaign
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {createdCampaignId ? (
              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                ID: {createdCampaignId.slice(0, 8)}...
              </span>
            ) : (
              "Set up your automated outreach campaign"
            )}
          </p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <div className="text-sm text-muted-foreground mb-1">
          Step {currentStep} of {steps.length}
        </div>
        <div className="text-xl sm:text-2xl font-medium text-foreground">
          {steps[currentStep - 1]?.title}
        </div>
      </div>
    </div>
  );
};
