import { WalletButton } from "@/components/WalletButton";
import { Wallet, TrendingUp, Shield, Zap } from "lucide-react";

export function EmptyState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="relative h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <Wallet className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Connect Your Wallet
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Get started by connecting your wallet to track your DeFi portfolio on Base Network
          </p>
        </div>

        {/* Connect Button */}
        <div className="flex justify-center">
          <WalletButton />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="glass-card p-6 rounded-xl hover-lift">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Track Portfolio</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your assets and portfolio performance in real-time
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl hover-lift">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your keys, your crypto. We never access your funds
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl hover-lift">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 mx-auto">
              <Zap className="h-6 w-6 text-success" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Chain</h3>
            <p className="text-sm text-muted-foreground">
              Support for Base and Base Sepolia networks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
