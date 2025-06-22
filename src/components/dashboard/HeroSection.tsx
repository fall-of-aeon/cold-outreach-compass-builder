
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onCreateCampaign: () => void;
}

export const HeroSection = ({ onCreateCampaign }: HeroSectionProps) => {
  return (
    <div className="text-center mb-24">
      <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2 rounded-full text-sm text-gray-600 mb-8 shadow-sm">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="font-medium">Next-generation outreach platform</span>
      </div>
      
      <h1 className="text-6xl md:text-7xl font-extralight text-gray-900 mb-6 tracking-tight leading-[0.9]">
        Cold Outreach
        <br />
        <span className="font-light text-gray-700">
          Reimagined
        </span>
      </h1>
      
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
        Transform prospects into conversations with precision and elegance.
      </p>
      
      <Button 
        onClick={onCreateCampaign}
        size="lg"
        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-base font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        Create Campaign
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
