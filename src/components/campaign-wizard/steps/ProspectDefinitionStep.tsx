
import { Globe, Building2, User, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Users } from "lucide-react";
import { CampaignData } from "../types";
import { locationOptions, industryOptions, seniorityOptions, companySizeOptions } from "../data";

interface ProspectDefinitionStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const ProspectDefinitionStep = ({ campaignData, setCampaignData }: ProspectDefinitionStepProps) => {
  const handleAIHelper = () => {
    console.log("AI Helper clicked - would open prompt assistant");
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-6">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
          Define Your Ideal Prospects
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Precision targeting to find your perfect customers
        </p>
      </div>

      {/* Campaign Name */}
      <div className="max-w-2xl mx-auto">
        <Label htmlFor="campaignName" className="text-sm font-medium text-foreground mb-3 block">
          Campaign Name *
        </Label>
        <Input
          id="campaignName"
          placeholder="Q1 2024 SaaS Outreach Campaign"
          value={campaignData.name}
          onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
          className="h-11"
        />
      </div>

      {/* Targeting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[
          { 
            label: "Location", 
            value: campaignData.location, 
            options: locationOptions,
            field: "location",
            icon: Globe
          },
          { 
            label: "Industry", 
            value: campaignData.industry, 
            options: industryOptions,
            field: "industry",
            icon: Building2
          },
          { 
            label: "Seniority Level", 
            value: campaignData.seniority, 
            options: seniorityOptions,
            field: "seniority",
            icon: User
          },
          { 
            label: "Company Size", 
            value: campaignData.companySize, 
            options: companySizeOptions,
            field: "companySize",
            icon: BarChart3
          }
        ].map((item) => (
          <div key={item.field}>
            <Label className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
              <item.icon className="h-4 w-4 text-primary" />
              <span>{item.label} *</span>
            </Label>
            <Select 
              value={item.value} 
              onValueChange={(value) => setCampaignData({ 
                ...campaignData, 
                [item.field]: value 
              })}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={`Select ${item.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {item.options.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Prospect Description */}
      <div className="max-w-2xl mx-auto">
        <Label htmlFor="prospectDescription" className="text-sm font-medium text-foreground mb-3 block">
          Additional Prospect Description (Optional)
        </Label>
        <Input
          id="prospectDescription"
          placeholder="e.g., Recently raised Series A, Uses specific technology stack..."
          value={campaignData.prospectDescription || ""}
          onChange={(e) => setCampaignData({ ...campaignData, prospectDescription: e.target.value })}
          className="h-11"
        />
      </div>

      {/* AI Helper Card */}
      <Card className="max-w-4xl mx-auto border bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-1">AI-Powered Targeting</h3>
                <p className="text-sm text-muted-foreground">Let our AI help you refine your targeting criteria for maximum impact</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleAIHelper} 
              className="px-4 py-2"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Process Preview */}
      <div className="max-w-4xl mx-auto">
        <Card className="border bg-card">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">What happens next</h4>
                <div className="space-y-3">
                  {[
                    "Campaign is securely created in Supabase database",
                    "n8n workflow is triggered via secure edge function", 
                    "AI processes your targeting criteria with precision",
                    "Qualified prospects are discovered and enriched automatically", 
                    "Personalized outreach campaigns are created and launched"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expected Results</p>
                  <p className="text-sm font-medium text-foreground">50-150 qualified leads</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Processing Time</p>
                  <p className="text-sm font-medium text-foreground">15-30 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
