
import { Globe, Building2, User, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CampaignData } from "../../types";
import { locationOptions, industryOptions, seniorityOptions, companySizeOptions } from "../../data";

interface ProspectFormFieldsProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const ProspectFormFields = ({ campaignData, setCampaignData }: ProspectFormFieldsProps) => {
  return (
    <div className="space-y-12">
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
    </div>
  );
};
