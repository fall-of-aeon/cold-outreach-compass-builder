
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Edit, Eye, Send } from "lucide-react";
import { EnrichedLead } from "../types";
import { useState } from "react";

interface EmailReviewStepProps {
  onNext: () => void;
}

export const EmailReviewStep = ({ onNext }: EmailReviewStepProps) => {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  // Mock data - in real app this would come from your n8n workflow
  const mockLeads: EnrichedLead[] = [
    {
      id: "1",
      name: "Sarah Chen",
      title: "Founder & CEO",
      company: "TechFlow Solutions",
      email: "sarah@techflow.com",
      linkedinProfile: "linkedin.com/in/sarahchen",
      companyWebsite: "techflow.com",
      generatedEmail: "Hi Sarah,\n\nI noticed TechFlow Solutions recently expanded to the West Coast - congratulations! Your focus on streamlining B2B workflows caught my attention.\n\nI'd love to show you how we're helping similar SaaS founders reduce their customer acquisition costs by 40%. Would you be open to a brief 15-minute call this week?\n\nBest regards,\n[Your name]",
      score: 92
    },
    {
      id: "2", 
      name: "Marcus Rodriguez",
      title: "CTO",
      company: "DataVault Inc",
      email: "marcus@datavault.com",
      generatedEmail: "Hi Marcus,\n\nSaw your recent post about scaling infrastructure challenges at DataVault. Your insights on distributed systems really resonated.\n\nWe've helped similar CTOs solve scaling issues while cutting costs by 30%. Would you be interested in a quick chat about your current challenges?\n\nCheers,\n[Your name]",
      score: 88
    },
    {
      id: "3",
      name: "Jessica Park",
      title: "VP of Growth", 
      company: "CloudMetrics",
      email: "jessica@cloudmetrics.com",
      generatedEmail: "Hi Jessica,\n\nI came across CloudMetrics' impressive growth trajectory - 200% YoY is fantastic! Your approach to product-led growth is inspiring.\n\nI'd love to share how we're helping similar growth leaders accelerate their funnels. Free for a 10-minute call this week?\n\nBest,\n[Your name]",
      score: 85
    }
  ];

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
            <h3 className="font-semibold text-blue-900">Qualified Prospects Found</h3>
            <p className="text-sm text-blue-700">{mockLeads.length} high-quality leads ready for outreach</p>
          </div>
          <Badge variant="secondary" className="bg-blue-200 text-blue-800">
            AI Score: 88.3 avg
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {mockLeads.map((lead) => (
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
                    {lead.generatedEmail}
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
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <div>
          <p className="text-sm text-gray-600">
            {mockLeads.length} emails ready • Average AI score: 88.3
          </p>
        </div>
        <Button 
          onClick={handlePushToSmartlead}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Send className="h-4 w-4 mr-2" />
          Push to Smartlead
        </Button>
      </div>
    </div>
  );
};
