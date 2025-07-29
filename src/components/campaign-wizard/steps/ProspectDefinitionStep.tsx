
import { useState } from "react";
import { CampaignData } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatInterface } from "./prospect-definition/ChatInterface";

interface ProspectDefinitionStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  campaignId?: string | null;
}

export const ProspectDefinitionStep = ({ campaignData, setCampaignData, campaignId }: ProspectDefinitionStepProps) => {
  const handleApplyFromChat = (chatData: Partial<CampaignData>) => {
    setCampaignData({
      ...campaignData,
      ...chatData
    });
  };

  return (
    <div className="space-y-8">
      {/* Campaign Name Input */}
      <div className="max-w-2xl mx-auto">
        <Label htmlFor="campaignName" className="text-sm font-medium text-foreground mb-3 block">
          Campaign Name *
        </Label>
        <Input
          id="campaignName"
          placeholder="Q1 2024 SaaS Outreach Campaign"
          value={campaignData.name}
          onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
          className="h-11"
        />
      </div>

      {/* Chat Interface - Always Open */}
      <ChatInterface
        isOpen={true}
        onClose={() => {}} // No close functionality needed
        campaignData={campaignData}
        campaignId={campaignId}
        onApplyToForm={handleApplyFromChat}
      />
    </div>
  );
};
