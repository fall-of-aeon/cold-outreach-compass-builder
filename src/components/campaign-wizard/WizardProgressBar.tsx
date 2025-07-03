
import { Progress } from "@/components/ui/progress";
import { Step } from "./types";

interface WizardProgressBarProps {
  currentStep: number;
  steps: Step[];
}

export const WizardProgressBar = ({
  currentStep,
  steps
}: WizardProgressBarProps) => {
  return (
    <div className="mb-12 lg:mb-20">
      <div className="relative mb-8 lg:mb-12">
        <Progress 
          value={(currentStep / steps.length) * 100} 
          className="h-1 bg-muted" 
        />
      </div>
      <div className="grid grid-cols-2 sm:flex sm:justify-between gap-4 sm:gap-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center transition-all duration-300 ${
              index + 1 <= currentStep ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            <div 
              className={`w-2 h-2 rounded-full mb-3 sm:mb-4 transition-all duration-300 ${
                index + 1 <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
            <span className="text-xs sm:text-sm text-center max-w-20 sm:max-w-24 font-medium leading-tight">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
