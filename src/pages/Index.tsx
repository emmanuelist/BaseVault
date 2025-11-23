import { WalletButton } from "@/components/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdvancedExportButton } from "@/components/AdvancedExportButton";
import { PortfolioDashboard } from "@/components/PortfolioDashboard";
import { PerformanceStats } from "@/components/PerformanceStats";
import { TokenHoldings } from "@/components/TokenHoldings";
import { PortfolioChart } from "@/components/PortfolioChart";
import { PortfolioAllocation } from "@/components/PortfolioAllocation";
import { TransactionHistory } from "@/components/TransactionHistory";
import { GasAnalytics } from "@/components/GasAnalytics";
import { NFTGallery } from "@/components/NFTGallery";
import { MultiWalletManager } from "@/components/MultiWalletManager";
import { EmptyState } from "@/components/EmptyState";
import { Wallet2, Download } from "lucide-react";
import { useAccount } from "wagmi";
import { usePortfolioTracking } from "@/hooks/usePortfolioTracking";
import { useEffect } from "react";
import { MultiWalletService } from "@/lib/multiWallet";

const Index = () => {
  const { isConnected, address } = useAccount();
  
  // Automatically track portfolio history
  usePortfolioTracking();
  
  // Update connected wallet in multi-wallet service
  useEffect(() => {
    MultiWalletService.setConnectedWallet(address);
  }, [address]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                <Wallet2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  BaseVault
                </h1>
                <p className="text-xs text-muted-foreground">Secure DeFi Portfolio Tracker</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <AdvancedExportButton />
              <ThemeToggle />
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {/* Dashboard Stats */}
            <section className="animate-slide-up">
              <PortfolioDashboard />
            </section>

            {/* Performance Stats */}
            <section className="animate-slide-up" style={{ animationDelay: "0.05s" }}>
              <PerformanceStats />
            </section>

            {/* Chart */}
            <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <PortfolioChart />
            </section>

            {/* Token Holdings and Portfolio Allocation */}
            <section
              className="grid gap-8 lg:grid-cols-2 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <TokenHoldings />
              <PortfolioAllocation />
            </section>

            {/* Multi-Wallet Manager */}
            <section className="animate-slide-up" style={{ animationDelay: "0.25s" }}>
              <MultiWalletManager />
            </section>

            {/* Gas Analytics */}
            <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <GasAnalytics />
            </section>

            {/* NFT Gallery */}
            <section className="animate-slide-up" style={{ animationDelay: "0.35s" }}>
              <NFTGallery />
            </section>

            {/* Transaction History */}
            <section className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <TransactionHistory />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built on{" "}
            <span className="text-primary font-semibold">Base Network</span> • Real-time
            DeFi Portfolio Tracking
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
