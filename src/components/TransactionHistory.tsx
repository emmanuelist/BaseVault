import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpRight, ArrowDownLeft, RefreshCw, Filter } from "lucide-react";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "all" | "send" | "receive" | "swap";

export function TransactionHistory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const { transactions, isLoading, isConnected } = useTransactions();
  
  if (!isConnected) {
    return null;
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.token.toLowerCase().includes(search.toLowerCase()) ||
      tx.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || tx.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4" />;
      case "receive":
        return <ArrowDownLeft className="h-4 w-4" />;
      case "swap":
        return <RefreshCw className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "send":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "receive":
        return "bg-success/10 text-success border-success/20";
      case "swap":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "";
    }
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Transaction History</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>
          
          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["all", "send", "receive", "swap"] as FilterType[]).map((type) => (
              <Badge
                key={type}
                variant={filter === type ? "default" : "outline"}
                className="cursor-pointer capitalize hover:bg-primary/20 transition-colors"
                onClick={() => setFilter(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {search || filter !== "all" ? "No matching transactions" : "No transactions found"}
          </p>
        ) : (
          <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center border ${getTypeColor(
                    tx.type
                  )}`}
                >
                  {getIcon(tx.type)}
                </div>
                <div>
                  <p className="font-semibold capitalize">{tx.type}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {tx.amount} {tx.token}
                </p>
                <p className="text-sm text-muted-foreground">{tx.value}</p>
              </div>
            </div>
          ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
