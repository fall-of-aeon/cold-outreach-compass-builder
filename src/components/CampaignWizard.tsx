
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CampaignData, CampaignWizardProps } from "./campaign-wizard/types";
import { steps } from "./campaign-wizard/data";
import { ProspectDefinitionStep } from "./campaign-wizard/steps/ProspectDefinitionStep";
import { LeadEnrichmentStep } from "./campaign-wizard/steps/LeadEnrichmentStep";
import { EmailReviewStep } from "./campaign-wizard/steps/EmailReviewStep";
import { CampaignMonitorStep } from "./campaign-wizard/steps/CampaignMonitorStep";
import { useCreateCampaign } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";
import { WizardHeader } from "./campaign-wizard/WizardHeader";
import { WizardProgressBar } from "./campaign-wizard/WizardProgressBar";
import { WizardNavigation } from "./campaign-wizard/WizardNavigation";

export const CampaignWizard = ({ onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  const createCampaignMutation = useCreateCampaign();

  const nextStep = async () => {
    if (currentStep === 1) {
      // Validate required fields (no longer need webhook URL)
      if (!campaignData.name || !campaignData.location || !campaignData.industry || 
          !campaignData.seniority || !campaignData.companySize) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);
      
      try {
        // 1. Create campaign in Supabase (without n8n_webhook_url)
        const campaign = await createCampaignMutation.mutateAsync({
          name: campaignData.name,
          location: campaignData.location,
          industry: campaignData.industry,
          seniority: campaignData.seniority,
          company_size: campaignData.companySize,
          prospect_description: campaignData.prospectDescription
        });

        setCreatedCampaignId(campaign.id);

        // 2. Trigger n8n workflow securely via edge function
        const n8nSuccess = await triggerN8nWorkflow(campaign.id, campaignData);
        
        if (!n8nSuccess) {
          toast({
            title: "n8n Integration Warning",
            description: "Campaign created but n8n workflow may not have started. Check environment configuration.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Campaign Created Successfully!",
            description: "n8n workflow has been triggered. Lead processing will begin shortly.",
          });
        }

        setIsLoading(false);
        setCurrentStep(currentStep + 1);

      } catch (error) {
        setIsLoading(false);
        console.error('Campaign creation failed:', error);
        toast({
          title: "Error",
          description: "Failed to create campaign. Please try again.",
          variant: "destructive"
        });
        return;
      }
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

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(campaignData.location) && 
               Boolean(campaignData.industry) && 
               Boolean(campaignData.seniority) && 
               Boolean(campaignData.companySize) &&
               Boolean(campaignData.name);
      case 2:
        return createdCampaignId !== null;
      default:
        return true;
    }
  };

  // Secure n8n workflow trigger function
  const triggerN8nWorkflow = async (campaignId: string, data: CampaignData): Promise<boolean> => {
    try {
      console.log("Triggering n8n workflow securely for campaign:", campaignId);

      const { data: result, error } = await supabase.functions.invoke('trigger-n8n-workflow', {
        body: {
          campaignId: campaignId,
          campaignData: {
            name: data.name,
            location: data.location,
            industry: data.industry,
            seniority: data.seniority,
            companySize: data.companySize,
            prospectDescription: data.prospectDescription || ""
          }
        }
      });

      if (error) {
        console.error("Error invoking n8n workflow:", error);
        return false;
      }

      console.log("n8n workflow triggered successfully:", result);
      return true;
    } catch (error) {
      console.error("Error triggering n8n workflow:", error);
      return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProspectDefinitionStep campaignData={campaignData} setCampaignData={setCampaignData} />;
      case 2:
        return <LeadEnrichmentStep 
          campaignData={campaignData} 
          setCampaignData={setCampaignData} 
          campaignId={createdCampaignId}
          onNext={nextStep} 
        />;
      case 3:
        return <EmailReviewStep onNext={nextStep} />;
      case 4:
        return <CampaignMonitorStep campaignData={campaignData} onComplete={handleComplete} />;
      default:
        return null;
    }
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
          onComplete={handleComplete}
          steps={steps}
        />
      </div>
    </div>
  );
};
