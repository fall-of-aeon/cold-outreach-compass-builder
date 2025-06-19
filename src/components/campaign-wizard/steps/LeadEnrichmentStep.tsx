
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Search, Shield, Brain, Loader2 } from "lucide-react";
import { CampaignData } from "../types";
import { useState } from "react";

interface LeadEnrichmentStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  onNext: () => void;
}

export const LeadEnrichmentStep = ({ campaignData, setCampaignData, onNext }: LeadEnrichmentStepProps) => {
  const [enrichmentStarted, setEnrichmentStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  const startEnrichment = () => {
    setEnrichmentStarted(true);
    setCampaignData({ ...campaignData, enrichmentStatus: 'in-progress' });
    
    // Simulate progress
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

  const enrichmentSteps = [
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

  if (!enrichmentStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Brain className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Ready to Find & Enrich Your Prospects</h2>
          <p className="text-gray-600">We'll find high-quality leads and gather detailed information about them</p>
        </div>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-900 mb-4">Your Search Criteria:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800">Location:</span>
                <span className="ml-2 text-green-700">{campaignData.location}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Industry:</span>
                <span className="ml-2 text-green-700">{campaignData.industry}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Seniority:</span>
                <span className="ml-2 text-green-700">{campaignData.seniority}</span>
              </div>
              <div>
                <span className="font-medium text-green-800">Company Size:</span>
                <span className="ml-2 text-green-700">{campaignData.companySize}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">What we'll do:</h4>
          {enrichmentSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Icon className="h-5 w-5 text-blue-600" />
                <div>
                  <h5 className="font-medium text-gray-900">{step.title}</h5>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button 
          onClick={startEnrichment}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          size="lg"
        >
          Start Lead Discovery & Enrichment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900">Enriching Your Prospects</h2>
        <p className="text-gray-600">This usually takes 5-10 minutes. We'll gather detailed information about each lead.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}% complete</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="space-y-3">
        {enrichmentSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';
          
          return (
            <div key={index} className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
              isCompleted ? 'bg-green-50 border border-green-200' : 
              isInProgress ? 'bg-blue-50 border border-blue-200' : 
              'bg-gray-50'
            }`}>
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : isInProgress ? (
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              ) : (
                <Icon className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <h5 className={`font-medium ${isCompleted ? 'text-green-900' : isInProgress ? 'text-blue-900' : 'text-gray-500'}`}>
                  {step.title}
                </h5>
                <p className={`text-sm ${isCompleted ? 'text-green-700' : isInProgress ? 'text-blue-700' : 'text-gray-500'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {progress === 100 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900">Enrichment Complete!</h3>
            <p className="text-sm text-green-700">Found and enriched 47 qualified prospects</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
