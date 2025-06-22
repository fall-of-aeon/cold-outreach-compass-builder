
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CampaignData, CampaignWizardProps } from "./campaign-wizard/types";
import { steps } from "./campaign-wizard/data";
import { ProspectDefinitionStep } from "./campaign-wizard/steps/ProspectDefinitionStep";
import { LeadEnrichmentStep } from "./campaign-wizard/steps/LeadEnrichmentStep";
import { EmailReviewStep } from "./campaign-wizard/steps/EmailReviewStep";
import { CampaignMonitorStep } from "./campaign-wizard/steps/CampaignMonitorStep";
import { apiService } from "./campaign-wizard/apiService";

export const CampaignWizard = ({ onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    location: "",
    industry: "",
    seniority: "",
    companySize: "",
    enrichmentStatus: 'pending',
    qualifiedLeads: 0,
    emailsSent: 0,
    openRate: 0,
    replyRate: 0,
    bounceRate: 0
  });

  const nextStep = async () => {
    if (currentStep === 1) {
      // Send data to backend API before proceeding to next step
      setIsLoading(true);
      const success = await apiService.submitProspectCriteria(campaignData);
      setIsLoading(false);
      
      if (!success) {
        return; // Don't proceed if API request failed
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Campaign Successfully Launched!",
      description: "Your prospects are being contacted via Smartlead. Check your dashboard for updates.",
    });
    onComplete();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return campaignData.location && 
               campaignData.industry && 
               campaignData.seniority && 
               campaignData.companySize;
      case 2:
        return campaignData.enrichmentStatus === 'completed';
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProspectDefinitionStep campaignData={campaignData} setCampaignData={setCampaignData} />;
      case 2:
        return <LeadEnrichmentStep campaignData={campaignData} setCampaignData={setCampaignData} onNext={nextStep} />;
      case 3:
        return <EmailReviewStep onNext={nextStep} />;
      case 4:
        return <CampaignMonitorStep campaignData={campaignData} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-blue-50/30 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
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

        {/* Progress Bar */}
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

        {/* Step Content */}
        <Card className="border border-slate-200 bg-white shadow-sm mb-16">
          <CardContent className="p-12">
            <div>
              {renderStep()}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors duration-200 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={!canProceed() || isLoading}
              className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-40"
            >
              {isLoading ? "Processing..." : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
