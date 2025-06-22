
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CampaignData, CampaignWizardProps } from "./campaign-wizard/types";
import { steps } from "./campaign-wizard/data";
import { ProspectDefinitionStep } from "./campaign-wizard/steps/ProspectDefinitionStep";
import { LeadEnrichmentStep } from "./campaign-wizard/steps/LeadEnrichmentStep";
import { EmailReviewStep } from "./campaign-wizard/steps/EmailReviewStep";
import { CampaignMonitorStep } from "./campaign-wizard/steps/CampaignMonitorStep";
import { apiService } from "./campaign-wizard/apiService";
import { WizardHeader } from "./campaign-wizard/WizardHeader";
import { WizardProgressBar } from "./campaign-wizard/WizardProgressBar";
import { WizardNavigation } from "./campaign-wizard/WizardNavigation";

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
        <WizardHeader 
          currentStep={currentStep}
          steps={steps}
          onClose={onClose}
        />

        <WizardProgressBar 
          currentStep={currentStep}
          steps={steps}
        />

        {/* Step Content */}
        <Card className="border border-slate-200 bg-white shadow-sm mb-16">
          <CardContent className="p-12">
            <div>
              {renderStep()}
            </div>
          </CardContent>
        </Card>

        <WizardNavigation 
          currentStep={currentStep}
          canProceed={canProceed()}
          isLoading={isLoading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
        />
      </div>
    </div>
  );
};
