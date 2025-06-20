
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { CampaignData } from "../types";

interface SendingConfigurationStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const SendingConfigurationStep = ({ campaignData, setCampaignData }: SendingConfigurationStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label>Email Account</Label>
        <Select value={campaignData.emailAccount} onValueChange={(value) => setCampaignData({ ...campaignData, emailAccount: value })}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select email account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">john@company.com (✅ Good standing)</SelectItem>
            <SelectItem value="secondary">sales@company.com (⚠️ New domain)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sending Schedule</Label>
        <Select value={campaignData.schedule} onValueChange={(value) => setCampaignData({ ...campaignData, schedule: value })}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Start Immediately</SelectItem>
            <SelectItem value="morning">Tomorrow Morning (9 AM)</SelectItem>
            <SelectItem value="custom">Custom Schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Daily Sending Limit</Label>
        <div className="mt-2">
          <Input
            type="number"
            value={campaignData.dailyLimit}
            onChange={(e) => setCampaignData({ ...campaignData, dailyLimit: parseInt(e.target.value) })}
            min={1}
            max={1000}
          />
          <p className="text-sm text-blue-600 mt-1">
            💡 Recommended for new domains to build reputation
          </p>
        </div>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Delivery Optimization</span>
          </div>
          <div className="space-y-1 text-sm">
            <p>✅ Optimal sending times selected</p>
            <p>✅ Spam compliance configured</p>
            <p>✅ Rate limiting enabled</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
