
import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardStats } from "./DashboardStats";
import { CampaignsList } from "./CampaignsList";
import { DashboardError } from "./DashboardError";
import { DashboardLoading } from "./DashboardLoading";
import { CampaignWizard } from "@/components/CampaignWizard";
import { CampaignMonitor } from "@/components/CampaignMonitor";
import { useDashboardStats, useCampaigns } from "@/hooks/useSupabase";
import { SupabaseService, type LegacyCampaign } from "@/services/supabaseService";

export const Dashboard = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<LegacyCampaign | null>(null);

  // Real data from Supabase
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useDashboardStats();

  const { 
    data: campaigns, 
    isLoading: campaignsLoading, 
    error: campaignsError 
  } = useCampaigns();

  // Loading state
  if (statsLoading || campaignsLoading) {
    return <DashboardLoading />;
  }

  // Error state
  if (statsError || campaignsError) {
    return <DashboardError error={statsError?.message || campaignsError?.message} />;
  }

  if (showWizard) {
    return (
      <CampaignWizard 
        onClose={() => setShowWizard(false)}
        onComplete={() => {
          setShowWizard(false);
          // Data will auto-refresh via React Query
        }}
      />
    );
  }

  if (selectedCampaign) {
    return (
      <CampaignMonitor 
        campaign={selectedCampaign}
        onBack={() => setSelectedCampaign(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <DashboardHeader onCreateCampaign={() => setShowWizard(true)} />
        <DashboardStats stats={stats} />
        <CampaignsList 
          campaigns={campaigns} 
          onCampaignSelect={(campaign) => setSelectedCampaign(SupabaseService.convertToLegacyCampaign(campaign))}
        />
      </div>
    </div>
  );
};
