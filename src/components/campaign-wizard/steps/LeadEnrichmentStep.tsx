
import { Search, Shield, Brain } from "lucide-react";
import { CampaignData } from "../types";
import { useState, useEffect } from "react";
import { EnrichmentInitialView } from "./enrichment/EnrichmentInitialView";
import { EnrichmentProgressView } from "./enrichment/EnrichmentProgressView";
import { EnrichmentStepData } from "./enrichment/EnrichmentStepsList";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface LeadEnrichmentStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  campaignId?: string | null;
  onNext: () => void;
}

export const LeadEnrichmentStep = ({ campaignData, setCampaignData, campaignId, onNext }: LeadEnrichmentStepProps) => {
  const [enrichmentStarted, setEnrichmentStarted] = useState(false);
  const [enrichmentCompleted, setEnrichmentCompleted] = useState(false);
  const [realTimeProgress, setRealTimeProgress] = useState(0);

  // Subscribe to real-time campaign status changes
  useEffect(() => {
    if (!campaignId) return;

    const channel = supabase
      .channel('campaign-status-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'campaigns',
        filter: `id=eq.${campaignId}`
      }, (payload) => {
        console.log('Campaign status update:', payload.new);
        if (payload.new.status === 'enrichment_complete') {
          setEnrichmentCompleted(true);
          setRealTimeProgress(100);
          setCampaignData({ ...campaignData, enrichmentStatus: 'enrichment_complete' });
        } else if (payload.new.status === 'failed') {
          setEnrichmentCompleted(false);
          setRealTimeProgress(0);
          setCampaignData({ ...campaignData, enrichmentStatus: 'failed' });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, campaignData, setCampaignData]);

  const enrichmentSteps: EnrichmentStepData[] = [
    {
      icon: Search,
      title: "Lead Discovery",
      description: "Finding prospects matching your criteria using Apollo.io",
      status: enrichmentStarted ? (realTimeProgress > 30 ? 'completed' : 'in-progress') : 'pending'
    },
    {
      icon: Shield,
      title: "Email Verification", 
      description: "Verifying email addresses using mails.so",
      status: realTimeProgress > 60 ? 'completed' : realTimeProgress > 30 ? 'in-progress' : 'pending'
    },
    {
      icon: Brain,
      title: "AI Enrichment",
      description: "Gathering LinkedIn profiles, company data, and recent posts",
      status: realTimeProgress === 100 ? 'completed' : realTimeProgress > 60 ? 'in-progress' : 'pending'
    }
  ];

  const startEnrichment = () => {
    setEnrichmentStarted(true);
    setRealTimeProgress(10); // Show initial progress
    setCampaignData({ ...campaignData, enrichmentStatus: 'in-progress' });
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

  if (enrichmentCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 font-semibold text-lg mb-2">
            ✅ Enrichment Complete!
          </div>
          <p className="text-green-700 mb-4">
            Your leads have been successfully enriched and are ready for review.
          </p>
          <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
            View Results
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <EnrichmentProgressView
        progress={realTimeProgress}
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
