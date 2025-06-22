
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WizardNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const WizardNavigation = ({ 
  currentStep, 
  canProceed, 
  isLoading, 
  onPrevStep, 
  onNextStep 
}: WizardNavigationProps) => {
  if (currentStep >= 4) {
    return null;
  }

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
      
      <Button 
        onClick={onNextStep}
        disabled={!canProceed || isLoading}
        className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-40"
      >
        {isLoading ? "Processing..." : "Continue"}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
