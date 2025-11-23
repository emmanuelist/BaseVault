import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Receipt } from "lucide-react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTransactions } from "@/hooks/useTransactions";
import { PortfolioHistoryService } from "@/lib/portfolioHistory";
import { toast } from "sonner";

export function AdvancedExportButton() {
  const { tokens } = useTokenBalances();
  const { transactions } = useTransactions();

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header]?.toString() || "";
          // Escape commas and quotes
          return value.includes(",") ? `"${value}"` : value;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filename}!`);
  };

  const exportPortfolio = () => {
    const portfolioData = tokens.map((token) => ({
      Token: token.symbol,
      Name: token.name,
      Balance: token.balance,
      Price: token.price,
      Value: token.value,
      "24h_Change": `${token.change.toFixed(2)}%`,
    }));

    exportToCSV(portfolioData, "portfolio");
  };

  const exportTransactions = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const txData = transactions.map((tx) => ({
      Date: tx.date,
      Type: tx.type,
      Token: tx.token,
      Amount: tx.amount,
      Value: tx.value,
      To: tx.to || "-",
      From: tx.from || "-",
      Status: tx.status,
      Hash: tx.hash,
    }));

    exportToCSV(txData, "transactions");
  };

  const exportTaxReport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions for tax report");
      return;
    }

    // IRS Form 8949 format
    const taxData = transactions
      .filter((tx) => tx.status === "completed")
      .map((tx) => ({
        Description: `${tx.amount} ${tx.token}`,
        "Date_Acquired": tx.date,
        "Date_Sold": tx.date,
        Proceeds: tx.value,
        "Cost_Basis": tx.value,
        "Gain_Loss": "0.00", // Would need historical cost basis
        Type: tx.type === "send" ? "Short-term" : "N/A",
      }));

    exportToCSV(taxData, "tax_report_8949");
  };

  const exportHistoricalData = () => {
    const history = PortfolioHistoryService.getHistory();

    if (history.snapshots.length === 0) {
      toast.error("No historical data available yet");
      return;
    }

    const historyData = history.snapshots.map((snapshot) => ({
      Date: new Date(snapshot.timestamp).toLocaleDateString(),
      "Total_Value": `$${snapshot.totalValue.toFixed(2)}`,
      ...snapshot.tokens.reduce((acc, token) => {
        acc[`${token.symbol}_Balance`] = token.balance;
        acc[`${token.symbol}_Value`] = token.value;
        return acc;
      }, {} as Record<string, string>),
    }));

    exportToCSV(historyData, "portfolio_history");
  };

  const exportFullReport = () => {
    // Combine all data into comprehensive report
    const performance7d = PortfolioHistoryService.calculatePerformance(7);
    const performance30d = PortfolioHistoryService.calculatePerformance(30);

    const totalValue = tokens.reduce((sum, token) => {
      return sum + parseFloat(token.value.replace(/[$,]/g, ""));
    }, 0);

    const reportData = [
      { Section: "Portfolio Summary", Value: "" },
      { Section: "Total Value", Value: `$${totalValue.toFixed(2)}` },
      { Section: "Total Tokens", Value: tokens.length },
      { Section: "7d Performance", Value: `${performance7d.changePercent.toFixed(2)}%` },
      { Section: "30d Performance", Value: `${performance30d.changePercent.toFixed(2)}%` },
      { Section: "", Value: "" },
      { Section: "Token Holdings", Value: "" },
      ...tokens.map((token) => ({
        Section: token.symbol,
        Value: `${token.balance} (${token.value})`,
      })),
    ];

    exportToCSV(reportData, "full_portfolio_report");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={exportPortfolio}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Portfolio Snapshot (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exportTransactions}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Transaction History (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exportHistoricalData}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Historical Data (CSV)</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={exportTaxReport}>
          <Receipt className="mr-2 h-4 w-4" />
          <span>Tax Report (Form 8949)</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={exportFullReport}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Full Portfolio Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
