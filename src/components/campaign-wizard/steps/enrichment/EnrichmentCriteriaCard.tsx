
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { CampaignData } from "../../types";

interface EnrichmentCriteriaCardProps {
  campaignData: CampaignData;
  campaignId?: string | null;
}

export const EnrichmentCriteriaCard = ({ campaignData, campaignId }: EnrichmentCriteriaCardProps) => {
  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-500 animate-fade-in transform hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
      <CardContent className="p-6">
        <h3 className="font-bold text-green-900 mb-4 text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 animate-spin" />
          Your Search Criteria:
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "Location", value: campaignData.location },
            { label: "Industry", value: campaignData.industry },
            { label: "Seniority", value: campaignData.seniority },
            { label: "Company Size", value: campaignData.companySize }
          ].map((item, index) => (
            <div 
              key={item.label}
              className="animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <span className="font-semibold text-green-800">{item.label}:</span>
              <span className="ml-2 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        {campaignData.prospectDescription && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <span className="font-semibold text-green-800">Additional Description:</span>
            <span className="ml-2 text-green-700">{campaignData.prospectDescription}</span>
          </div>
        )}
        {campaignId && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <span className="font-semibold text-green-800">Campaign ID:</span>
            <span className="ml-2 text-green-700 font-mono text-xs">{campaignId.slice(0, 8)}...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
