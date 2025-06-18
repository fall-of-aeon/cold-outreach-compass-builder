
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CampaignData } from "../types";
import { templates } from "../data";

interface CampaignBasicsStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const CampaignBasicsStep = ({ campaignData, setCampaignData }: CampaignBasicsStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input
          id="campaignName"
          placeholder="e.g., Spring 2024 SaaS Outreach"
          value={campaignData.name}
          onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          💡 Use descriptive names like 'Q1 SaaS Prospects' for easy tracking
        </p>
      </div>

      <div>
        <Label>Campaign Type</Label>
        <Select value={campaignData.type} onValueChange={(value) => setCampaignData({ ...campaignData, type: value })}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select campaign type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
            <SelectItem value="follow-up">Follow-up Sequence</SelectItem>
            <SelectItem value="product-launch">Product Launch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Choose Template</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                campaignData.template === template.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setCampaignData({ ...campaignData, template: template.id })}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <p className="text-xs text-green-600 mb-2">{template.usage}</p>
                <p className="text-xs text-gray-500 italic">{template.preview}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full">
          <Plus className="h-4 w-4 mr-2" />
          Start from Scratch
        </Button>
      </div>
    </div>
  );
};
