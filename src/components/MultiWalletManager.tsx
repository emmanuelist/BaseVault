import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MultiWalletService, type WatchedWallet } from "@/lib/multiWallet";
import { Plus, Trash2, Edit2, Check, X, Wallet, Eye } from "lucide-react";
import { toast } from "sonner";

export function MultiWalletManager() {
  const [wallets, setWallets] = useState<WatchedWallet[]>(MultiWalletService.getWatchedWallets());
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  const handleAddWallet = () => {
    if (!newAddress) {
      toast.error("Please enter a wallet address");
      return;
    }

    // Basic validation
    if (!newAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Invalid Ethereum address format");
      return;
    }

    try {
      const wallet = MultiWalletService.addWallet(newAddress, newLabel || undefined);
      setWallets(MultiWalletService.getWatchedWallets());
      setNewAddress("");
      setNewLabel("");
      toast.success(`Added wallet: ${wallet.label}`);
    } catch (error) {
      toast.error("Failed to add wallet");
    }
  };

  const handleRemoveWallet = (walletId: string) => {
    MultiWalletService.removeWallet(walletId);
    setWallets(MultiWalletService.getWatchedWallets());
    toast.success("Wallet removed");
  };

  const startEditing = (wallet: WatchedWallet) => {
    setEditingId(wallet.id);
    setEditLabel(wallet.label);
  };

  const saveEdit = (walletId: string) => {
    if (!editLabel.trim()) {
      toast.error("Label cannot be empty");
      return;
    }
    MultiWalletService.updateWalletLabel(walletId, editLabel);
    setWallets(MultiWalletService.getWatchedWallets());
    setEditingId(null);
    toast.success("Wallet label updated");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLabel("");
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Multi-Wallet Manager
        </CardTitle>
        <CardDescription>
          Track multiple wallet addresses and compare portfolios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Wallet */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label (Optional)</Label>
              <Input
                id="label"
                placeholder="e.g., Trading Wallet"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleAddWallet} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        {/* Wallets List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Tracked Wallets ({wallets.length})
            </h3>
          </div>
          
          {wallets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No wallets tracked yet</p>
              <p className="text-sm">Add wallet addresses above to start tracking</p>
            </div>
          ) : (
            <div className="space-y-2">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Color indicator */}
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: wallet.color }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      {editingId === wallet.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(wallet.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => saveEdit(wallet.id)}
                          >
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{wallet.label}</span>
                            {wallet.isConnected && (
                              <Badge variant="default" className="text-xs">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono truncate">
                            {formatAddress(wallet.address)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {editingId !== wallet.id && (
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => startEditing(wallet)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleRemoveWallet(wallet.id)}
                        disabled={wallet.isConnected}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        {wallets.length > 0 && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            💡 Tip: You can track friends' wallets or your multiple addresses to compare portfolios
          </div>
        )}
      </CardContent>
    </Card>
  );
}
