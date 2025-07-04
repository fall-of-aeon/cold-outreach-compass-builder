
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CampaignData, CampaignWizardProps } from "./campaign-wizard/types";
import { steps } from "./campaign-wizard/data";
import { WizardHeader } from "./campaign-wizard/WizardHeader";
import { WizardProgressBar } from "./campaign-wizard/WizardProgressBar";
import { WizardNavigation } from "./campaign-wizard/WizardNavigation";
import { StepRenderer } from "./campaign-wizard/StepRenderer";
import { useCampaignCreation } from "./campaign-wizard/CampaignCreationHandler";
import { useWizardValidation } from "./campaign-wizard/WizardValidation";

export const CampaignWizard = ({ onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    location: "",
    industry: "",
    seniority: "",
    companySize: "",
    prospectDescription: "",
    enrichmentStatus: 'pending',
    qualifiedLeads: 0,
    emailsSent: 0,
    openRate: 0,
    replyRate: 0,
    bounceRate: 0
  });

  const { createCampaign, isLoading } = useCampaignCreation();
  const { canProceed } = useWizardValidation(campaignData, currentStep, createdCampaignId);

  const nextStep = async () => {
    if (currentStep === 1) {
      await createCampaign(
        campaignData,
        (campaignId) => {
          setCreatedCampaignId(campaignId);
          setCurrentStep(currentStep + 1);
        },
        () => {
          // Error handling is done in the hook
        }
      );
    } else {
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
      description: "Your n8n workflow is processing leads. Check your dashboard for updates.",
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl">
        <WizardHeader 
          currentStep={currentStep}
          steps={steps}
          onClose={onClose}
          createdCampaignId={createdCampaignId}
          campaignData={campaignData}
        />

        <WizardProgressBar 
          currentStep={currentStep}
          steps={steps}
          campaignData={campaignData}
          createdCampaignId={createdCampaignId}
        />

        {/* Step Content */}
        <Card className="border bg-card/50 backdrop-blur-sm shadow-sm mb-8 animate-fade-in">
          <CardContent className="p-6 sm:p-8">
            <StepRenderer
              currentStep={currentStep}
              campaignData={campaignData}
              setCampaignData={setCampaignData}
              campaignId={createdCampaignId}
              onNext={nextStep}
              onComplete={handleComplete}
            />
          </CardContent>
        </Card>

        <WizardNavigation 
          currentStep={currentStep}
          canProceed={canProceed()}
          isLoading={isLoading}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onComplete={handleComplete}
          steps={steps}
        />
      </div>
    </div>
  );
};
