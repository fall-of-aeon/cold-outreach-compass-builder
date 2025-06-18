
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock } from "lucide-react";
import { CampaignData, EstimatedResults } from "../types";

interface ReviewLaunchStepProps {
  campaignData: CampaignData;
  estimatedResults: EstimatedResults;
}

export const ReviewLaunchStep = ({ campaignData, estimatedResults }: ReviewLaunchStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Ready to Launch!</h2>
        <p className="text-gray-600">Review your campaign settings below</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Campaign Name</Label>
              <p className="font-medium">{campaignData.name || "Untitled Campaign"}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Template</Label>
              <p className="font-medium capitalize">{campaignData.template?.replace('-', ' ') || "Custom"}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Expected Prospects</Label>
              <p className="font-medium">{estimatedResults.min}-{estimatedResults.max} leads</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Daily Limit</Label>
              <p className="font-medium">{campaignData.dailyLimit} emails/day</p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Target Audience</Label>
            <p className="font-medium">{campaignData.prospectDescription || "No description provided"}</p>
          </div>

          <div>
            <Label className="text-sm text-gray-600">Subject Line</Label>
            <p className="font-medium">{campaignData.subjectLine || "No subject line"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">📋 Pre-flight Checklist</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Campaign details configured</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Email message created</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Target audience defined</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Sending settings optimized</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">What happens next?</h4>
            <div className="text-sm text-yellow-700 mt-1 space-y-1">
              <p>1. Lead generation begins (15-30 minutes)</p>
              <p>2. Prospects are verified for email accuracy</p>
              <p>3. Campaigns starts sending based on your schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
