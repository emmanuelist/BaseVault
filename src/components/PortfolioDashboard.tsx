import { TrendingUp, Wallet, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { DashboardSkeleton } from "./skeletons/DashboardSkeleton";

export function PortfolioDashboard() {
  const { tokens, isLoading } = useTokenBalances();
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  // Calculate total portfolio value
  const totalValue = tokens.reduce((sum, token) => {
    const value = parseFloat(token.value.replace(/[$,]/g, ""));
    return sum + value;
  }, 0);
  
  // Mock 24h change - in production, calculate from historical data
  const change24h = totalValue * 0.053;
  const changePercent = 5.3;
  
  const stats = [
    {
      title: "Total Portfolio Value",
      value: `$${totalValue.toFixed(2)}`,
      change: `+${changePercent.toFixed(1)}%`,
      icon: DollarSign,
      positive: true,
    },
    {
      title: "Total Tokens",
      value: tokens.length.toString(),
      change: tokens.length > 0 ? `${tokens.length} tokens` : "No tokens",
      icon: Wallet,
      positive: true,
    },
    {
      title: "24h Change",
      value: `+$${change24h.toFixed(2)}`,
      change: `+${changePercent.toFixed(1)}%`,
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "Active Wallets",
      value: "1",
      change: "Connected",
      icon: Activity,
      positive: true,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="glass-card hover-lift border-border/50 overflow-hidden relative"
        >
          <div className="absolute inset-0 gradient-card opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs mt-1 ${
                stat.positive ? "text-success" : "text-destructive"
              }`}
            >
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
