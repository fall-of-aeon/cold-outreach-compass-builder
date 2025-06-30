
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Loader2 } from "lucide-react";
import { EnrichmentStepsList, EnrichmentStepData } from "./EnrichmentStepsList";

interface EnrichmentProgressViewProps {
  progress: number;
  enrichmentSteps: EnrichmentStepData[];
}

export const EnrichmentProgressView = ({ progress, enrichmentSteps }: EnrichmentProgressViewProps) => {
  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="relative inline-block mb-6">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Enriching Your Prospects</h2>
        <p className="text-lg text-gray-600">This usually takes 5-10 minutes. We'll gather detailed information about each lead.</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span className="font-semibold">{progress}% complete</span>
        </div>
        <div className="relative">
          <Progress value={progress} className="h-4 bg-gray-200 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Step Progress */}
      <EnrichmentStepsList steps={enrichmentSteps} isProcessing={true} />

      {/* Completion Card */}
      {progress === 100 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl animate-fade-in transform scale-105 transition-all duration-500">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h3 className="font-bold text-green-900 text-lg mb-2">Enrichment Complete!</h3>
            <p className="text-green-700">Found and enriched 47 qualified prospects</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
