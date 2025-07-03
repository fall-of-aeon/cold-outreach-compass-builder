
import { Target } from "lucide-react";

export const ProspectHeroSection = () => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-6">
        <Target className="h-6 w-6 text-primary" />
      </div>
      <h2 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
        Define Your Ideal Prospects
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Precision targeting to find your perfect customers
      </p>
    </div>
  );
};
