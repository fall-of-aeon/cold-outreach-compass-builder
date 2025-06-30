
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
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 1}
        className="px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-200 disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      {isLastStep && onComplete ? (
        <Button
          onClick={onComplete}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          Complete Campaign
        </Button>
      ) : (
        <Button 
          onClick={onNextStep}
          disabled={!canProceed || isLoading}
          className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-40"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
