
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

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(campaignData.location) && 
               Boolean(campaignData.industry) && 
               Boolean(campaignData.seniority) && 
               Boolean(campaignData.companySize);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Subtle geometric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
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
        <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-200/20 mb-12">
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
