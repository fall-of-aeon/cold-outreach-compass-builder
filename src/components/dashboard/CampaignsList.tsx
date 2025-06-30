
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, BarChart3 } from "lucide-react";
import type { Campaign } from "@/services/supabaseService";

interface CampaignsListProps {
  campaigns?: Campaign[];
  onCampaignSelect: (campaign: Campaign) => void;
}

export const CampaignsList = ({ campaigns, onCampaignSelect }: CampaignsListProps) => {
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

  return (
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
                onClick={() => onCampaignSelect(campaign)}
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
  );
};
