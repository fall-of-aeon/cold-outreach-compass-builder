
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import { Step } from "./types";
import { CampaignData } from "./types";

interface WizardProgressBarProps {
  currentStep: number;
  steps: Step[];
  campaignData?: CampaignData;
  createdCampaignId?: string | null;
}

export const WizardProgressBar = ({
  currentStep,
  steps,
  campaignData,
  createdCampaignId
}: WizardProgressBarProps) => {
  
  const getStepCompletion = (stepIndex: number): number => {
    if (!campaignData) return 0;
    
    switch (stepIndex + 1) {
      case 1: // Prospect Definition
        let step1Completion = 0;
        if (campaignData.name) step1Completion += 20;
        if (campaignData.location) step1Completion += 20;
        if (campaignData.industry) step1Completion += 20;
        if (campaignData.seniority) step1Completion += 20;
        if (campaignData.companySize) step1Completion += 20;
        return step1Completion;
      
      case 2: // Lead Enrichment
        return createdCampaignId ? 100 : 0;
      
      case 3: // Email Review
        return currentStep > 3 ? 100 : 0;
      
      case 4: // Campaign Monitor
        return currentStep > 4 ? 100 : 0;
      
      default:
        return 0;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    const stepNumber = stepIndex + 1;
    const completion = getStepCompletion(stepIndex);
    
    if (stepNumber < currentStep) {
      return completion === 100 ? 'completed' : 'partially-completed';
    } else if (stepNumber === currentStep) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const getStepIcon = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partially-completed':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'current':
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStepColor = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'partially-completed':
        return 'text-yellow-600';
      case 'current':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const overallProgress = steps.reduce((acc, _, index) => {
    return acc + getStepCompletion(index);
  }, 0) / steps.length;

  return (
    <div className="mb-12 lg:mb-20">
      {/* Overall Progress Bar */}
      <div className="relative mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Campaign Setup Progress</span>
          <Badge variant="outline" className="text-xs">
            {Math.round(overallProgress)}% Complete
          </Badge>
        </div>
        <Progress 
          value={overallProgress} 
          className="h-2 bg-muted" 
        />
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:flex sm:justify-between gap-4 sm:gap-2">
        {steps.map((step, index) => {
          const completion = getStepCompletion(index);
          const status = getStepStatus(index);
          
          return (
            <div 
              key={index} 
              className={`flex flex-col items-center transition-all duration-300 ${getStepColor(index)}`}
            >
              {/* Step Icon with Progress Ring */}
              <div className="relative mb-3">
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center bg-background">
                  {getStepIcon(index)}
                </div>
                
                {/* Progress Ring for Current/Partial Steps */}
                {(status === 'current' || status === 'partially-completed') && completion > 0 && (
                  <div className="absolute inset-0">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${(completion / 100) * 125.6} 125.6`}
                        className="opacity-30"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Step Number Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-background border border-current rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">{index + 1}</span>
                </div>
              </div>
              
              {/* Step Title and Description */}
              <div className="text-center">
                <span className="text-xs sm:text-sm font-medium leading-tight block mb-1">
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block max-w-24 leading-tight">
                  {step.description}
                </span>
                
                {/* Completion Percentage for Current Step */}
                {status === 'current' && completion > 0 && completion < 100 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {completion}%
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step-specific Progress Details */}
      {currentStep === 1 && campaignData && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-sm font-medium mb-2">Step 1 Progress Details:</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {[
              { label: 'Campaign Name', completed: !!campaignData.name },
              { label: 'Location', completed: !!campaignData.location },
              { label: 'Industry', completed: !!campaignData.industry },
              { label: 'Seniority', completed: !!campaignData.seniority },
              { label: 'Company Size', completed: !!campaignData.companySize }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                {item.completed ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Circle className="h-3 w-3 text-muted-foreground" />
                )}
                <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
