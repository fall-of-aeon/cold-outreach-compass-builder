
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
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-background to-purple-50/20 dark:from-blue-950/20 dark:via-background dark:to-purple-950/10"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <WizardHeader 
          currentStep={currentStep}
          steps={steps}
          onClose={onClose}
          createdCampaignId={createdCampaignId}
        />

        <WizardProgressBar 
          currentStep={currentStep}
          steps={steps}
        />

        {/* Step Content */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-lg mb-8">
          <CardContent className="p-8">
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
