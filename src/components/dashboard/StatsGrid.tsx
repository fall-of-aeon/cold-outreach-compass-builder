
import { Card, CardContent } from "@/components/ui/card";
import { Mail, TrendingUp, Users, BarChart3 } from "lucide-react";

interface StatsGridProps {
  stats: {
    totalSent: number;
    responseRate: number;
    activeCampaigns: number;
    openRate: number;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const statItems = [
    { icon: Mail, label: "Total Sent", value: stats.totalSent.toLocaleString(), color: "blue" },
    { icon: TrendingUp, label: "Response Rate", value: `${stats.responseRate}%`, color: "emerald" },
    { icon: Users, label: "Active Campaigns", value: stats.activeCampaigns, color: "slate" },
    { icon: BarChart3, label: "Open Rate", value: `${stats.openRate}%`, color: "violet" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-gray-200/60 bg-white/80 backdrop-blur-sm hover:shadow-sm transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-gray-50/80 border border-gray-200/50 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
              </div>
              <p className="text-3xl font-extralight text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
