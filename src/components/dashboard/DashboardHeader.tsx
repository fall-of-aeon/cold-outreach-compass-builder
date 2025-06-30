
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface DashboardHeaderProps {
  onCreateCampaign: () => void;
}

export const DashboardHeader = ({ onCreateCampaign }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          AI Cold Outreach Automation
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Automated prospect research, lead scoring, and personalized outreach campaigns
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          ✅ Connected to Supabase • n8n • Airtable • SmartLead
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button 
          onClick={onCreateCampaign}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Campaign
        </Button>
      </div>
    </div>
  );
};
