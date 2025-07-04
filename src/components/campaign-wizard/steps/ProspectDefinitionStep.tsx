
import { CampaignData } from "../types";
import { ProspectHeroSection } from "./prospect-definition/ProspectHeroSection";
import { ProspectFormFields } from "./prospect-definition/ProspectFormFields";
import { InteractiveAudiencePreview } from "./prospect-definition/InteractiveAudiencePreview";
import { SmartRecommendations } from "./prospect-definition/SmartRecommendations";
import { TemplateGallery } from "./prospect-definition/TemplateGallery";

interface ProspectDefinitionStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const ProspectDefinitionStep = ({ campaignData, setCampaignData }: ProspectDefinitionStepProps) => {
  return (
    <div className="space-y-8">
      <ProspectHeroSection />
      <ProspectFormFields campaignData={campaignData} setCampaignData={setCampaignData} />
      <InteractiveAudiencePreview campaignData={campaignData} />
      <SmartRecommendations campaignData={campaignData} setCampaignData={setCampaignData} />
      <TemplateGallery campaignData={campaignData} setCampaignData={setCampaignData} />
    </div>
  );
};
