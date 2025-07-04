
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Target, TrendingUp, MapPin, Building2, User, BarChart3 } from "lucide-react";
import { CampaignData } from "../../types";

interface InteractiveAudiencePreviewProps {
  campaignData: CampaignData;
}

interface AudienceMetrics {
  estimatedReach: number;
  qualityScore: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  recommendedDailyLimit: number;
  expectedResponseRate: number;
}

export const InteractiveAudiencePreview = ({ campaignData }: InteractiveAudiencePreviewProps) => {
  const [metrics, setMetrics] = useState<AudienceMetrics>({
    estimatedReach: 0,
    qualityScore: 0,
    competitionLevel: 'Medium',
    recommendedDailyLimit: 0,
    expectedResponseRate: 0
  });

  useEffect(() => {
    // Calculate metrics based on campaign data
    const calculateMetrics = () => {
      let baseReach = 1000;
      let qualityMultiplier = 1;
      
      // Location impact
      if (campaignData.location === 'United States') baseReach *= 3;
      else if (campaignData.location === 'Remote/Worldwide') baseReach *= 5;
      
      // Industry impact
      if (campaignData.industry === 'Software/SaaS') {
        baseReach *= 1.5;
        qualityMultiplier = 0.9; // More competitive
      } else if (campaignData.industry === 'E-commerce') {
        baseReach *= 1.3;
        qualityMultiplier = 0.8;
      }
      
      // Seniority impact
      if (campaignData.seniority === 'Founder/CEO') {
        baseReach *= 0.3;
        qualityMultiplier = 1.4;
      } else if (campaignData.seniority === 'C-Level (CTO, CMO, etc.)') {
        baseReach *= 0.5;
        qualityMultiplier = 1.2;
      }
      
      // Company size impact
      if (campaignData.companySize === '1-10 employees') {
        baseReach *= 0.8;
        qualityMultiplier = 1.1;
      } else if (campaignData.companySize === '1000+ employees') {
        baseReach *= 0.4;
        qualityMultiplier = 0.7;
      }
      
      const estimatedReach = Math.round(baseReach * (0.8 + Math.random() * 0.4));
      const qualityScore = Math.min(100, Math.round(70 * qualityMultiplier + Math.random() * 20));
      const expectedResponseRate = Math.round((qualityScore / 100) * 15 + Math.random() * 3);
      
      setMetrics({
        estimatedReach,
        qualityScore,
        competitionLevel: qualityScore > 80 ? 'Low' : qualityScore > 60 ? 'Medium' : 'High',
        recommendedDailyLimit: Math.min(100, Math.round(estimatedReach * 0.05)),
        expectedResponseRate
      });
    };
    
    if (campaignData.location && campaignData.industry && campaignData.seniority && campaignData.companySize) {
      calculateMetrics();
    }
  }, [campaignData]);

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!campaignData.location || !campaignData.industry || !campaignData.seniority || !campaignData.companySize) {
    return (
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Complete Your Targeting</h3>
          <p className="text-muted-foreground">
            Fill in the targeting criteria above to see your audience preview
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Interactive Audience Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">{metrics.estimatedReach.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Est. Prospects</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">{metrics.qualityScore}%</div>
            <div className="text-sm text-muted-foreground">Quality Score</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">{metrics.expectedResponseRate}%</div>
            <div className="text-sm text-muted-foreground">Expected Response</div>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <div className="text-2xl font-bold text-primary">{metrics.recommendedDailyLimit}</div>
            <div className="text-sm text-muted-foreground">Daily Limit</div>
          </div>
        </div>

        {/* Quality Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Audience Quality Score</span>
            <Badge className={getCompetitionColor(metrics.competitionLevel)}>
              {metrics.competitionLevel} Competition
            </Badge>
          </div>
          <Progress value={metrics.qualityScore} className="h-3" />
          <p className="text-xs text-muted-foreground">
            Higher scores indicate better targeting precision and lower competition
          </p>
        </div>

        {/* Targeting Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Target Criteria</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{campaignData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Industry:</span>
                <span className="font-medium">{campaignData.industry}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Seniority:</span>
                <span className="font-medium">{campaignData.seniority}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Company Size:</span>
                <span className="font-medium">{campaignData.companySize}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Expected Outcomes</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Time:</span>
                <span className="font-medium">15-30 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Qualified Leads:</span>
                <span className="font-medium">{Math.round(metrics.estimatedReach * 0.3)}-{Math.round(metrics.estimatedReach * 0.7)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Responses:</span>
                <span className="font-medium">{Math.round(metrics.estimatedReach * (metrics.expectedResponseRate / 100))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        {metrics.qualityScore < 70 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-800 text-sm">Optimization Suggestions</h5>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  {metrics.competitionLevel === 'High' && (
                    <li>• Consider targeting less competitive seniority levels</li>
                  )}
                  {campaignData.companySize === '1000+ employees' && (
                    <li>• Large companies have longer sales cycles - consider mid-market</li>
                  )}
                  {!campaignData.prospectDescription && (
                    <li>• Add specific criteria to improve targeting precision</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
