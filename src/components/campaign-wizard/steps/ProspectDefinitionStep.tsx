
import { CampaignData } from "../types";
import { ProspectHeroSection } from "./prospect-definition/ProspectHeroSection";
import { ProspectFormFields } from "./prospect-definition/ProspectFormFields";
import { AIHelperCard } from "./prospect-definition/AIHelperCard";
import { ProcessPreviewCard } from "./prospect-definition/ProcessPreviewCard";

interface ProspectDefinitionStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const ProspectDefinitionStep = ({ campaignData, setCampaignData }: ProspectDefinitionStepProps) => {
  return (
    <div className="space-y-12">
      <ProspectHeroSection />
      <ProspectFormFields campaignData={campaignData} setCampaignData={setCampaignData} />
      <AIHelperCard />
      <ProcessPreviewCard />
    </div>
  );
};
