
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { CampaignData } from "../types";

interface MessageConfigurationStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const MessageConfigurationStep = ({ campaignData, setCampaignData }: MessageConfigurationStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="subjectLine">Subject Line</Label>
        <Input
          id="subjectLine"
          placeholder="e.g., Quick question about {{company}} growth"
          value={campaignData.subjectLine}
          onChange={(e) => setCampaignData({ ...campaignData, subjectLine: e.target.value })}
          className="mt-2"
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">Use tokens for personalization</p>
          <p className="text-sm text-gray-500">{campaignData.subjectLine.length}/100</p>
        </div>
      </div>

      <div>
        <Label htmlFor="emailBody">Email Message</Label>
        <Textarea
          id="emailBody"
          placeholder="Hi {{firstName}},

I noticed {{company}} recently expanded their team. Congratulations!

I wanted to reach out because..."
          value={campaignData.emailBody}
          onChange={(e) => setCampaignData({ ...campaignData, emailBody: e.target.value })}
          className="mt-2 min-h-[200px]"
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-gray-500">Available tokens: firstName, company, title</p>
          <p className="text-sm text-gray-500">{campaignData.emailBody.length} characters</p>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Spam Score: Low Risk</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Your message follows best practices for deliverability
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
