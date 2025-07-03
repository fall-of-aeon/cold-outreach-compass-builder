
import { Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ProcessPreviewCard = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border bg-card">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-foreground mb-4">What happens next</h4>
              <div className="space-y-3">
                {[
                  "Campaign is securely created in Supabase database",
                  "n8n workflow is triggered via secure edge function", 
                  "AI processes your targeting criteria with precision",
                  "Qualified prospects are discovered and enriched automatically", 
                  "Personalized outreach campaigns are created and launched"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-8 pt-6 border-t">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Expected Results</p>
                <p className="text-sm font-medium text-foreground">50-150 qualified leads</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Processing Time</p>
                <p className="text-sm font-medium text-foreground">15-30 minutes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
