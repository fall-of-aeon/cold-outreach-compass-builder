import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCampaignCreation } from "./campaign-wizard/CampaignCreationHandler";
import { CampaignData } from "./campaign-wizard/types";
import { toast } from "@/hooks/use-toast";

interface SimpleCampaignCreatorProps {
  onBack: () => void;
  onCampaignCreated: (campaignId: string) => void;
}

export const SimpleCampaignCreator = ({ onBack, onCampaignCreated }: SimpleCampaignCreatorProps) => {
  const [campaignName, setCampaignName] = useState("");
  const { createCampaign, isLoading } = useCampaignCreation();

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for your campaign.",
        variant: "destructive"
      });
      return;
    }

    const campaignData: CampaignData = {
      name: campaignName,
      location: "",
      industry: "",
      seniority: "",
      companySize: "",
      prospectDescription: "",
      enrichmentStatus: 'pending',
      qualifiedLeads: 0,
      emailsSent: 0,
      openRate: 0,
      replyRate: 0,
      bounceRate: 0
    };

    await createCampaign(
      campaignData,
      (campaignId) => {
        toast({
          title: "Campaign created successfully!",
          description: "You can now start defining your prospects."
        });
        onCampaignCreated(campaignId);
      },
      () => {
        // Error handling is done in the hook
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && campaignName.trim()) {
      handleCreateCampaign();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 pointer-events-none"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Create New Campaign</h1>
            <p className="text-muted-foreground mt-1">Start by giving your campaign a name</p>
          </div>
        </div>

        {/* Campaign Creation Form */}
        <Card className="border bg-card/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaignName" className="text-sm font-medium text-foreground">
                Campaign Name *
              </Label>
              <Input
                id="campaignName"
                placeholder="e.g., Q1 2024 SaaS Outreach Campaign"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-11"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Choose a descriptive name that helps you identify this campaign later
              </p>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleCreateCampaign}
                disabled={!campaignName.trim() || isLoading}
                className="w-full h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Campaign...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};