
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CampaignData, CampaignWizardProps, EstimatedResults } from "./campaign-wizard/types";
import { steps } from "./campaign-wizard/data";
import { calculateEstimatedResults, calculateProspectQuality } from "./campaign-wizard/utils";
import { CampaignBasicsStep } from "./campaign-wizard/steps/CampaignBasicsStep";
import { MessageConfigurationStep } from "./campaign-wizard/steps/MessageConfigurationStep";
import { AudienceSetupStep } from "./campaign-wizard/steps/AudienceSetupStep";
import { SendingConfigurationStep } from "./campaign-wizard/steps/SendingConfigurationStep";
import { ReviewLaunchStep } from "./campaign-wizard/steps/ReviewLaunchStep";

export const CampaignWizard = ({ onClose, onComplete }: CampaignWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    type: "",
    template: "",
    subjectLine: "",
    emailBody: "",
    prospectDescription: "",
    emailAccount: "",
    schedule: "immediate",
    dailyLimit: 250
  });

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    toast({
      title: "Campaign Launched Successfully!",
      description: "Your campaign is now being processed. Lead generation will begin shortly.",
    });
    onComplete();
  };

  const getEstimatedResults = (): EstimatedResults => {
    const quality = calculateProspectQuality(campaignData.prospectDescription);
    return calculateEstimatedResults(quality);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CampaignBasicsStep campaignData={campaignData} setCampaignData={setCampaignData} />;
      case 2:
        return <MessageConfigurationStep campaignData={campaignData} setCampaignData={setCampaignData} />;
      case 3:
        return <AudienceSetupStep campaignData={campaignData} setCampaignData={setCampaignData} />;
      case 4:
        return <SendingConfigurationStep campaignData={campaignData} setCampaignData={setCampaignData} />;
      case 5:
        return <ReviewLaunchStep campaignData={campaignData} estimatedResults={getEstimatedResults()} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onClose}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Campaign</h1>
              <p className="text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-xs ${
                  index + 1 <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === 5 ? (
            <Button
              onClick={handleLaunch}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              🚀 Launch Campaign
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
