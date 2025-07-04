
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  TrendingUp, 
  Mail, 
  Eye, 
  Reply, 
  AlertCircle,
  Clock,
  Users,
  BarChart3
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  status: string;
  sent: number;
  total: number;
  responses: number;
  openRate: number;
  created: string;
}

interface CampaignMonitorProps {
  campaign: Campaign;
  onBack: () => void;
}

export const CampaignMonitor = ({ campaign, onBack }: CampaignMonitorProps) => {
  const [currentStatus, setCurrentStatus] = useState(campaign.status);

  // Mock detailed data
  const detailedStats = {
    delivered: campaign.sent,
    opened: Math.floor(campaign.sent * (campaign.openRate / 100)),
    clicked: Math.floor(campaign.sent * 0.08),
    replied: campaign.responses,
    bounced: Math.floor(campaign.sent * 0.02),
    unsubscribed: Math.floor(campaign.sent * 0.01)
  };

  const recentActivity = [
    { time: "2 minutes ago", action: "Email opened", contact: "John Smith (TechCorp)", type: "open" },
    { time: "15 minutes ago", action: "Reply received", contact: "Sarah Johnson (StartupXYZ)", type: "reply" },
    { time: "32 minutes ago", action: "Email clicked", contact: "Mike Davis (InnovateCo)", type: "click" },
    { time: "1 hour ago", action: "Email delivered", contact: "Lisa Wang (DataFlow)", type: "delivered" },
    { time: "1 hour ago", action: "Email opened", contact: "Tom Brown (CloudTech)", type: "open" },
  ];

  const dailyProgress = [
    { day: "Mon", sent: 45, opened: 18, replied: 3 },
    { day: "Tue", sent: 52, opened: 21, replied: 4 },
    { day: "Wed", sent: 48, opened: 19, replied: 2 },
    { day: "Thu", sent: 41, opened: 16, replied: 5 },
    { day: "Fri", sent: 38, opened: 15, replied: 1 },
  ];

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "paused": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      case "stopped": return "bg-red-500";
      default: return "bg-muted-foreground";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "open": return <Eye className="h-4 w-4 text-blue-500" />;
      case "reply": return <Reply className="h-4 w-4 text-green-500" />;
      case "click": return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case "delivered": return <Mail className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-accent">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-semibold text-foreground">{campaign.name}</h1>
                <Badge variant="outline" className="capitalize border-border">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(currentStatus)} mr-2`} />
                  {currentStatus}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">Created on {campaign.created}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {currentStatus === "active" ? (
              <Button variant="outline" onClick={() => handleStatusChange("paused")}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : currentStatus === "paused" ? (
              <Button onClick={() => handleStatusChange("active")}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            ) : null}
            
            <Button variant="destructive" onClick={() => handleStatusChange("stopped")}>
              <Square className="h-4 w-4 mr-2" />
              Stop Campaign
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-primary">{detailedStats.delivered}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-blue-600">{detailedStats.opened}</div>
              <div className="text-sm text-muted-foreground">Opened</div>
              <div className="text-xs text-muted-foreground">{campaign.openRate}%</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-purple-600">{detailedStats.clicked}</div>
              <div className="text-sm text-muted-foreground">Clicked</div>
              <div className="text-xs text-muted-foreground">{((detailedStats.clicked / campaign.sent) * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-green-600">{detailedStats.replied}</div>
              <div className="text-sm text-muted-foreground">Replied</div>
              <div className="text-xs text-muted-foreground">{((campaign.responses / campaign.sent) * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-red-600">{detailedStats.bounced}</div>
              <div className="text-sm text-muted-foreground">Bounced</div>
              <div className="text-xs text-muted-foreground">{((detailedStats.bounced / campaign.sent) * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-orange-600">{detailedStats.unsubscribed}</div>
              <div className="text-sm text-muted-foreground">Unsubscribed</div>
              <div className="text-xs text-muted-foreground">{((detailedStats.unsubscribed / campaign.sent) * 100).toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-foreground">Campaign Progress</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {campaign.sent} of {campaign.total} emails sent
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-foreground">
                  {Math.round((campaign.sent / campaign.total) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(campaign.sent / campaign.total) * 100} className="h-3" />
            <div className="flex justify-between mt-3 text-sm text-muted-foreground">
              <span>Started {campaign.created}</span>
              <span>
                {currentStatus === "active" 
                  ? `~${Math.ceil((campaign.total - campaign.sent) / 50)} days remaining`
                  : "Paused"
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Daily Progress</CardTitle>
                  <CardDescription className="text-muted-foreground">Emails sent and engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyProgress.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 text-sm font-medium text-foreground">{day.day}</div>
                          <div className="flex-1">
                            <div className="flex space-x-4 text-sm text-muted-foreground">
                              <span>Sent: {day.sent}</span>
                              <span className="text-blue-600">Opened: {day.opened}</span>
                              <span className="text-green-600">Replied: {day.replied}</span>
                            </div>
                            <Progress value={(day.opened / day.sent) * 100} className="h-2 mt-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Campaign Health</CardTitle>
                  <CardDescription className="text-muted-foreground">Delivery and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Delivery Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">98.5%</span>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Open Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{campaign.openRate}%</span>
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                        Above Average
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Response Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{((campaign.responses / campaign.sent) * 100).toFixed(1)}%</span>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Great
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">Spam Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">0.1%</span>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
                <CardDescription className="text-muted-foreground">Real-time updates from your campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-accent rounded-lg transition-colors">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{activity.action}</div>
                        <div className="text-sm text-muted-foreground">{activity.contact}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recipients" className="space-y-4">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Recipient Status</CardTitle>
                <CardDescription className="text-muted-foreground">Detailed breakdown of email recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Recipient details will be loaded here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track individual recipient interactions and responses
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Performance Analytics</CardTitle>
                <CardDescription className="text-muted-foreground">Detailed performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Advanced analytics coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    A/B test results, conversion tracking, and ROI analysis
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Alert */}
        {currentStatus === "active" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Campaign Status: Active</h4>
                  <p className="text-sm text-primary/80 mt-1">
                    Your campaign is running smoothly. Next batch of emails will be sent in 4 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
