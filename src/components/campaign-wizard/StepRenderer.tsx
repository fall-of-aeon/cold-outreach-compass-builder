
import { CampaignData } from "./types";
import { ProspectDefinitionStep } from "./steps/ProspectDefinitionStep";
import { LeadEnrichmentStep } from "./steps/LeadEnrichmentStep";
import { EmailReviewStep } from "./steps/EmailReviewStep";
import { CampaignMonitorStep } from "./steps/CampaignMonitorStep";

interface StepRendererProps {
  currentStep: number;
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  campaignId: string | null;
  onNext: () => void;
  onComplete: () => void;
}

export const StepRenderer = ({ 
  currentStep, 
  campaignData, 
  setCampaignData, 
  campaignId, 
  onNext, 
  onComplete 
}: StepRendererProps) => {
  switch (currentStep) {
    case 1:
      return <ProspectDefinitionStep campaignData={campaignData} setCampaignData={setCampaignData} />;
    case 2:
      return <LeadEnrichmentStep 
        campaignData={campaignData} 
        setCampaignData={setCampaignData} 
        campaignId={campaignId}
        onNext={onNext} 
      />;
    case 3:
      return <EmailReviewStep onNext={onNext} />;
    case 4:
      return <CampaignMonitorStep campaignData={campaignData} onComplete={onComplete} />;
    default:
      return null;
  }
};
