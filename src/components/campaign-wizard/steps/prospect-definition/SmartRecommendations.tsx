
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Users, Clock, Target } from "lucide-react";
import { CampaignData } from "../../types";

interface SmartRecommendationsProps {
  campaignData: CampaignData;
  setCampaignData: (data: CampaignData) => void;
}

interface Recommendation {
  id: string;
  type: 'optimization' | 'best-practice' | 'industry-insight';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  action?: {
    label: string;
    update: Partial<CampaignData>;
  };
}

export const SmartRecommendations = ({ campaignData, setCampaignData }: SmartRecommendationsProps) => {
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Industry-specific recommendations
    if (campaignData.industry === 'Software/SaaS') {
      recommendations.push({
        id: 'saas-timing',
        type: 'industry-insight',
        title: 'Optimal SaaS Outreach Timing',
        description: 'SaaS prospects respond best on Tuesday-Thursday, 10-11 AM in their timezone.',
        impact: 'Medium'
      });
    }

    // Seniority recommendations
    if (campaignData.seniority === 'Founder/CEO') {
      recommendations.push({
        id: 'ceo-personalization',
        type: 'best-practice',
        title: 'CEO Outreach Strategy',
        description: 'CEOs prefer concise, value-focused messages. Consider mentioning recent company news.',
        impact: 'High'
      });
    }

    // Company size optimization
    if (campaignData.companySize === '1000+ employees') {
      recommendations.push({
        id: 'enterprise-approach',
        type: 'optimization',
        title: 'Enterprise Sales Approach',
        description: 'Large companies have longer sales cycles. Consider multi-touch sequences.',
        impact: 'High',
        action: {
          label: 'Switch to Mid-Market (201-1000)',
          update: { companySize: '201-1000 employees' }
        }
      });
    }

    // Location-based insights
    if (campaignData.location === 'United States') {
      recommendations.push({
        id: 'us-market',
        type: 'industry-insight',
        title: 'US Market Insights',
        description: 'US prospects have 23% higher response rates to industry-specific case studies.',
        impact: 'Medium'
      });
    }

    // Generic best practices
    if (!campaignData.prospectDescription) {
      recommendations.push({
        id: 'add-description',
        type: 'optimization',
        title: 'Improve Targeting Precision',
        description: 'Adding specific prospect criteria can increase response rates by up to 40%.',
        impact: 'High'
      });
    }

    // Competition-based recommendations
    if (campaignData.industry === 'Software/SaaS' && campaignData.seniority === 'Founder/CEO') {
      recommendations.push({
        id: 'high-competition',
        type: 'optimization',
        title: 'High Competition Detected',
        description: 'This combination is highly targeted by competitors. Consider VP/Director level for better response rates.',
        impact: 'Medium',
        action: {
          label: 'Target VP/Director Level',
          update: { seniority: 'VP/Director' }
        }
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'best-practice': return Target;
      case 'industry-insight': return Users;
      default: return Lightbulb;
    }
  };

  const applyRecommendation = (recommendation: Recommendation) => {
    if (recommendation.action) {
      setCampaignData({ ...campaignData, ...recommendation.action.update });
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => {
          const IconComponent = getTypeIcon(rec.type);
          return (
            <div key={rec.id} className="p-4 bg-background border rounded-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <Badge className={getImpactColor(rec.impact)} variant="outline">
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
                {rec.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyRecommendation(rec)}
                    className="shrink-0"
                  >
                    {rec.action.label}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Recommendations updated based on your targeting criteria</span>
        </div>
      </CardContent>
    </Card>
  );
};
