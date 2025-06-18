
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Play, Pause, BarChart3, Users, Mail, TrendingUp } from "lucide-react";
import { CampaignWizard } from "@/components/CampaignWizard";
import { CampaignMonitor } from "@/components/CampaignMonitor";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "paused": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="h-4 w-4" />;
      case "paused": return <Pause className="h-4 w-4" />;
      case "completed": return <BarChart3 className="h-4 w-4" />;
      default: return null;
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Cold Outreach Dashboard</h1>
            <p className="text-gray-600">Manage your outreach campaigns and track performance</p>
          </div>
          <Button 
            onClick={() => setShowWizard(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Campaign
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.responseRate}%</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeCampaigns}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.openRate}%</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Recent Campaigns</CardTitle>
            <CardDescription>Track performance and manage your outreach campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedCampaign(campaign)}
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
                    <div className="text-sm text-gray-500">
                      Created {campaign.created}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="font-medium">{campaign.sent}/{campaign.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Responses</p>
                      <p className="font-medium text-green-600">{campaign.responses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Open Rate</p>
                      <p className="font-medium">{campaign.openRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Rate</p>
                      <p className="font-medium">{((campaign.responses / campaign.sent) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <Progress value={(campaign.sent / campaign.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Health */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Account Health</CardTitle>
            <CardDescription>Monitor your sending reputation and limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
                <h3 className="font-semibold text-green-700">Domain Reputation</h3>
                <p className="text-sm text-gray-600">Excellent standing</p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">250</span>
                </div>
                <h3 className="font-semibold text-blue-700">Daily Limit</h3>
                <p className="text-sm text-gray-600">Emails per day</p>
              </div>
              
              <div className="text-center">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">98%</span>
                </div>
                <h3 className="font-semibold text-purple-700">Deliverability</h3>
                <p className="text-sm text-gray-600">Success rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
