
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CampaignData, CampaignWizardProps } from "./campaign-wizard/types";
import { steps } from "./campaign-wizard/data";
import { ProspectDefinitionStep } from "./campaign-wizard/steps/ProspectDefinitionStep";
import { LeadEnrichmentStep } from "./campaign-wizard/steps/LeadEnrichmentStep";
import { EmailReviewStep } from "./campaign-wizard/steps/EmailReviewStep";
import { CampaignMonitorStep } from "./campaign-wizard/steps/CampaignMonitorStep";
import { apiService } from "./campaign-wizard/apiService";

export const CampaignWizard = ({ onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    location: "",
    industry: "",
    seniority: "",
    companySize: "",
    enrichmentStatus: 'pending',
    qualifiedLeads: 0,
    emailsSent: 0,
    openRate: 0,
    replyRate: 0,
    bounceRate: 0
  });

  const nextStep = async () => {
    if (currentStep === 1) {
      // Send data to backend API before proceeding to next step
      setIsLoading(true);
      const success = await apiService.submitProspectCriteria(campaignData);
      setIsLoading(false);
      
      if (!success) {
        return; // Don't proceed if API request failed
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Campaign Successfully Launched!",
      description: "Your prospects are being contacted via Smartlead. Check your dashboard for updates.",
    });
    onComplete();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return campaignData.location && 
               campaignData.industry && 
               campaignData.seniority && 
               campaignData.companySize;
      case 2:
        return campaignData.enrichmentStatus === 'completed';
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProspectDefinitionStep campaignData={campaignData} setCampaignData={setCampaignData} />;
      case 2:
        return <LeadEnrichmentStep campaignData={campaignData} setCampaignData={setCampaignData} onNext={nextStep} />;
      case 3:
        return <EmailReviewStep onNext={nextStep} />;
      case 4:
        return <CampaignMonitorStep campaignData={campaignData} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Subtle background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="h-12 w-12 rounded-2xl hover:bg-slate-100 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Create Campaign
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-100/80 backdrop-blur-sm px-6 py-3 rounded-2xl">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-16">
          <div className="relative mb-8">
            <Progress 
              value={(currentStep / steps.length) * 100} 
              className="h-2 bg-slate-200/60 backdrop-blur-sm" 
            />
          </div>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center transition-all duration-500 ${
                  index + 1 <= currentStep 
                    ? "text-slate-900" 
                    : "text-slate-400"
                }`}
              >
                <div className={`w-3 h-3 rounded-full mb-3 transition-all duration-300 ${
                  index + 1 <= currentStep 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-110" 
                    : "bg-slate-300"
                }`}></div>
                <span className="text-sm font-medium text-center max-w-24">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl mb-12">
          <CardContent className="p-12">
            <div className="animate-fade-in">
              {renderStep()}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-8 py-3 rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-slate-50 transition-all duration-300 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={!canProceed() || isLoading}
              className="px-8 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-40"
            >
              {isLoading ? "Processing..." : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

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
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
