
import { CampaignData } from "./types";

export const useWizardValidation = (campaignData: CampaignData, currentStep: number, createdCampaignId: string | null) => {
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

  return { canProceed };
};
