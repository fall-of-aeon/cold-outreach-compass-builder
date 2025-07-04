
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

interface ConversionFunnelChartProps {
  data?: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
}

const chartConfig = {
  count: {
    label: "Prospects",
    color: "hsl(var(--primary))",
  },
};

const defaultData = [
  { stage: "Total Leads", count: 1250, percentage: 100 },
  { stage: "Qualified", count: 890, percentage: 71.2 },
  { stage: "Contacted", count: 645, percentage: 51.6 },
  { stage: "Opened", count: 387, percentage: 31.0 },
  { stage: "Replied", count: 89, percentage: 7.1 },
  { stage: "Meeting Booked", count: 23, percentage: 1.8 },
];

const colors = [
  "hsl(var(--primary))",
  "hsl(142 76% 40%)",
  "hsl(142 76% 45%)", 
  "hsl(142 76% 50%)",
  "hsl(142 76% 55%)",
  "hsl(142 76% 60%)",
];

export const ConversionFunnelChart = ({ data = defaultData }: ConversionFunnelChartProps) => {
  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Conversion Funnel</CardTitle>
        <CardDescription className="text-muted-foreground">
          Lead progression through outreach stages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                type="category"
                dataKey="stage"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={100}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Stage
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Count
                            </span>
                            <span className="font-bold">
                              {data.count}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Conversion
                            </span>
                            <span className="font-bold">
                              {data.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
