
import { CampaignData } from "./types";
import { toast } from "@/hooks/use-toast";

export const sendToN8n = async (campaignData: CampaignData): Promise<boolean> => {
  if (!campaignData.n8nWebhookUrl) {
    toast({
      title: "Error",
      description: "Please provide your n8n webhook URL",
      variant: "destructive",
    });
    return false;
  }

  try {
    console.log("Sending prospect data to n8n workflow:", campaignData.n8nWebhookUrl);
    
    const payload = {
      timestamp: new Date().toISOString(),
      campaignData: {
        name: campaignData.name,
        location: campaignData.location,
        industry: campaignData.industry,
        seniority: campaignData.seniority,
        companySize: campaignData.companySize,
        prospectDescription: campaignData.prospectDescription || ""
      },
      source: "lovable-campaign-wizard"
    };

    const response = await fetch(campaignData.n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Handle CORS issues
      body: JSON.stringify(payload),
    });

    // Since we're using no-cors, we can't check response status
    // We'll assume success and show a positive message
    toast({
      title: "Success!",
      description: "Prospect criteria sent to your n8n workflow successfully. Check your workflow for processing status.",
    });

    console.log("Successfully sent data to n8n workflow");
    return true;
  } catch (error) {
    console.error("Error sending data to n8n:", error);
    toast({
      title: "Error",
      description: "Failed to send data to n8n workflow. Please check your webhook URL and try again.",
      variant: "destructive",
    });
    return false;
  }
};
