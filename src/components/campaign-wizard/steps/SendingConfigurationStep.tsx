
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, Check, Mail, Clock, Shield } from "lucide-react";
import { CampaignData } from "../types";

interface SendingConfigurationStepProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

export const SendingConfigurationStep = ({ campaignData, setCampaignData }: SendingConfigurationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="emailAccount" className="text-sm font-medium">Email Account</Label>
        <Select value={campaignData.emailAccount} onValueChange={(value) => setCampaignData({ ...campaignData, emailAccount: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select email account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>john@company.com</span>
                <span className="text-xs text-muted-foreground">(Good standing)</span>
              </div>
            </SelectItem>
            <SelectItem value="secondary">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>sales@company.com</span>
                <span className="text-xs text-muted-foreground">(New domain)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule" className="text-sm font-medium">Sending Schedule</Label>
        <Select value={campaignData.schedule} onValueChange={(value) => setCampaignData({ ...campaignData, schedule: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Start Immediately</span>
              </div>
            </SelectItem>
            <SelectItem value="morning">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Tomorrow Morning (9 AM)</span>
              </div>
            </SelectItem>
            <SelectItem value="custom">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Custom Schedule</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dailyLimit" className="text-sm font-medium">Daily Sending Limit</Label>
        <Input
          id="dailyLimit"
          type="number"
          value={campaignData.dailyLimit}
          onChange={(e) => setCampaignData({ ...campaignData, dailyLimit: parseInt(e.target.value) })}
          min={1}
          max={1000}
          placeholder="Enter daily limit"
        />
        <p className="text-sm text-blue-600 flex items-center space-x-1">
          <Shield className="h-4 w-4" />
          <span>Recommended for new domains to build reputation</span>
        </p>
      </div>

      <Card className="card-modern bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-800 dark:text-green-200">Delivery Optimization</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
              <Check className="h-4 w-4" />
              <span>Optimal sending times selected</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
              <Check className="h-4 w-4" />
              <span>Spam compliance configured</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
              <Check className="h-4 w-4" />
              <span>Rate limiting enabled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
