import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionAnalyzer } from "@/lib/transactionAnalyzer";
import { useMemo } from "react";
import { Fuel, TrendingUp, TrendingDown, Activity } from "lucide-react";

export function GasAnalytics() {
  const { transactions } = useTransactions();

  const analytics = useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalSpent: '0',
        transactionCount: 0,
        avgPerTx: '0',
        highestTx: '0',
      };
    }

    // Calculate for last 30 days
    return TransactionAnalyzer.getGasAnalytics(transactions as any[], 30);
  }, [transactions]);

  if (transactions.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          Gas Analytics (30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Gas Spent */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Gas Spent</p>
            <p className="text-2xl font-bold">{analytics.totalSpent} ETH</p>
            <p className="text-xs text-muted-foreground">
              ${(parseFloat(analytics.totalSpent) * 3417).toFixed(2)} USD
            </p>
          </div>

          {/* Transaction Count */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{analytics.transactionCount}</p>
            <p className="text-xs text-muted-foreground">
              <Activity className="h-3 w-3 inline mr-1" />
              Last 30 days
            </p>
          </div>

          {/* Average per TX */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Avg per Transaction</p>
            <p className="text-2xl font-bold">{analytics.avgPerTx} ETH</p>
            <p className="text-xs text-muted-foreground">
              ${(parseFloat(analytics.avgPerTx) * 3417).toFixed(2)} USD
            </p>
          </div>

          {/* Highest TX */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Highest Transaction</p>
            <p className="text-2xl font-bold">{analytics.highestTx} ETH</p>
            <p className="text-xs text-destructive">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Peak gas cost
            </p>
          </div>
        </div>

        {/* Gas saving tip */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-medium">Gas Saving Tip:</span> Base network offers significantly
            lower fees than Ethereum mainnet. Average Base transaction: ~$0.01-0.05
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
