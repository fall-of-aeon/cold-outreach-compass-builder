import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft, 
  MessageCircle,
  TrendingUp, 
  Mail, 
  Eye, 
  Reply, 
  AlertCircle,
  Clock,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import { Campaign } from "@/services/supabaseService";
import { useCampaign } from "@/hooks/useSupabase";
import { ChatInterface } from "./campaign-wizard/steps/prospect-definition/ChatInterface";
import { CampaignData } from "./campaign-wizard/types";

interface CampaignDetailsProps {
  campaignId: string;
  onBack: () => void;
}

export const CampaignDetails = ({ campaignId, onBack }: CampaignDetailsProps) => {
  const [showChat, setShowChat] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const { data: campaign, isLoading } = useCampaign(campaignId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Campaign not found</h2>
          <p className="text-muted-foreground mb-4">The campaign you're looking for doesn't exist.</p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "paused": return "bg-yellow-500";
      case "stopped": return "bg-red-500";
      default: return "bg-muted-foreground";
    }
  };

  const campaignData: CampaignData = {
    name: campaign.name,
    location: campaign.location || "",
    industry: campaign.industry || "",
    seniority: campaign.seniority || "",
    companySize: campaign.company_size || "",
    prospectDescription: campaign.prospect_description || "",
    enrichmentStatus: 'pending',
    qualifiedLeads: campaign.qualified_leads || 0,
    emailsSent: campaign.emails_sent || 0,
    openRate: Number(campaign.open_rate) || 0,
    replyRate: Number(campaign.reply_rate) || 0,
    bounceRate: 0
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
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(campaign.status)} mr-2`} />
                  {campaign.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Created on {new Date(campaign.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Button onClick={() => setShowChat(true)} className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Open Chat
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-primary">{campaign.total_leads_found || 0}</div>
              <div className="text-sm text-muted-foreground">Total Leads Found</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-blue-600">{campaign.qualified_leads || 0}</div>
              <div className="text-sm text-muted-foreground">Qualified Leads</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-green-600">{campaign.emails_sent || 0}</div>
              <div className="text-sm text-muted-foreground">Emails Sent</div>
            </CardContent>
          </Card>
          
          <Card className="border border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-semibold text-purple-600">{campaign.emails_opened || 0}</div>
              <div className="text-sm text-muted-foreground">Emails Opened</div>
              <div className="text-xs text-muted-foreground">{Number(campaign.open_rate || 0).toFixed(1)}%</div>
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
                  Workflow Status: {campaign.workflow_step || 'Not started'}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-foreground">
                  {campaign.workflow_progress || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={campaign.workflow_progress || 0} className="h-3" />
            <div className="flex justify-between mt-3 text-sm text-muted-foreground">
              <span>Started {new Date(campaign.created_at).toLocaleDateString()}</span>
              <span>
                {campaign.status === "processing" 
                  ? "In progress..."
                  : campaign.status === "completed"
                  ? "Completed"
                  : "Pending"
                }
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Target Criteria</CardTitle>
              <CardDescription className="text-muted-foreground">Prospect targeting parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-foreground">Location:</span>
                  <p className="text-sm text-muted-foreground">{campaign.location || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Industry:</span>
                  <p className="text-sm text-muted-foreground">{campaign.industry || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Seniority:</span>
                  <p className="text-sm text-muted-foreground">{campaign.seniority || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">Company Size:</span>
                  <p className="text-sm text-muted-foreground">{campaign.company_size || 'Not specified'}</p>
                </div>
              </div>
              {campaign.prospect_description && (
                <div>
                  <span className="text-sm font-medium text-foreground">Description:</span>
                  <p className="text-sm text-muted-foreground mt-1">{campaign.prospect_description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Metrics</CardTitle>
              <CardDescription className="text-muted-foreground">Campaign effectiveness summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Open Rate</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">{Number(campaign.open_rate || 0).toFixed(1)}%</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    {Number(campaign.open_rate || 0) > 20 ? 'Good' : 'Average'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Reply Rate</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">{Number(campaign.reply_rate || 0).toFixed(1)}%</span>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    {Number(campaign.reply_rate || 0) > 5 ? 'Great' : 'Average'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Conversion Rate</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">
                    {campaign.emails_sent ? ((campaign.qualified_leads || 0) / campaign.emails_sent * 100).toFixed(1) : 0}%
                  </span>
                  <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                    Tracking
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Alert */}
        {campaign.status === "processing" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Campaign Status: Processing</h4>
                  <p className="text-sm text-primary/80 mt-1">
                    Your n8n workflow is actively finding and enriching prospects. Check back later for updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Details Section */}
        <Card className="border border-border bg-card">
          <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
            <CardHeader className="cursor-pointer">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <CardTitle>Technical Details</CardTitle>
                    <Badge variant="outline" className="text-xs">Debug Info</Badge>
                  </div>
                  {isMetadataOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="grid gap-4">
                  {/* Campaign IDs */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">Campaign Identifiers</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">Campaign ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">{campaign.id}</code>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">User ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">{campaign.user_id || 'Not set'}</code>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">Chat Session ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">{campaign.chat_session_id || 'Not set'}</code>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">Airtable Search ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">{campaign.airtable_search_id || 'Not set'}</code>
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-muted-foreground">SmartLead Campaign ID:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">{campaign.smartlead_campaign_id || 'Not set'}</code>
                      </div>
                    </div>
                  </div>

                  {/* Workflow State */}
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="font-semibold text-sm text-foreground">Workflow State</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Current Step:</span>
                        <span className="font-medium text-foreground">{campaign.workflow_step || 'Not started'}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Progress:</span>
                        <span className="font-medium text-foreground">{campaign.workflow_progress || 0}%</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium capitalize text-foreground">{campaign.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="font-semibold text-sm text-foreground">Timestamps</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-mono text-xs text-foreground">{campaign.created_at ? format(new Date(campaign.created_at), 'PPpp') : 'Not set'}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span className="font-mono text-xs text-foreground">{campaign.updated_at ? format(new Date(campaign.updated_at), 'PPpp') : 'Not set'}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Workflow Started:</span>
                        <span className="font-mono text-xs text-foreground">{campaign.workflow_started_at ? format(new Date(campaign.workflow_started_at), 'PPpp') : 'Not started'}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Workflow Completed:</span>
                        <span className="font-mono text-xs text-foreground">{campaign.workflow_completed_at ? format(new Date(campaign.workflow_completed_at), 'PPpp') : 'Not completed'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Chat Interface */}
        <ChatInterface
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          campaignData={campaignData}
          campaignId={campaignId}
        />
      </div>
    </div>
  );
};