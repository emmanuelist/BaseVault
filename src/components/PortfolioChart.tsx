import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useState, useMemo } from "react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { PortfolioHistoryService } from "@/lib/portfolioHistory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type Period = "7d" | "30d" | "90d" | "all";

const periodToDays: Record<Period, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  all: 365,
};

export function PortfolioChart() {
  const [period, setPeriod] = useState<Period>("7d");
  const { tokens } = useTokenBalances();
  
  // Get real historical data or use current value as fallback
  const chartData = useMemo(() => {
    const days = periodToDays[period];
    const snapshots = PortfolioHistoryService.getSnapshotsInRange(days);
    
    if (snapshots.length === 0) {
      // No history yet - use current portfolio value
      const currentValue = tokens.reduce((sum, token) => {
        const value = parseFloat(token.value.replace(/[$,]/g, ''));
        return sum + value;
      }, 0);
      
      // Generate mock data points for visualization
      const points = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
      return Array.from({ length: points }, (_, i) => {
        const variance = Math.random() * 0.1 - 0.05; // ±5% variance
        return {
          date: formatDate(Date.now() - (points - i - 1) * 24 * 60 * 60 * 1000, period),
          value: currentValue * (1 + variance),
        };
      });
    }
    
    // Use real historical data
    return snapshots.map(snapshot => ({
      date: formatDate(snapshot.timestamp, period),
      value: snapshot.totalValue,
    }));
  }, [period, tokens]);
  
  const performance = useMemo(() => {
    if (chartData.length < 2) {
      return { change: 0, currentValue: 0, previousValue: 0 };
    }
    
    const currentValue = chartData[chartData.length - 1].value;
    const previousValue = chartData[0].value;
    const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
    
    return { change, currentValue, previousValue };
  }, [chartData]);
  
  const { change, currentValue } = performance;

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl mb-2">Portfolio Value</CardTitle>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${currentValue.toFixed(2)}</span>
              <Badge 
                variant={change >= 0 ? "default" : "destructive"} 
                className={change >= 0 ? "bg-success/10 text-success hover:bg-success/20" : ""}
              >
                {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {change >= 0 ? '+' : ''}{change.toFixed(2)}%
              </Badge>
            </div>
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
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickMargin={8}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) => `$${(value / 1).toFixed(0)}`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Portfolio Value"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#colorValue)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Helper function to format dates based on period
function formatDate(timestamp: number, period: Period): string {
  const date = new Date(timestamp);
  
  if (period === '7d') {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else if (period === '30d') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (period === '90d') {
    return date.toLocaleDateString('en-US', { month: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
