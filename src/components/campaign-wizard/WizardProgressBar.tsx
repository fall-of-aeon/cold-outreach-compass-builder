
import { Progress } from "@/components/ui/progress";
import { Step } from "./types";

interface WizardProgressBarProps {
  currentStep: number;
  steps: Step[];
}

export const WizardProgressBar = ({ currentStep, steps }: WizardProgressBarProps) => {
  return (
    <div className="mb-20">
      <div className="relative mb-12">
        <Progress 
          value={(currentStep / steps.length) * 100} 
          className="h-1 bg-slate-100" 
        />
      </div>
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col items-center transition-all duration-300 ${
              index + 1 <= currentStep 
                ? "text-slate-900" 
                : "text-slate-400"
            }`}
          >
            <div className={`w-2 h-2 rounded-full mb-4 transition-all duration-300 ${
              index + 1 <= currentStep 
                ? "bg-slate-900" 
                : "bg-slate-300"
            }`}></div>
            <span className="text-sm font-medium text-center max-w-24">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
