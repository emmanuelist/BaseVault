import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { TokenSkeleton } from "./skeletons/TokenSkeleton";

type SortBy = "value" | "change" | "balance";

export function TokenHoldings() {
  const [sortBy, setSortBy] = useState<SortBy>("value");
  const { tokens, isLoading, isConnected } = useTokenBalances();
  
  if (!isConnected) {
    return null;
  }
  
  if (isLoading) {
    return <TokenSkeleton />;
  }
  
  const sortedTokens = [...tokens].sort((a, b) => {
    const aValue = parseFloat(a.value.replace(/[$,]/g, ""));
    const bValue = parseFloat(b.value.replace(/[$,]/g, ""));
    
    if (sortBy === "value") return bValue - aValue;
    if (sortBy === "change") return b.change - a.change;
    return parseFloat(b.balance.replace(/,/g, "")) - parseFloat(a.balance.replace(/,/g, ""));
  });
  
  if (tokens.length === 0) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Token Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No tokens found in your wallet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Token Holdings</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const order: SortBy[] = ["value", "change", "balance"];
              const current = order.indexOf(sortBy);
              setSortBy(order[(current + 1) % order.length]);
            }}
            className="text-xs gap-1"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sortBy === "value" ? "Value" : sortBy === "change" ? "Change" : "Balance"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTokens.map((token) => (
            <div
              key={token.symbol}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-border/50">
                  <img
                    src={token.logo}
                    alt={`${token.name} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 hidden items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {token.symbol[0]}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{token.symbol}</p>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{token.value}</p>
                <div className="flex items-center gap-2 justify-end">
                  <p className="text-sm text-muted-foreground">
                    {token.balance} {token.symbol}
                  </p>
                  <Badge
                    variant={token.change >= 0 ? "default" : "destructive"}
                    className={`${
                      token.change >= 0
                        ? "bg-success/10 text-success hover:bg-success/20"
                        : ""
                    }`}
                  >
                    {token.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(token.change)}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
