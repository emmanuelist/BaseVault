import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

export function ExportButton() {
  const handleExport = () => {
    // Sample portfolio data
    const portfolioData = [
      {
        Token: "ETH",
        Balance: "2.5",
        Price: "$3,417.00",
        Value: "$8,542.50",
        Change24h: "+5.2%",
      },
      {
        Token: "USDC",
        Balance: "5,000",
        Price: "$1.00",
        Value: "$5,000.00",
        Change24h: "+0.01%",
      },
      {
        Token: "UNI",
        Balance: "450",
        Price: "$10.00",
        Value: "$4,500.00",
        Change24h: "-2.3%",
      },
      {
        Token: "AAVE",
        Balance: "75",
        Price: "$86.53",
        Value: "$6,489.95",
        Change24h: "+8.7%",
      },
    ];

    // Convert to CSV
    const csv = Papa.unparse(portfolioData);

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Portfolio exported successfully!");
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="border-primary/50 hover:bg-primary/10 text-primary"
    >
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
