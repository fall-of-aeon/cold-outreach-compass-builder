
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  onCreateCampaign: () => void;
}

export const DashboardHeader = ({ onCreateCampaign }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 border-b border-border pb-6 lg:pb-8">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
          AI Cold Outreach
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
          Automated prospect research, lead scoring, and personalized outreach campaigns
        </p>
        <div className="flex items-center text-sm text-primary">
          <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
          <span className="font-medium">Connected to Supabase • n8n • Airtable • SmartLead</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button 
          onClick={onCreateCampaign}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-200 animate-fade-in"
        >
          <Plus className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Create New Campaign</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>
    </div>
  );
};
