
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import { CampaignData } from "../../types";
import { EnrichmentCriteriaCard } from "./EnrichmentCriteriaCard";
import { EnrichmentStepsList, EnrichmentStepData } from "./EnrichmentStepsList";

interface EnrichmentInitialViewProps {
  campaignData: CampaignData;
  campaignId?: string | null;
  enrichmentSteps: EnrichmentStepData[];
  onStartEnrichment: () => void;
}

export const EnrichmentInitialView = ({ 
  campaignData, 
  campaignId, 
  enrichmentSteps, 
  onStartEnrichment 
}: EnrichmentInitialViewProps) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="relative inline-block mb-6">
          <Brain className="h-16 w-16 text-green-600 mx-auto animate-pulse" />
          <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Ready to Find & Enrich Your Prospects
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {campaignId ? `Campaign ${campaignId.slice(0, 8)}... created successfully!` : "Campaign ready for processing"} 
          <br />We'll find high-quality leads and gather detailed information about them
        </p>
      </div>

      {/* Criteria Summary */}
      <EnrichmentCriteriaCard campaignData={campaignData} campaignId={campaignId} />

      {/* Process Steps */}
      <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <EnrichmentStepsList steps={enrichmentSteps} />
      </div>

      {/* CTA Button */}
      <Button 
        onClick={onStartEnrichment}
        className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg py-6 animate-fade-in"
        size="lg"
        style={{ animationDelay: '0.8s' }}
      >
        <Sparkles className="h-5 w-5 mr-3 animate-spin" />
        Start Lead Discovery & Enrichment
      </Button>
    </div>
  );
};
