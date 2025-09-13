
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Eye, Send } from "lucide-react";
import { CampaignData, AirtableLead } from "../types";
import { useState } from "react";

interface EmailReviewStepProps {
  campaignData: CampaignData;
  onNext: () => void;
}

export const EmailReviewStep = ({ campaignData, onNext }: EmailReviewStepProps) => {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  // Use selected leads from previous step or fallback to empty array
  const leads: AirtableLead[] = campaignData.selectedLeads || [];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-yellow-500"; 
    return "bg-orange-500";
  };

  const handlePushToSmartlead = () => {
    console.log("Pushing to Smartlead...");
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Edit className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Review AI-Generated Emails</h2>
        <p className="text-gray-600">Our AI has written personalized emails for each qualified prospect</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-blue-900">Selected Leads</h3>
            <p className="text-sm text-blue-700">{leads.length} leads ready for email outreach</p>
          </div>
          {leads.length > 0 && (
            <Badge variant="secondary" className="bg-blue-200 text-blue-800">
              Avg Score: {Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {leads.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No leads selected from previous step.</p>
          </div>
        ) : (
          leads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                  <p className="text-sm text-gray-600">{lead.title} at {lead.company}</p>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getScoreColor(lead.score)} text-white`}>
                    <Star className="h-3 w-3 mr-1" />
                    {lead.score}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Generated Email:</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-line text-gray-700">
                    {lead.generatedEmailSubject && (
                      <div className="font-medium mb-2">Subject: {lead.generatedEmailSubject}</div>
                    )}
                    {lead.generatedEmailBody || 'Email content will be generated...'}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedLead(lead.id)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <div>
          <p className="text-sm text-gray-600">
            {leads.length} emails ready{leads.length > 0 && ` • Average score: ${Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length)}`}
          </p>
        </div>
        <Button 
          onClick={handlePushToSmartlead}
          disabled={leads.length === 0}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4 mr-2" />
          Push to Smartlead
        </Button>
      </div>
    </div>
  );
};
