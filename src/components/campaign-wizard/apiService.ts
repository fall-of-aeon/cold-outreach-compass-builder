
import { CampaignData } from "./types";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "https://mydomain.com/api";

export const apiService = {
  // Submit prospect criteria to backend
  submitProspectCriteria: async (campaignData: CampaignData): Promise<boolean> => {
    try {
      console.log("Sending prospect criteria to backend API");
      
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

      const response = await fetch(`${API_BASE_URL}/campaigns/prospects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Success!",
        description: "Prospect criteria submitted successfully. Processing has begun.",
      });

      console.log("Successfully sent data to backend API");
      return true;
    } catch (error) {
      console.error("Error sending data to backend API:", error);
      toast({
        title: "Error",
        description: "Failed to submit prospect criteria. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  },

  // Fetch campaign stats
  getCampaignStats: async (campaignId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch campaign stats: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching campaign stats:", error);
      throw error;
    }
  },

  // Fetch enriched leads
  getEnrichedLeads: async (campaignId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/leads`);
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
  },

  // Update campaign status
  updateCampaignStatus: async (campaignId: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update campaign status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating campaign status:", error);
      throw error;
    }
  }
};
