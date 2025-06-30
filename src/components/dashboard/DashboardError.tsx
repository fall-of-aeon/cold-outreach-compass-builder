
import { Button } from "@/components/ui/button";

interface DashboardErrorProps {
  error?: string;
}

export const DashboardError = ({ error }: DashboardErrorProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-destructive mb-4">
          Error loading dashboard: {error}
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    </div>
  );
};
