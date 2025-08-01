
import { Card, CardContent } from "@/components/ui/card";
import { Mail, TrendingUp, Users, BarChart3 } from "lucide-react";
import type { DashboardStats as DashboardStatsType } from "@/services/supabaseService";

interface DashboardStatsProps {
  stats?: DashboardStatsType;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-lg transition-all duration-200 border border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
              <p className="text-3xl font-bold text-foreground">
                {stats?.totalEmailsSent?.toLocaleString() || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200 border border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {stats?.avgReplyRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200 border border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
              <p className="text-3xl font-bold text-foreground">
                {stats?.activeCampaigns || 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all duration-200 border border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {stats?.avgOpenRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
