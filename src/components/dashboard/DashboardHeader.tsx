
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  onCreateCampaign: () => void;
}

export const DashboardHeader = ({ onCreateCampaign }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center border-b border-border pb-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          AI Cold Outreach Automation
        </h1>
        <p className="text-muted-foreground text-lg">
          Automated prospect research, lead scoring, and personalized outreach campaigns
        </p>
        <p className="text-sm text-primary mt-2 flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
          Connected to Supabase • n8n • Airtable • SmartLead
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button 
          onClick={onCreateCampaign}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Campaign
        </Button>
      </div>
    </div>
  );
};
