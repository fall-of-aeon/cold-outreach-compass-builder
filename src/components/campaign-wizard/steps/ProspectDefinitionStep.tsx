
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Users, Webhook } from "lucide-react";
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
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 border border-slate-200 mb-8">
          <Target className="h-8 w-8 text-slate-700" />
        </div>
        <h2 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
          Define Your Ideal Prospects
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
          Precision targeting to find your perfect customers
        </p>
      </div>

      {/* Campaign Name */}
      <div className="max-w-2xl mx-auto">
        <Label htmlFor="campaignName" className="text-base font-medium text-slate-800 mb-4 block">
          Campaign Name *
        </Label>
        <Input
          id="campaignName"
          placeholder="Q1 2024 SaaS Outreach Campaign"
          value={campaignData.name}
          onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
          className="h-12 text-base border border-slate-200 rounded-lg px-4 focus:border-slate-400 transition-colors duration-200"
        />
      </div>

      {/* n8n Webhook URL */}
      <div className="max-w-2xl mx-auto">
        <Label htmlFor="n8nWebhookUrl" className="text-base font-medium text-slate-800 mb-4 block flex items-center space-x-2">
          <Webhook className="h-5 w-5 text-slate-600" />
          <span>n8n Webhook URL *</span>
        </Label>
        <Input
          id="n8nWebhookUrl"
          type="url"
          placeholder="https://your-n8n-instance.com/webhook/campaign-trigger"
          value={campaignData.n8nWebhookUrl || ""}
          onChange={(e) => setCampaignData({ ...campaignData, n8nWebhookUrl: e.target.value })}
          className="h-12 text-base border border-slate-200 rounded-lg px-4 focus:border-slate-400 transition-colors duration-200"
        />
        <p className="text-sm text-slate-500 mt-2">
          This URL will be securely stored and used to trigger your n8n workflow
        </p>
      </div>

      {/* Targeting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
          { 
            label: "Location", 
            value: campaignData.location, 
            options: locationOptions,
            field: "location",
            icon: "🌍"
          },
          { 
            label: "Industry", 
            value: campaignData.industry, 
            options: industryOptions,
            field: "industry",
            icon: "🏢"
          },
          { 
            label: "Seniority Level", 
            value: campaignData.seniority, 
            options: seniorityOptions,
            field: "seniority",
            icon: "👤"
          },
          { 
            label: "Company Size", 
            value: campaignData.companySize, 
            options: companySizeOptions,
            field: "companySize",
            icon: "📊"
          }
        ].map((item) => (
          <div key={item.field}>
            <Label className="text-base font-medium text-slate-800 mb-4 flex items-center space-x-3">
              <span className="text-xl">{item.icon}</span>
              <span>{item.label} *</span>
            </Label>
            <Select 
              value={item.value} 
              onValueChange={(value) => setCampaignData({ 
                ...campaignData, 
                [item.field]: value 
              })}
            >
              <SelectTrigger className="h-12 text-base border border-slate-200 rounded-lg px-4 hover:border-slate-400 focus:border-slate-400 transition-colors duration-200">
                <SelectValue placeholder={`Select ${item.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 rounded-lg shadow-lg">
                {item.options.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                    className="text-base py-2 px-3 hover:bg-slate-50 rounded-md mx-1 my-0.5 transition-colors duration-150"
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
        <Label htmlFor="prospectDescription" className="text-base font-medium text-slate-800 mb-4 block">
          Additional Prospect Description (Optional)
        </Label>
        <Input
          id="prospectDescription"
          placeholder="e.g., Recently raised Series A, Uses specific technology stack..."
          value={campaignData.prospectDescription || ""}
          onChange={(e) => setCampaignData({ ...campaignData, prospectDescription: e.target.value })}
          className="h-12 text-base border border-slate-200 rounded-lg px-4 focus:border-slate-400 transition-colors duration-200"
        />
      </div>

      {/* AI Helper Card */}
      <Card className="max-w-4xl mx-auto border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-slate-700" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-900 mb-2">AI-Powered Targeting</h3>
                <p className="text-base text-slate-700 font-light">Let our AI help you refine your targeting criteria for maximum impact</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleAIHelper} 
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-white rounded-full font-medium transition-colors duration-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Process Preview */}
      <div className="max-w-4xl mx-auto">
        <Card className="border border-slate-200 bg-slate-900 text-white shadow-sm">
          <CardContent className="p-10">
            <div className="flex items-start space-x-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-white mb-4">What happens next</h4>
                <div className="space-y-4">
                  {[
                    "Campaign is securely created in Supabase database",
                    "n8n workflow is triggered via secure edge function", 
                    "AI processes your targeting criteria with precision",
                    "Qualified prospects are discovered and enriched automatically", 
                    "Personalized outreach campaigns are created and launched"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                      <span className="text-base text-slate-300 font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-12 pt-8 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">Expected Results</p>
                  <p className="text-base font-medium text-white">50-150 qualified leads</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400 mb-1">Processing Time</p>
                  <p className="text-base font-medium text-white">15-30 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
