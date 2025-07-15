
import { CampaignData } from "./types";

const N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/campaign";

export const sendToN8n = async (campaignData: CampaignData): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...campaignData,
        timestamp: new Date().toISOString(),
        source: "lovable-campaign-wizard"
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending data to n8n:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const sendChatMessage = async (
  message: string, 
  sessionId: string, 
  isNewSession: boolean,
  campaignData?: CampaignData
): Promise<{ success: boolean; response?: string; error?: string }> => {
  try {
    const payload = {
      sessionId: sessionId,
      message: message,
      isNewSession: isNewSession,
      campaignData: campaignData || {},
      timestamp: new Date().toISOString(),
      source: "lovable-chat-interface"
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    return { 
      success: true, 
      response: responseData.message || responseData.reply || "Response received"
    };
  } catch (error) {
    console.error('Error sending chat message to n8n:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
