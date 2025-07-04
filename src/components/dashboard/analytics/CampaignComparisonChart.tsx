
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface CampaignComparisonData {
  campaign: string;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  openRate: number;
  replyRate: number;
}

interface CampaignComparisonChartProps {
  data?: CampaignComparisonData[];
}

const chartConfig = {
  sent: {
    label: "Emails Sent",
    color: "hsl(var(--chart-1))",
  },
  opened: {
    label: "Opened",
    color: "hsl(var(--chart-2))",
  },
  replied: {
    label: "Replied",
    color: "hsl(var(--chart-4))",
  },
};

const defaultData: CampaignComparisonData[] = [
  {
    campaign: "Tech Startups Q1",
    sent: 450,
    opened: 162,
    clicked: 45,
    replied: 23,
    openRate: 36.0,
    replyRate: 5.1
  },
  {
    campaign: "SaaS Outreach",
    sent: 320,
    opened: 128,
    clicked: 38,
    replied: 19,
    openRate: 40.0,
    replyRate: 5.9
  },
  {
    campaign: "Enterprise Sales",
    sent: 280,
    opened: 84,
    clicked: 21,
    replied: 12,
    openRate: 30.0,
    replyRate: 4.3
  },
  {
    campaign: "Marketing Agencies",
    sent: 390,
    opened: 156,
    clicked: 47,
    replied: 28,
    openRate: 40.0,
    replyRate: 7.2
  }
];

export const CampaignComparisonChart = ({ data = defaultData }: CampaignComparisonChartProps) => {
  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Campaign Performance Comparison</CardTitle>
        <CardDescription className="text-muted-foreground">
          Compare key metrics across your active campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="campaign"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CampaignComparisonData;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="mb-2">
                          <span className="font-medium text-foreground">{label}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Sent: <span className="font-medium">{data.sent}</span></div>
                          <div>Opened: <span className="font-medium">{data.opened}</span></div>
                          <div>Replied: <span className="font-medium">{data.replied}</span></div>
                          <div>Open Rate: <span className="font-medium">{data.openRate}%</span></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="sent" fill="var(--color-sent)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="opened" fill="var(--color-opened)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="replied" fill="var(--color-replied)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
