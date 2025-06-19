
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Mail, Eye, Reply, AlertTriangle, Play, Pause, Square } from "lucide-react";
import { CampaignData } from "../types";

interface CampaignMonitorStepProps {
  campaignData: CampaignData;
  onComplete: () => void;
}

export const CampaignMonitorStep = ({ campaignData, onComplete }: CampaignMonitorStepProps) => {
  // Mock campaign data - in real app this would come from Smartlead API
  const campaignStats = {
    totalLeads: 47,
    emailsSent: 28,
    opened: 12,
    replied: 3,
    bounced: 1,
    status: 'active' as const
  };

  const openRate = (campaignStats.opened / campaignStats.emailsSent * 100).toFixed(1);
  const replyRate = (campaignStats.replied / campaignStats.emailsSent * 100).toFixed(1);
  const bounceRate = (campaignStats.bounced / campaignStats.emailsSent * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Campaign Monitor</h2>
        <p className="text-gray-600">Your campaign is now active in Smartlead</p>
      </div>

      <div className="flex justify-center mb-6">
        <Badge className="bg-green-100 text-green-800 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Campaign Active</span>
          </div>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{campaignStats.emailsSent}</p>
            <p className="text-sm text-gray-600">Emails Sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{openRate}%</p>
            <p className="text-sm text-gray-600">Open Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Reply className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{replyRate}%</p>
            <p className="text-sm text-gray-600">Reply Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bounceRate}%</p>
            <p className="text-sm text-gray-600">Bounce Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Leads Processed</span>
                <span>{campaignStats.emailsSent} of {campaignStats.totalLeads}</span>
              </div>
              <Progress value={(campaignStats.emailsSent / campaignStats.totalLeads) * 100} className="h-3" />
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• {campaignStats.totalLeads - campaignStats.emailsSent} leads remaining</p>
              <p>• Next batch scheduled for tomorrow at 9:00 AM</p>
              <p>• Estimated completion: 3 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button variant="outline">
          <Pause className="h-4 w-4 mr-2" />
          Pause Campaign
        </Button>
        <Button variant="outline">
          <Square className="h-4 w-4 mr-2" />
          Stop Campaign
        </Button>
        <Button onClick={onComplete}>
          <BarChart3 className="h-4 w-4 mr-2" />
          View Full Dashboard
        </Button>
      </div>
    </div>
  );
};
