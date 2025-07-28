
import { useState } from "react";
import { CampaignData } from "../types";
import { ProspectHeroSection } from "./prospect-definition/ProspectHeroSection";
import { ProspectFormFields } from "./prospect-definition/ProspectFormFields";
import { ChatInterface } from "./prospect-definition/ChatInterface";

interface ProspectDefinitionStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  campaignId?: string | null;
}

export const ProspectDefinitionStep = ({ campaignData, setCampaignData, campaignId }: ProspectDefinitionStepProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleApplyFromChat = (chatData: Partial<CampaignData>) => {
    setCampaignData({
      ...campaignData,
      ...chatData
    });
    setIsChatOpen(false);
  };

  return (
    <div className="space-y-8">
      <ProspectHeroSection onOpenChat={() => setIsChatOpen(true)} />
      <ProspectFormFields campaignData={campaignData} setCampaignData={setCampaignData} />
      
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        campaignData={campaignData}
        campaignId={campaignId}
        onApplyToForm={handleApplyFromChat}
      />
    </div>
  );
};
