
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Zap, Users } from "lucide-react";
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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 mb-8 shadow-2xl">
          <Target className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
          Define Your Ideal Prospects
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Precision targeting powered by AI to find your perfect customers
        </p>
      </div>

      {/* Campaign Name */}
      <div className="max-w-2xl mx-auto">
        <Label htmlFor="campaignName" className="text-lg font-semibold text-slate-800 mb-4 block">
          Campaign Name
        </Label>
        <Input
          id="campaignName"
          placeholder="Q1 2024 SaaS Outreach Campaign"
          value={campaignData.name}
          onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
          className="h-14 text-lg border-2 border-slate-200 rounded-2xl px-6 focus:border-blue-500 transition-all duration-300"
        />
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
          <div key={item.field} className="group">
            <Label className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-3">
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </Label>
            <Select 
              value={item.value} 
              onValueChange={(value) => setCampaignData({ 
                ...campaignData, 
                [item.field]: value 
              })}
            >
              <SelectTrigger className="h-14 text-lg border-2 border-slate-200 rounded-2xl px-6 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 group-hover:shadow-lg">
                <SelectValue placeholder={`Select ${item.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-slate-200 rounded-2xl shadow-2xl">
                {item.options.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                    className="text-lg py-3 px-4 hover:bg-blue-50 rounded-xl mx-2 my-1 transition-all duration-200"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* AI Helper Card */}
      <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-r from-purple-50 to-blue-50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">AI-Powered Targeting</h3>
                <p className="text-lg text-slate-700">Let our AI help you refine your targeting criteria for maximum impact</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleAIHelper} 
              className="px-6 py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Optimize Targeting
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Process Preview */}
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <CardContent className="relative p-10">
            <div className="flex items-start space-x-4 mb-6">
              <Zap className="h-8 w-8 text-blue-400 mt-1" />
              <div>
                <h4 className="text-2xl font-bold text-white mb-3">What happens next</h4>
                <div className="space-y-4">
                  {[
                    "AI processes your targeting criteria with precision",
                    "Qualified prospects are discovered and enriched automatically", 
                    "Personalized outreach campaigns are created and launched"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-lg text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8 pt-6 border-t border-slate-700">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-emerald-400" />
                <div>
                  <p className="text-sm text-slate-400">Expected Results</p>
                  <p className="text-lg font-bold text-white">50-150 qualified leads</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-purple-400" />
                <div>
                  <p className="text-sm text-slate-400">Processing Time</p>
                  <p className="text-lg font-bold text-white">15-30 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
