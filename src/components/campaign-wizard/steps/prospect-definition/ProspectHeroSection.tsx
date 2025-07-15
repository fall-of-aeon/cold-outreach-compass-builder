
import { Target, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIHelperCard } from "./AIHelperCard";

interface ProspectHeroSectionProps {
  onOpenChat?: () => void;
}

export const ProspectHeroSection = ({ onOpenChat }: ProspectHeroSectionProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Target className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">Define Your Ideal Prospects</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Specify your target audience criteria to find the perfect prospects for your outreach campaign
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Precise Targeting</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered Insights</span>
        </div>
      </div>

      {onOpenChat && (
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={onOpenChat}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Try AI Assistant Instead
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Describe your prospects in natural language
          </p>
        </div>
      )}

      <AIHelperCard />
    </div>
  );
};
