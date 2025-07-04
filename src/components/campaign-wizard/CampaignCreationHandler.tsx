
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useCreateCampaign } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";
import { CampaignData } from "./types";

interface CampaignCreationHandlerProps {
  campaignData: CampaignData;
  onCampaignCreated: (campaignId: string) => void;
  onError: () => void;
}

export const useCampaignCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const createCampaignMutation = useCreateCampaign();

  const createCampaign = async (
    campaignData: CampaignData,
    onSuccess: (campaignId: string) => void,
    onError: () => void
  ) => {
    // Validate required fields
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
      // 1. Create campaign in Supabase
      const campaign = await createCampaignMutation.mutateAsync({
        name: campaignData.name,
        location: campaignData.location,
        industry: campaignData.industry,
        seniority: campaignData.seniority,
        company_size: campaignData.companySize,
        prospect_description: campaignData.prospectDescription
      });

      console.log("✅ Campaign created in Supabase:", campaign.id);

      // 2. Trigger n8n workflow securely via edge function
      const n8nResult = await triggerN8nWorkflow(campaign.id, campaignData);
      
      if (!n8nResult.success) {
        console.error("❌ n8n workflow trigger failed:", n8nResult.error);
        toast({
          title: "n8n Integration Failed",
          description: `Campaign created but workflow failed to start: ${n8nResult.error}`,
          variant: "destructive"
        });
      } else {
        console.log("✅ n8n workflow triggered successfully");
        toast({
          title: "Campaign Created Successfully!",
          description: "n8n workflow has been triggered. Lead processing will begin shortly.",
        });
      }

      setIsLoading(false);
      onSuccess(campaign.id);

    } catch (error) {
      setIsLoading(false);
      console.error('❌ Campaign creation failed:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      });
      onError();
    }
  };

  // Secure n8n workflow trigger function
  const triggerN8nWorkflow = async (campaignId: string, data: CampaignData): Promise<{ success: boolean; error?: string; webhookStatus?: number }> => {
    try {
      console.log("🚀 Triggering n8n workflow securely for campaign:", campaignId);

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
        console.error("❌ Error invoking n8n workflow:", error);
        return { success: false, error: error.message };
      }

      if (result && !result.success) {
        console.error("❌ n8n workflow failed:", result.error);
        return { success: false, error: result.error, webhookStatus: result.webhookStatus };
      }

      console.log("✅ n8n workflow triggered successfully:", result);
      return { success: true, webhookStatus: result?.webhookStatus };
      
    } catch (error: any) {
      console.error("❌ Error triggering n8n workflow:", error);
      return { success: false, error: error.message };
    }
  };

  return { createCampaign, isLoading };
};
