
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Step } from "./types";

interface WizardNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onComplete?: () => void;
  steps: Step[];
}

export const WizardNavigation = ({ 
  currentStep, 
  canProceed, 
  isLoading, 
  onPrevStep, 
  onNextStep,
  onComplete,
  steps
}: WizardNavigationProps) => {
  const isLastStep = currentStep >= steps.length;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <Button
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 1}
        className="order-2 sm:order-1 px-6 py-3 rounded-md border transition-colors duration-200 disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      {isLastStep && onComplete ? (
        <Button
          onClick={onComplete}
          className="order-1 sm:order-2 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200"
        >
          Complete Campaign
        </Button>
      ) : (
        <Button 
          onClick={onNextStep}
          disabled={!canProceed || isLoading}
          className="order-1 sm:order-2 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              {currentStep === 1 ? 'Creating Campaign...' : 'Processing...'}
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
