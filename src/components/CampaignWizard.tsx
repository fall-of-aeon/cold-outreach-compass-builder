
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
    n8nWebhookUrl: "",
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
      // Validate required fields
      if (!campaignData.name || !campaignData.location || !campaignData.industry || 
          !campaignData.seniority || !campaignData.companySize || !campaignData.n8nWebhookUrl) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields including n8n webhook URL.",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);
      
      try {
        // 1. Create campaign in Supabase
        const campaign = await createCampaignMutation.mutateAsync({
          name: campaignData.name,
          location: campaignData.location,
          industry: campaignData.industry,
          seniority: campaignData.seniority,
          company_size: campaignData.companySize,
          prospect_description: campaignData.prospectDescription,
          n8n_webhook_url: campaignData.n8nWebhookUrl
        });

        setCreatedCampaignId(campaign.id);

        // 2. Trigger n8n workflow securely via edge function
        const n8nSuccess = await triggerN8nWorkflow(campaign.id, campaignData);
        
        if (!n8nSuccess) {
          toast({
            title: "n8n Integration Warning",
            description: "Campaign created but n8n workflow may not have started. Check your webhook URL.",
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
               Boolean(campaignData.n8nWebhookUrl) &&
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
          createdCampaignId={createdCampaignId}
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
          onComplete={handleComplete}
          steps={steps}
        />
      </div>
    </div>
  );
};
