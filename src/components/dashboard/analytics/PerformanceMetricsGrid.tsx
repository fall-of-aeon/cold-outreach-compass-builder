
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Mail, Eye, Reply, Users, Target, Clock } from "lucide-react";
import type { DashboardStats } from "@/services/supabaseService";

interface PerformanceMetricsGridProps {
  stats?: DashboardStats;
}

export const PerformanceMetricsGrid = ({ stats }: PerformanceMetricsGridProps) => {
  const metrics = [
    {
      title: "Total Campaigns",
      value: stats?.totalCampaigns || 0,
      change: "+12%",
      trend: "up",
      icon: Target,
      description: "Active outreach campaigns"
    },
    {
      title: "Emails Sent",
      value: stats?.totalEmailsSent?.toLocaleString() || "0",
      change: "+8.2%",
      trend: "up", 
      icon: Mail,
      description: "Total emails delivered"
    },
    {
      title: "Open Rate",
      value: `${stats?.avgOpenRate?.toFixed(1) || 0}%`,
      change: "+2.1%",
      trend: "up",
      icon: Eye,
      description: "Average open rate across campaigns",
      progress: stats?.avgOpenRate || 0
    },
    {
      title: "Reply Rate", 
      value: `${stats?.avgReplyRate?.toFixed(1) || 0}%`,
      change: "-0.5%",
      trend: "down",
      icon: Reply,
      description: "Average reply rate across campaigns",
      progress: stats?.avgReplyRate || 0
    },
    {
      title: "Qualified Leads",
      value: stats?.qualifiedLeads?.toLocaleString() || "0",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      description: "High-quality prospects identified"
    },
    {
      title: "Response Time",
      value: "2.4h",
      change: "-0.8h",
      trend: "up",
      icon: Clock,
      description: "Average time to first response"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = !metric.change.startsWith('-');
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="border border-border bg-card hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={isPositive ? "default" : "destructive"}
                      className="text-xs px-2 py-0.5"
                    >
                      <TrendIcon className="h-3 w-3 mr-1" />
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {metric.progress !== undefined && (
                <div className="mt-3">
                  <Progress 
                    value={Math.min(metric.progress, 100)} 
                    className="h-2"
                  />
                </div>
              )}
              
              <CardDescription className="text-xs text-muted-foreground mt-2">
                {metric.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
