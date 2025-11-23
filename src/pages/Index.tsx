import { WalletButton } from "@/components/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportButton } from "@/components/ExportButton";
import { PortfolioDashboard } from "@/components/PortfolioDashboard";
import { TokenHoldings } from "@/components/TokenHoldings";
import { PortfolioChart } from "@/components/PortfolioChart";
import { TransactionHistory } from "@/components/TransactionHistory";
import { NFTGallery } from "@/components/NFTGallery";
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
              {/* Export Button - Icon only on mobile */}
              <div className="hidden sm:block">
                <ExportButton />
              </div>
              <button className="sm:hidden h-9 w-9 rounded-md border border-border/50 hover:bg-accent hover:text-accent-foreground flex items-center justify-center">
                <Download className="h-4 w-4" />
              </button>
              
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
          <div className="space-y-10">
            {/* Dashboard Stats */}
            <section className="animate-slide-up">
              <PortfolioDashboard />
            </section>

            {/* Chart */}
            <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <PortfolioChart />
            </section>

            {/* Token Holdings and NFTs */}
            <section
              className="grid gap-8 lg:grid-cols-2 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <TokenHoldings />
              <div className="lg:col-span-2">
                <NFTGallery />
              </div>
            </section>

            {/* Transaction History */}
            <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
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
