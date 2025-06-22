
import { useState } from "react";
import { CampaignWizard } from "@/components/CampaignWizard";
import { CampaignMonitor } from "@/components/CampaignMonitor";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { CampaignsSection } from "@/components/dashboard/CampaignsSection";
import { PerformanceInsights } from "@/components/dashboard/PerformanceInsights";

const Dashboard = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Mock data for demonstration
  const stats = {
    totalSent: 2847,
    responseRate: 12.4,
    activeCampaigns: 3,
    openRate: 34.2
  };

  const campaigns = [
    {
      id: 1,
      name: "Q1 SaaS Prospects",
      status: "active",
      sent: 487,
      total: 1250,
      responses: 18,
      openRate: 28.3,
      created: "2024-03-15"
    },
    {
      id: 2,
      name: "Developer Outreach 2024",
      status: "completed",
      sent: 850,
      total: 850,
      responses: 42,
      openRate: 31.7,
      created: "2024-03-10"
    },
    {
      id: 3,
      name: "Spring Product Launch",
      status: "paused",
      sent: 156,
      total: 600,
      responses: 8,
      openRate: 25.1,
      created: "2024-03-18"
    }
  ];

  if (showWizard) {
    return (
      <CampaignWizard 
        onClose={() => setShowWizard(false)}
        onComplete={() => {
          setShowWizard(false);
          // Refresh dashboard data
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-blue-50/30 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-gray-50/50 to-transparent blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <HeroSection onCreateCampaign={() => setShowWizard(true)} />
        <StatsGrid stats={stats} />
        <CampaignsSection 
          campaigns={campaigns} 
          onCampaignSelect={setSelectedCampaign} 
        />
        <PerformanceInsights stats={stats} />
      </div>
    </div>
  );
};

export default Dashboard;
