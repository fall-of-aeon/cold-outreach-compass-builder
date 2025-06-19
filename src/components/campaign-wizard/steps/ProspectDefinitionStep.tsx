
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target } from "lucide-react";
import { CampaignData } from "../types";
import { locationOptions, industryOptions, seniorityOptions, companySizeOptions } from "../data";

interface ProspectDefinitionStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const ProspectDefinitionStep = ({ campaignData, setCampaignData }: ProspectDefinitionStepProps) => {
  const handleAIHelper = () => {
    // This would open an AI prompt helper modal
    console.log("AI Helper clicked - would open prompt assistant");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Define Your Target Prospects</h2>
        <p className="text-gray-600">Tell us about your ideal customers and we'll find them for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="location">Location</Label>
          <Select value={campaignData.location} onValueChange={(value) => setCampaignData({ ...campaignData, location: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((location) => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select value={campaignData.industry} onValueChange={(value) => setCampaignData({ ...campaignData, industry: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="seniority">Seniority Level</Label>
          <Select value={campaignData.seniority} onValueChange={(value) => setCampaignData({ ...campaignData, seniority: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select seniority" />
            </SelectTrigger>
            <SelectContent>
              {seniorityOptions.map((seniority) => (
                <SelectItem key={seniority} value={seniority}>{seniority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="companySize">Company Size</Label>
          <Select value={campaignData.companySize} onValueChange={(value) => setCampaignData({ ...campaignData, companySize: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {companySizeOptions.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-900">Need help defining your audience?</h3>
              <p className="text-sm text-purple-700">Our AI can help you refine your targeting criteria</p>
            </div>
            <Button variant="outline" onClick={handleAIHelper} className="border-purple-300 text-purple-700 hover:bg-purple-100">
              <Sparkles className="h-4 w-4 mr-2" />
              Use AI Helper
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">What happens next:</h4>
        <div className="space-y-1 text-sm text-blue-800">
          <p>• We'll generate a search URL targeting your criteria</p>
          <p>• Prospects will be found using Apollo.io database</p>
          <p>• Each lead will be enriched with LinkedIn and company data</p>
        </div>
      </div>
    </div>
  );
};
