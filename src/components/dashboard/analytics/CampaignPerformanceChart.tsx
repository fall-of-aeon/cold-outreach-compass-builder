
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";

interface CampaignPerformanceChartProps {
  data?: Array<{
    date: string;
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
  }>;
}

const chartConfig = {
  sent: {
    label: "Sent",
    color: "hsl(var(--chart-1))",
  },
  opened: {
    label: "Opened",
    color: "hsl(var(--chart-2))",
  },
  clicked: {
    label: "Clicked", 
    color: "hsl(var(--chart-3))",
  },
  replied: {
    label: "Replied",
    color: "hsl(var(--chart-4))",
  },
};

// Mock data - replace with real data from props
const defaultData = [
  { date: "Jan 1", sent: 120, opened: 48, clicked: 12, replied: 3 },
  { date: "Jan 2", sent: 98, opened: 42, clicked: 8, replied: 2 },
  { date: "Jan 3", sent: 145, opened: 65, clicked: 18, replied: 5 },
  { date: "Jan 4", sent: 167, opened: 72, clicked: 22, replied: 7 },
  { date: "Jan 5", sent: 134, opened: 58, clicked: 15, replied: 4 },
  { date: "Jan 6", sent: 189, opened: 89, clicked: 28, replied: 9 },
  { date: "Jan 7", sent: 156, opened: 67, clicked: 19, replied: 6 },
];

export const CampaignPerformanceChart = ({ data = defaultData }: CampaignPerformanceChartProps) => {
  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Campaign Performance Trends</CardTitle>
        <CardDescription className="text-muted-foreground">
          Track email performance metrics over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-sent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-sent)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-opened)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-opened)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReplied" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-replied)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-replied)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="sent" 
                stroke="var(--color-sent)" 
                fillOpacity={1} 
                fill="url(#colorSent)" 
              />
              <Area 
                type="monotone" 
                dataKey="opened" 
                stroke="var(--color-opened)" 
                fillOpacity={1} 
                fill="url(#colorOpened)" 
              />
              <Area 
                type="monotone" 
                dataKey="replied" 
                stroke="var(--color-replied)" 
                fillOpacity={1} 
                fill="url(#colorReplied)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
