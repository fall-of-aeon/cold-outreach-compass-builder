
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const AIHelperCard = () => {
  const handleAIHelper = () => {
    console.log("AI Helper clicked - would open prompt assistant");
  };

  return (
    <Card className="max-w-4xl mx-auto border bg-muted/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-1">AI-Powered Targeting</h3>
              <p className="text-sm text-muted-foreground">Let our AI help you refine your targeting criteria for maximum impact</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleAIHelper} 
            className="px-4 py-2"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Optimize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
