
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Sophisticated background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        {/* Subtle accent shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-bl from-blue-50/40 via-transparent to-transparent"></div>
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-slate-50/60 via-transparent to-transparent"></div>
        
        {/* Premium accent line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-sm text-slate-600 mb-8">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Next-generation outreach platform</span>
          </div>
          
          <h1 className="text-7xl font-light text-slate-900 mb-6 tracking-tight">
            Cold Outreach
            <br />
            <span className="font-medium text-slate-700">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Transform prospects into conversations with precision and elegance.
          </p>
          
          <Button 
            onClick={() => setShowWizard(true)}
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-base font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-200"
          >
            Create Campaign
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { icon: Mail, label: "Total Sent", value: stats.totalSent.toLocaleString(), color: "blue" },
            { icon: TrendingUp, label: "Response Rate", value: `${stats.responseRate}%`, color: "emerald" },
            { icon: Users, label: "Active Campaigns", value: stats.activeCampaigns, color: "slate" },
            { icon: BarChart3, label: "Open Rate", value: `${stats.openRate}%`, color: "violet" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border border-slate-200 bg-white hover:shadow-sm transition-shadow duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                  </div>
                  <p className="text-3xl font-light text-slate-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Campaigns Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-light text-slate-900 mb-3">Active Campaigns</h2>
              <p className="text-slate-600 font-light">Monitor performance and manage your outreach</p>
            </div>
          </div>

          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <Card 
                key={campaign.id}
                className="border border-slate-200 bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(campaign.status)}`} />
                      <h3 className="text-xl font-medium text-slate-900">{campaign.name}</h3>
                      <Badge variant="outline" className="capitalize border-slate-200 text-slate-600 bg-slate-50">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                      <p className="text-2xl font-light text-slate-900 mb-1">{campaign.sent}</p>
                      <p className="text-sm text-slate-600">Sent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-light text-emerald-600 mb-1">{campaign.responses}</p>
                      <p className="text-sm text-slate-600">Responses</p>
                    </div>
                    <div>
                      <p className="text-2xl font-light text-blue-600 mb-1">{campaign.openRate}%</p>
                      <p className="text-sm text-slate-600">Open Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-light text-slate-700 mb-1">{((campaign.responses / campaign.sent) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-slate-600">Response Rate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Progress</span>
                      <span>{campaign.sent} of {campaign.total}</span>
                    </div>
                    <Progress value={(campaign.sent / campaign.total) * 100} className="h-1.5 bg-slate-100" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <Card className="border border-slate-200 bg-slate-900 text-white">
          <CardContent className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-3xl font-light mb-4">Exceptional Performance</h3>
                <p className="text-lg text-slate-300 mb-8 font-light leading-relaxed">
                  With a 12.4% response rate, you're outperforming industry averages by 3x. 
                  Your personalized approach is driving real conversations.
                </p>
                <div className="flex space-x-8">
                  <div>
                    <p className="text-2xl font-light text-emerald-400 mb-1">+247%</p>
                    <p className="text-sm text-slate-400">vs industry avg</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-blue-400 mb-1">98.2%</p>
                    <p className="text-sm text-slate-400">deliverability</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-white mb-1">4.2s</p>
                    <p className="text-sm text-slate-400">avg. response time</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="w-24 h-24 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-emerald-400" />
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
