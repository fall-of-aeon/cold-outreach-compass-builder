
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, BarChart3 } from "lucide-react";

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

interface CampaignsSectionProps {
  campaigns: Campaign[];
  onCampaignSelect: (campaign: Campaign) => void;
}

export const CampaignsSection = ({ campaigns, onCampaignSelect }: CampaignsSectionProps) => {
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

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-extralight text-gray-900 mb-3">Active Campaigns</h2>
          <p className="text-gray-600 font-light">Monitor performance and manage your outreach</p>
        </div>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id}
            className="border border-gray-200/60 bg-white/80 backdrop-blur-sm hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => onCampaignSelect(campaign)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(campaign.status)}`} />
                  <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                  <Badge variant="outline" className="capitalize border-gray-200/60 text-gray-600 bg-gray-50/50">
                    <span className="ml-1">{campaign.status}</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {new Date(campaign.created).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-2xl font-extralight text-gray-900 mb-1">{campaign.sent}</p>
                  <p className="text-sm text-gray-600">Sent</p>
                </div>
                <div>
                  <p className="text-2xl font-extralight text-emerald-600 mb-1">{campaign.responses}</p>
                  <p className="text-sm text-gray-600">Responses</p>
                </div>
                <div>
                  <p className="text-2xl font-extralight text-blue-600 mb-1">{campaign.openRate}%</p>
                  <p className="text-sm text-gray-600">Open Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-extralight text-gray-700 mb-1">{((campaign.responses / campaign.sent) * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Response Rate</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{campaign.sent} of {campaign.total}</span>
                </div>
                <Progress value={(campaign.sent / campaign.total) * 100} className="h-1.5 bg-gray-100" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
