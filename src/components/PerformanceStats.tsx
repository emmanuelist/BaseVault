import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { PortfolioHistoryService } from "@/lib/portfolioHistory";
import { useMemo } from "react";

export function PerformanceStats() {
  const { tokens } = useTokenBalances();
  
  const stats = useMemo(() => {
    // Calculate performance for different periods
    const performance7d = PortfolioHistoryService.calculatePerformance(7);
    const performance30d = PortfolioHistoryService.calculatePerformance(30);
    
    // Get best and worst performers
    const bestPerformer = PortfolioHistoryService.getBestPerformer(30);
    const worstPerformer = PortfolioHistoryService.getWorstPerformer(30);
    
    // Calculate current allocation
    const totalValue = tokens.reduce((sum, token) => {
      return sum + parseFloat(token.value.replace(/[$,]/g, ''));
    }, 0);
    
    const allocation = tokens.map(token => {
      const value = parseFloat(token.value.replace(/[$,]/g, ''));
      return {
        symbol: token.symbol,
        percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
      };
    });
    
    return {
      performance7d,
      performance30d,
      bestPerformer,
      worstPerformer,
      allocation,
      totalValue,
    };
  }, [tokens]);
  
  const { performance7d, performance30d, bestPerformer, worstPerformer, allocation } = stats;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 7D Performance */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            7 Day Performance
          </CardTitle>
          {performance7d.changePercent >= 0 ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performance7d.changePercent >= 0 ? '+' : ''}
            {performance7d.changePercent.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ${Math.abs(performance7d.change).toFixed(2)} {performance7d.change >= 0 ? 'gain' : 'loss'}
          </p>
        </CardContent>
      </Card>

      {/* 30D Performance */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            30 Day Performance
          </CardTitle>
          {performance30d.changePercent >= 0 ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performance30d.changePercent >= 0 ? '+' : ''}
            {performance30d.changePercent.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ${Math.abs(performance30d.change).toFixed(2)} {performance30d.change >= 0 ? 'gain' : 'loss'}
          </p>
        </CardContent>
      </Card>

      {/* Best Performer */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Best Performer (30d)
          </CardTitle>
          <Award className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          {bestPerformer ? (
            <>
              <div className="text-2xl font-bold">{bestPerformer.symbol}</div>
              <p className="text-xs text-success mt-1">
                +{bestPerformer.changePercent.toFixed(2)}%
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">
                Need more history
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Top Allocation */}
      <Card className="glass-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Allocation
          </CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          {allocation.length > 0 ? (
            <>
              <div className="text-2xl font-bold">{allocation[0].symbol}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {allocation[0].percentage.toFixed(1)}% of portfolio
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">
                No tokens yet
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
