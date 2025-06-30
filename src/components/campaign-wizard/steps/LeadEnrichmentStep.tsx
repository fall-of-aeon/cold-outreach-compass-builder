import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Search, Shield, Brain, Loader2, Sparkles } from "lucide-react";
import { CampaignData } from "../types";
import { useState } from "react";

interface LeadEnrichmentStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
  campaignId?: string | null;
  onNext: () => void;
}

export const LeadEnrichmentStep = ({ campaignData, setCampaignData, campaignId, onNext }: LeadEnrichmentStepProps) => {
  const [enrichmentStarted, setEnrichmentStarted] = useState(false);
  const [progress, setProgress] = useState(0);

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
          </CardContent>
        </Card>

        {/* Process Steps */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h4 className="font-bold text-gray-900 text-lg mb-4">What we'll do:</h4>
          {enrichmentSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="group flex items-center space-x-4 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in transform hover:-translate-y-1"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="relative">
                  <Icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                    {step.title}
                  </h5>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <Button 
          onClick={startEnrichment}
          className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg py-6 animate-fade-in"
          size="lg"
          style={{ animationDelay: '0.8s' }}
        >
          <Sparkles className="h-5 w-5 mr-3 animate-spin" />
          Start Lead Discovery & Enrichment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="relative inline-block mb-6">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Enriching Your Prospects</h2>
        <p className="text-lg text-gray-600">This usually takes 5-10 minutes. We'll gather detailed information about each lead.</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-semibold">{progress}% complete</span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-4 bg-gray-200 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Step Progress */}
      <div className="space-y-4">
        {enrichmentSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';
          
          return (
            <div 
              key={index} 
              className={`flex items-center space-x-4 p-5 rounded-xl transition-all duration-500 transform hover:scale-[1.02] animate-fade-in ${
                isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg' : 
                isInProgress ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg' : 
                'bg-gray-50 border border-gray-200'
              }`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="relative">
                {isCompleted ? (
                  <div className="relative">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md animate-pulse"></div>
                  </div>
                ) : isInProgress ? (
                  <div className="relative">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md animate-ping"></div>
                  </div>
                ) : (
                  <Icon className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <h5 className={`font-semibold transition-colors duration-300 ${
                  isCompleted ? 'text-green-900' : 
                  isInProgress ? 'text-blue-900' : 
                  'text-gray-500'
                }`}>
                  {step.title}
                </h5>
                <p className={`text-sm transition-colors duration-300 ${
                  isCompleted ? 'text-green-700' : 
                  isInProgress ? 'text-blue-700' : 
                  'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Card */}
      {progress === 100 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl animate-fade-in transform scale-105 transition-all duration-500">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="font-bold text-green-900 text-lg mb-2">Enrichment Complete!</h3>
            <p className="text-green-700">Found and enriched 47 qualified prospects</p>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
};
