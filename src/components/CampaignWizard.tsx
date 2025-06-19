
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CampaignData, CampaignWizardProps } from "./campaign-wizard/types";
import { steps } from "./campaign-wizard/data";
import { ProspectDefinitionStep } from "./campaign-wizard/steps/ProspectDefinitionStep";
import { LeadEnrichmentStep } from "./campaign-wizard/steps/LeadEnrichmentStep";
import { EmailReviewStep } from "./campaign-wizard/steps/EmailReviewStep";
import { CampaignMonitorStep } from "./campaign-wizard/steps/CampaignMonitorStep";

export const CampaignWizard = ({ onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const nextStep = () => {
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
        return campaignData.location && campaignData.industry && campaignData.seniority && campaignData.companySize;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with smooth slide-in animation */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="hover:scale-110 transition-all duration-300 hover:bg-white/50 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="transform transition-all duration-700 ease-out">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Create New Campaign
              </h1>
              <p className="text-gray-600 mt-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Step {currentStep} of {steps.length}
          </div>
        </div>

        {/* Enhanced Progress Bar with smooth animations */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative">
            <Progress 
              value={(currentStep / steps.length) * 100} 
              className="h-3 bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-700 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-xs transition-all duration-500 ease-out transform ${
                  index + 1 <= currentStep 
                    ? "text-blue-600 font-semibold scale-110" 
                    : "text-gray-400 hover:text-gray-600"
                } ${index + 1 === currentStep ? "animate-pulse" : ""}`}
              >
                <div className={`w-2 h-2 rounded-full mx-auto mb-2 transition-all duration-300 ${
                  index + 1 <= currentStep 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg" 
                    : "bg-gray-300"
                }`}></div>
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content with smooth transitions */}
        <div className="relative">
          <Card className="mb-8 border-0 shadow-2xl bg-white/80 backdrop-blur-xl transform transition-all duration-500 ease-out hover:shadow-3xl hover:-translate-y-1">
            <CardContent className="p-8">
              <div 
                key={currentStep}
                className="animate-fade-in"
                style={{ animationDuration: '0.6s' }}
              >
                {renderStep()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Navigation with smooth hover effects */}
        {currentStep < 4 && (
          <div className="flex justify-between animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="group bg-white/70 backdrop-blur-sm border-white/30 hover:bg-white/90 hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Previous
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={!canProceed()}
              className="group bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
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
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};
