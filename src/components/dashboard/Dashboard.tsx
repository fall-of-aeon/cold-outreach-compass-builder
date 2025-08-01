
import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardError } from "./DashboardError";
import { DashboardLoading } from "./DashboardLoading";
import { CampaignsList } from "./CampaignsList";
import { SimpleCampaignCreator } from "@/components/SimpleCampaignCreator";
import { CampaignDetails } from "@/components/CampaignDetails";
import { PerformanceMetricsGrid } from "./analytics/PerformanceMetricsGrid";
import { CampaignPerformanceChart } from "./analytics/CampaignPerformanceChart";
import { ConversionFunnelChart } from "./analytics/ConversionFunnelChart";
import { CampaignComparisonChart } from "./analytics/CampaignComparisonChart";
import { useDashboardStats, useCampaigns } from "@/hooks/useSupabase";

export const Dashboard = () => {
  const [showCreator, setShowCreator] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

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

  if (showCreator) {
    return (
      <SimpleCampaignCreator 
        onBack={() => setShowCreator(false)}
        onCampaignCreated={(campaignId) => {
          setShowCreator(false);
          setSelectedCampaignId(campaignId);
          // Data will auto-refresh via React Query
        }}
      />
    );
  }

  if (selectedCampaignId) {
    return (
      <CampaignDetails 
        campaignId={selectedCampaignId}
        onBack={() => setSelectedCampaignId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <DashboardHeader onCreateCampaign={() => setShowCreator(true)} />
        
        {/* Enhanced Analytics Section */}
        <div className="space-y-8">
          {/* Performance Metrics Grid */}
          <PerformanceMetricsGrid stats={stats} />
          
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignPerformanceChart />
            <ConversionFunnelChart />
          </div>
          
          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 gap-6">
            <CampaignComparisonChart />
          </div>
        </div>
        
        {/* Campaigns List */}
        <CampaignsList 
          campaigns={campaigns} 
          onCampaignSelect={(campaign) => setSelectedCampaignId(campaign.id)}
        />
      </div>
    </div>
  );
};
