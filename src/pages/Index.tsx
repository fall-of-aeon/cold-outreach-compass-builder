
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, BarChart3, Users, Mail, TrendingUp, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CampaignWizard } from "@/components/CampaignWizard";
import { CampaignMonitor } from "@/components/CampaignMonitor";
import { useDashboardStats, useCampaigns } from "@/hooks/useSupabase";
import { SupabaseService, type LegacyCampaign } from "@/services/supabaseService";

const Dashboard = () => {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-foreground" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError || campaignsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Error loading dashboard: {statsError?.message || campaignsError?.message}
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing": return "bg-blue-500 dark:bg-blue-600";
      case "completed": return "bg-green-500 dark:bg-green-600";
      case "paused": return "bg-yellow-500 dark:bg-yellow-600";
      case "failed": return "bg-red-500 dark:bg-red-600";
      default: return "bg-gray-500 dark:bg-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing": return <Play className="h-4 w-4" />;
      case "completed": return <BarChart3 className="h-4 w-4" />;
      case "paused": return <Pause className="h-4 w-4" />;
      default: return null;
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              AI Cold Outreach Automation
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Automated prospect research, lead scoring, and personalized outreach campaigns
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              ✅ Connected to Supabase • n8n • Airtable • SmartLead
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              onClick={() => setShowWizard(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Campaign
            </Button>
          </div>
        </div>

        {/* Real stats from Supabase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.totalEmailsSent?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.avgReplyRate?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.activeCampaigns || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats?.avgOpenRate?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real campaigns from Supabase */}
        <Card className="border-0 shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="text-xl">Recent Campaigns</CardTitle>
            <CardDescription>
              Automated lead research, scoring, and personalized email generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((campaign) => (
                  <div 
                    key={campaign.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCampaign(SupabaseService.convertToLegacyCampaign(campaign))}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(campaign.status)}`} />
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <Badge variant="outline" className="capitalize">
                          {getStatusIcon(campaign.status)}
                          <span className="ml-1">{campaign.status}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Created {new Date(campaign.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Qualified Leads</p>
                        <p className="font-medium text-green-600 dark:text-green-400">
                          {campaign.qualified_leads || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Emails Sent</p>
                        <p className="font-medium">{campaign.emails_sent || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Open Rate</p>
                        <p className="font-medium">{Number(campaign.open_rate)?.toFixed(1) || 0}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reply Rate</p>
                        <p className="font-medium">{Number(campaign.reply_rate)?.toFixed(1) || 0}%</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No campaigns found. Create your first automated outreach campaign to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
