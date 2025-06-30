
import { Loader2 } from "lucide-react";

export const DashboardLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-foreground" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
};
