import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data7d = [
  { date: "Mon", value: 23100 },
  { date: "Tue", value: 23500 },
  { date: "Wed", value: 22800 },
  { date: "Thu", value: 24000 },
  { date: "Fri", value: 23700 },
  { date: "Sat", value: 24200 },
  { date: "Sun", value: 24532 },
];

const data30d = [
  { date: "Feb 1", value: 21000 },
  { date: "Feb 5", value: 21500 },
  { date: "Feb 10", value: 22200 },
  { date: "Feb 15", value: 21800 },
  { date: "Feb 20", value: 23400 },
  { date: "Feb 25", value: 24100 },
  { date: "Feb 26", value: 24532 },
];

const data90d = [
  { date: "Dec", value: 18000 },
  { date: "Jan", value: 19500 },
  { date: "Feb", value: 24532 },
];

const dataAll = [
  { date: "Jan 1", value: 15000 },
  { date: "Jan 8", value: 16500 },
  { date: "Jan 15", value: 15800 },
  { date: "Jan 22", value: 18200 },
  { date: "Jan 29", value: 19500 },
  { date: "Feb 5", value: 21000 },
  { date: "Feb 12", value: 20500 },
  { date: "Feb 19", value: 22800 },
  { date: "Feb 26", value: 24532 },
];

type Period = "7d" | "30d" | "90d" | "all";

const dataMap: Record<Period, typeof data7d> = {
  "7d": data7d,
  "30d": data30d,
  "90d": data90d,
  all: dataAll,
};

export function PortfolioChart() {
  const [period, setPeriod] = useState<Period>("7d");
  const data = dataMap[period];
  
  const currentValue = data[data.length - 1].value;
  const previousValue = data[0].value;
  const change = ((currentValue - previousValue) / previousValue) * 100;

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">Portfolio Value</CardTitle>
            <Badge variant={change >= 0 ? "default" : "destructive"} className={change >= 0 ? "bg-success/10 text-success hover:bg-success/20" : ""}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change.toFixed(2)}%
            </Badge>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="w-fit">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs">30D</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs">90D</TabsTrigger>
              <TabsTrigger value="all" className="text-xs">ALL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              fill="url(#colorValue)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
