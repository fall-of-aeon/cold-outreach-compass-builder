
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Play, Pause, BarChart3, Users, Mail, TrendingUp, ArrowRight, Zap } from "lucide-react";
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
      case "active": return "bg-emerald-500";
      case "paused": return "bg-amber-500";
      case "completed": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="h-3 w-3" />;
      case "paused": return <Pause className="h-3 w-3" />;
      case "completed": return <BarChart3 className="h-3 w-3" />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Subtle background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-slate-100/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-600 mb-6">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>Next-generation outreach platform</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
            Cold Outreach
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform prospects into conversations with AI-powered precision and elegance.
          </p>
          
          <Button 
            onClick={() => setShowWizard(true)}
            size="lg"
            className="group bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg font-medium rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Create Campaign
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Mail, label: "Total Sent", value: stats.totalSent.toLocaleString(), color: "blue" },
            { icon: TrendingUp, label: "Response Rate", value: `${stats.responseRate}%`, color: "emerald" },
            { icon: Users, label: "Active Campaigns", value: stats.activeCampaigns, color: "purple" },
            { icon: BarChart3, label: "Open Rate", value: `${stats.openRate}%`, color: "amber" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="group border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Campaigns Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Active Campaigns</h2>
              <p className="text-slate-600">Monitor performance and manage your outreach</p>
            </div>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card 
                key={campaign.id}
                className="group border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(campaign.status)} animate-pulse`} />
                      <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{campaign.name}</h3>
                      <Badge variant="outline" className="capitalize border-slate-200 text-slate-600">
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">{campaign.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                      {new Date(campaign.created).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">{campaign.sent}</p>
                      <p className="text-sm text-slate-600 font-medium">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{campaign.responses}</p>
                      <p className="text-sm text-slate-600 font-medium">Responses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.openRate}%</p>
                      <p className="text-sm text-slate-600 font-medium">Open Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{((campaign.responses / campaign.sent) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-slate-600 font-medium">Response Rate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium text-slate-600">
                      <span>Progress</span>
                      <span>{campaign.sent} of {campaign.total}</span>
                    </div>
                    <Progress value={(campaign.sent / campaign.total) * 100} className="h-2 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <CardContent className="relative p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold mb-4">Your outreach is performing exceptionally</h3>
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                  With a 12.4% response rate, you're outperforming industry averages by 3x. 
                  Your personalized approach is driving real conversations.
                </p>
                <div className="flex space-x-6">
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">+247%</p>
                    <p className="text-sm text-slate-400">vs industry avg</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-400">98.2%</p>
                    <p className="text-sm text-slate-400">deliverability</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-400">4.2s</p>
                    <p className="text-sm text-slate-400">avg. response time</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400 flex items-center justify-center shadow-2xl">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
