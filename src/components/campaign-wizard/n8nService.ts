
import { CampaignData } from "./types";

// Use environment variable or fallback to the placeholder for development
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://your-n8n-instance.com/webhook/campaign";

export const sendToN8n = async (campaignData: CampaignData): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Sending campaign data to n8n:', N8N_WEBHOOK_URL);
    
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
  campaignData?: CampaignData,
  metadata?: Record<string, any>
): Promise<{ success: boolean; response?: string; error?: string }> => {
  try {
    // Check if we have a valid webhook URL
    if (N8N_WEBHOOK_URL === "https://your-n8n-instance.com/webhook/campaign") {
      console.warn('N8N webhook URL is not configured. Please set VITE_N8N_WEBHOOK_URL environment variable.');
      return {
        success: false,
        error: "N8N webhook URL is not configured. Please contact your administrator."
      };
    }

    const payload = {
      sessionId: sessionId,
      message: message,
      isNewSession: isNewSession,
      campaignData: campaignData || {},
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
      source: "lovable-chat-interface"
    };

    console.log('Sending chat message to n8n:', N8N_WEBHOOK_URL);
    console.log('Payload metadata:', metadata);

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
      error: error instanceof Error ? error.message : 'Failed to connect to AI service' 
    };
  }
};
