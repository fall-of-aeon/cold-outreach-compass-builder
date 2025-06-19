
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Zap } from "lucide-react";
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
    <div className="space-y-8">
      {/* Hero Section with smooth animations */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="relative inline-block">
          <Target className="h-16 w-16 text-blue-600 mx-auto mb-6 animate-pulse" />
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Define Your Target Prospects
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Tell us about your ideal customers and we'll find them for you with precision
        </p>
      </div>

      {/* Form Grid with staggered animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { 
            label: "Location", 
            value: campaignData.location, 
            options: locationOptions,
            field: "location",
            delay: "0.1s"
          },
          { 
            label: "Industry", 
            value: campaignData.industry, 
            options: industryOptions,
            field: "industry",
            delay: "0.2s"
          },
          { 
            label: "Seniority Level", 
            value: campaignData.seniority, 
            options: seniorityOptions,
            field: "seniority",
            delay: "0.3s"
          },
          { 
            label: "Company Size", 
            value: campaignData.companySize, 
            options: companySizeOptions,
            field: "companySize",
            delay: "0.4s"
          }
        ].map((item, index) => (
          <div 
            key={item.field}
            className="group animate-fade-in" 
            style={{ animationDelay: item.delay }}
          >
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              {item.label}
            </Label>
            <Select 
              value={item.value} 
              onValueChange={(value) => setCampaignData({ 
                ...campaignData, 
                [item.field]: value 
              })}
            >
              <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                <SelectValue placeholder={`Select ${item.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200">
                {item.options.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* AI Helper Card with enhanced animations */}
      <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-purple-200/50 hover:shadow-xl transition-all duration-500 animate-fade-in transform hover:-translate-y-1" style={{ animationDelay: '0.5s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md animate-ping"></div>
              </div>
              <div>
                <h3 className="font-bold text-purple-900 text-lg">Need help defining your audience?</h3>
                <p className="text-purple-700">Our AI can help you refine your targeting criteria</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleAIHelper} 
              className="group border-purple-300 text-purple-700 hover:bg-purple-100 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Use AI Helper
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Panel with smooth reveal */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/50 animate-fade-in transform transition-all duration-500 hover:shadow-lg" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-start space-x-3">
          <Zap className="h-6 w-6 text-blue-600 mt-1 animate-pulse" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-3 text-lg">What happens next:</h4>
            <div className="space-y-2 text-blue-800">
              {[
                "We'll generate a search URL targeting your criteria",
                "Prospects will be found using Apollo.io database", 
                "Each lead will be enriched with LinkedIn and company data"
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 animate-fade-in"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
