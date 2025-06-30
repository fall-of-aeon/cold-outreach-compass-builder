
import { Search, Shield, Brain } from "lucide-react";
import { CampaignData } from "../types";
import { useState } from "react";
import { EnrichmentInitialView } from "./enrichment/EnrichmentInitialView";
import { EnrichmentProgressView } from "./enrichment/EnrichmentProgressView";
import { EnrichmentStepData } from "./enrichment/EnrichmentStepsList";

interface LeadEnrichmentStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  campaignId?: string | null;
  onNext: () => void;
}

export const LeadEnrichmentStep = ({ campaignData, setCampaignData, campaignId, onNext }: LeadEnrichmentStepProps) => {
  const [enrichmentStarted, setEnrichmentStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  const enrichmentSteps: EnrichmentStepData[] = [
    {
      icon: Search,
      title: "Lead Discovery",
      description: "Finding prospects matching your criteria using Apollo.io",
      status: enrichmentStarted ? 'completed' : 'pending'
    },
    {
      icon: Shield,
      title: "Email Verification", 
      description: "Verifying email addresses using mails.so",
      status: progress > 40 ? 'completed' : enrichmentStarted ? 'in-progress' : 'pending'
    },
    {
      icon: Brain,
      title: "AI Enrichment",
      description: "Gathering LinkedIn profiles, company data, and recent posts",
      status: progress > 80 ? 'completed' : progress > 40 ? 'in-progress' : 'pending'
    }
  ];

  const startEnrichment = () => {
    setEnrichmentStarted(true);
    setCampaignData({ ...campaignData, enrichmentStatus: 'in-progress' });
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCampaignData({ ...campaignData, enrichmentStatus: 'completed' });
          setTimeout(() => onNext(), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 800);
  };

  if (!enrichmentStarted) {
    return (
      <>
        <EnrichmentInitialView
          campaignData={campaignData}
          campaignId={campaignId}
          enrichmentSteps={enrichmentSteps}
          onStartEnrichment={startEnrichment}
        />
        <style>{`
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
      </>
    );
  }

  return (
    <>
      <EnrichmentProgressView
        progress={progress}
        enrichmentSteps={enrichmentSteps}
      />
      <style>{`
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
    </>
  );
};
