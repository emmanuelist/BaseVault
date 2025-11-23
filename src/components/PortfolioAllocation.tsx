import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMemo } from "react";

const COLORS = [
  "hsl(193, 95%, 50%)", // Primary
  "hsl(280, 70%, 60%)", // Purple
  "hsl(38, 92%, 50%)",  // Amber
  "hsl(142, 76%, 36%)", // Green
  "hsl(0, 84%, 60%)",   // Red
  "hsl(330, 81%, 60%)", // Pink
];

export function PortfolioAllocation() {
  const { tokens, isLoading } = useTokenBalances();

  const chartData = useMemo(() => {
    if (tokens.length === 0) return [];

    const totalValue = tokens.reduce((sum, token) => {
      const value = parseFloat(token.value.replace(/[$,]/g, ""));
      return sum + value;
    }, 0);

    return tokens.map((token, index) => {
      const value = parseFloat(token.value.replace(/[$,]/g, ""));
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

      return {
        name: token.symbol,
        value: value,
        percentage: percentage,
        color: COLORS[index % COLORS.length],
      };
    }).filter(item => item.value > 0);
  }, [tokens]);

  if (isLoading) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading allocation...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No token holdings to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.percentage.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string, props: any) => [
                `$${value.toFixed(2)} (${props.payload.percentage.toFixed(2)}%)`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value}: ${entry.payload.value.toFixed(2)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Detailed breakdown */}
        <div className="mt-6 space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>${item.value.toFixed(2)}</span>
                <span className="font-medium">{item.percentage.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
