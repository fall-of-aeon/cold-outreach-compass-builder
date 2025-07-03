
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Hash, Type } from "lucide-react";
import { CampaignData } from "../types";

interface MessageConfigurationStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const MessageConfigurationStep = ({ campaignData, setCampaignData }: MessageConfigurationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subjectLine" className="text-sm font-medium flex items-center space-x-2">
          <Hash className="h-4 w-4" />
          <span>Subject Line</span>
        </Label>
        <Input
          id="subjectLine"
          placeholder="e.g., Quick question about {{company}} growth"
          value={campaignData.subjectLine}
          onChange={(e) => setCampaignData({ ...campaignData, subjectLine: e.target.value })}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Use tokens for personalization</span>
          <span>{campaignData.subjectLine.length}/100</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="emailBody" className="text-sm font-medium flex items-center space-x-2">
          <Type className="h-4 w-4" />
          <span>Email Message</span>
        </Label>
        <Textarea
          id="emailBody"
          placeholder="Hi {{firstName}},

I noticed {{company}} recently expanded their team. Congratulations!

I wanted to reach out because..."
          value={campaignData.emailBody}
          onChange={(e) => setCampaignData({ ...campaignData, emailBody: e.target.value })}
          className="min-h-[200px] resize-none rounded-lg"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Available tokens: firstName, company, title</span>
          <span>{campaignData.emailBody.length} characters</span>
        </div>
      </div>

      <Card className="card-modern bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-blue-800 dark:text-blue-200">Spam Score: Low Risk</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your message follows best practices for deliverability
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
