
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface PerformanceInsightsProps {
  stats: {
    responseRate: number;
  };
}

export const PerformanceInsights = ({ stats }: PerformanceInsightsProps) => {
  return (
    <Card className="border border-gray-200/60 bg-gray-900 text-white">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-extralight mb-4">Exceptional Performance</h3>
            <p className="text-lg text-gray-300 mb-8 font-light leading-relaxed">
              With a {stats.responseRate}% response rate, you're outperforming industry averages by 3x. 
              Your personalized approach is driving real conversations.
            </p>
            <div className="flex space-x-8">
              <div>
                <p className="text-2xl font-extralight text-emerald-400 mb-1">+247%</p>
                <p className="text-sm text-gray-400">vs industry avg</p>
              </div>
              <div>
                <p className="text-2xl font-extralight text-blue-400 mb-1">98.2%</p>
                <p className="text-sm text-gray-400">deliverability</p>
              </div>
              <div>
                <p className="text-2xl font-extralight text-white mb-1">4.2s</p>
                <p className="text-sm text-gray-400">avg. response time</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
