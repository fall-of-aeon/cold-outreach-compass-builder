
import { CheckCircle, Loader2 } from "lucide-react";

export interface EnrichmentStepData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface EnrichmentStepsListProps {
  steps: EnrichmentStepData[];
  isProcessing?: boolean;
}

export const EnrichmentStepsList = ({ steps, isProcessing = false }: EnrichmentStepsListProps) => {
  return (
    <div className="space-y-4">
      {isProcessing && (
        <h4 className="font-bold text-gray-900 text-lg mb-4">What we'll do:</h4>
      )}
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = step.status === 'completed';
        const isInProgress = step.status === 'in-progress';
        
        return (
          <div 
            key={index} 
            className={`group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 animate-fade-in transform hover:-translate-y-1 ${
              isProcessing ? (
                isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg' : 
                isInProgress ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg' : 
                'bg-gray-50 border border-gray-200'
              ) : (
                'bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg'
              )
            }`}
            style={{ animationDelay: `${isProcessing ? 0.3 + index * 0.1 : 0.5 + index * 0.1}s` }}
          >
            <div className="relative">
              {isProcessing ? (
                isCompleted ? (
                  <div className="relative">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-md animate-pulse"></div>
                  </div>
                ) : isInProgress ? (
                  <div className="relative">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md animate-ping"></div>
                  </div>
                ) : (
                  <Icon className="h-6 w-6 text-gray-400" />
                )
              ) : (
                <div className="relative">
                  <Icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
            </div>
            <div>
              <h5 className={`font-semibold transition-colors duration-300 ${
                isProcessing ? (
                  isCompleted ? 'text-green-900' : 
                  isInProgress ? 'text-blue-900' : 
                  'text-gray-500'
                ) : (
                  'text-gray-900 group-hover:text-blue-900'
                )
              }`}>
                {step.title}
              </h5>
              <p className={`text-sm transition-colors duration-300 ${
                isProcessing ? (
                  isCompleted ? 'text-green-700' : 
                  isInProgress ? 'text-blue-700' : 
                  'text-gray-500'
                ) : (
                  'text-gray-600'
                )
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
