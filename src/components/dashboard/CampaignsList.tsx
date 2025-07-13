
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, BarChart3, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteCampaignDialog } from "./DeleteCampaignDialog";
import { useDeleteCampaign } from "@/hooks/useSupabase";
import type { Campaign } from "@/services/supabaseService";

interface CampaignsListProps {
  campaigns?: Campaign[];
  onCampaignSelect: (campaign: Campaign) => void;
}

export const CampaignsList = ({ campaigns, onCampaignSelect }: CampaignsListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  
  const { mutate: deleteCampaign, isPending: isDeleting } = useDeleteCampaign();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing": return "bg-primary";
      case "completed": return "bg-primary";
      case "paused": return "bg-muted-foreground";
      case "failed": return "bg-destructive";
      default: return "bg-muted-foreground";
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

  const handleDeleteClick = (campaign: Campaign, e: React.MouseEvent) => {
    e.stopPropagation();
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (campaignToDelete) {
      deleteCampaign(campaignToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCampaignToDelete(null);
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCampaignToDelete(null);
  };

  return (
    <>
      <Card className="border border-border bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl text-foreground">Recent Campaigns</CardTitle>
          <CardDescription className="text-muted-foreground">
            Automated lead research, scoring, and personalized email generation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  className="p-6 hover:bg-accent/50 cursor-pointer transition-all duration-200 relative group"
                  onClick={() => onCampaignSelect(campaign)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(campaign.status)}`} />
                      <h3 className="font-semibold text-lg text-foreground">{campaign.name}</h3>
                      <Badge variant="outline" className="capitalize border-border">
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">{campaign.status}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-muted-foreground">
                        Created {new Date(campaign.created_at || '').toLocaleDateString()}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteClick(campaign, e)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Campaign
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Qualified Leads</p>
                      <p className="font-medium text-primary">
                        {campaign.qualified_leads || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Emails Sent</p>
                      <p className="font-medium text-foreground">{campaign.emails_sent || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Rate</p>
                      <p className="font-medium text-foreground">{Number(campaign.open_rate)?.toFixed(1) || 0}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reply Rate</p>
                      <p className="font-medium text-foreground">{Number(campaign.reply_rate)?.toFixed(1) || 0}%</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No campaigns found. Create your first automated outreach campaign to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DeleteCampaignDialog
        campaign={campaignToDelete}
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};
