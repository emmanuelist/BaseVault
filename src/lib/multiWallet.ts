// Multi-wallet management service
// Allows users to track multiple wallet addresses

export interface WatchedWallet {
  id: string;
  address: string;
  label: string;
  addedAt: number;
  color: string; // For visual distinction
  isConnected: boolean; // If it's the currently connected wallet
}

const STORAGE_KEY = 'basevault_watched_wallets';
const COLORS = [
  '#0EA5E9', // Sky blue
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
];

export class MultiWalletService {
  // Get all watched wallets
  static getWatchedWallets(): WatchedWallet[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing watched wallets:', error);
      return [];
    }
  }

  // Add a new wallet to watch
  static addWallet(address: string, label?: string): WatchedWallet {
    const wallets = this.getWatchedWallets();
    
    // Check if wallet already exists
    const existing = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (existing) {
      return existing;
    }
    
    const newWallet: WatchedWallet = {
      id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      address,
      label: label || `Wallet ${wallets.length + 1}`,
      addedAt: Date.now(),
      color: COLORS[wallets.length % COLORS.length],
      isConnected: false,
    };
    
    wallets.push(newWallet);
    this.saveWallets(wallets);
    
    return newWallet;
  }

  // Remove a watched wallet
  static removeWallet(walletId: string): void {
    const wallets = this.getWatchedWallets();
    const filtered = wallets.filter(w => w.id !== walletId);
    this.saveWallets(filtered);
  }

  // Update wallet label
  static updateWalletLabel(walletId: string, newLabel: string): void {
    const wallets = this.getWatchedWallets();
    const wallet = wallets.find(w => w.id === walletId);
    
    if (wallet) {
      wallet.label = newLabel;
      this.saveWallets(wallets);
    }
  }

  // Mark wallet as connected
  static setConnectedWallet(address: string | undefined): void {
    const wallets = this.getWatchedWallets();
    
    wallets.forEach(w => {
      w.isConnected = address ? w.address.toLowerCase() === address.toLowerCase() : false;
    });
    
    // If connected wallet is not in the list, add it
    if (address && !wallets.find(w => w.address.toLowerCase() === address.toLowerCase())) {
      const newWallet = this.addWallet(address, 'My Wallet');
      newWallet.isConnected = true;
    }
    
    this.saveWallets(wallets);
  }

  // Get wallet by ID
  static getWallet(walletId: string): WatchedWallet | undefined {
    const wallets = this.getWatchedWallets();
    return wallets.find(w => w.id === walletId);
  }

  // Get wallet by address
  static getWalletByAddress(address: string): WatchedWallet | undefined {
    const wallets = this.getWatchedWallets();
    return wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
  }

  // Save wallets to localStorage
  private static saveWallets(wallets: WatchedWallet[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
    } catch (error) {
      console.error('Error saving watched wallets:', error);
    }
  }

  // Clear all watched wallets
  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export wallets as JSON
  static exportWallets(): string {
    const wallets = this.getWatchedWallets();
    return JSON.stringify(wallets, null, 2);
  }

  // Import wallets from JSON
  static importWallets(jsonData: string): void {
    try {
      const wallets = JSON.parse(jsonData);
      this.saveWallets(wallets);
    } catch (error) {
      console.error('Error importing wallets:', error);
      throw new Error('Invalid wallet data');
    }
  }

  // Get total count
  static getWalletCount(): number {
    return this.getWatchedWallets().length;
  }

  // Update wallet color
  static updateWalletColor(walletId: string, color: string): void {
    const wallets = this.getWatchedWallets();
    const wallet = wallets.find(w => w.id === walletId);
    
    if (wallet) {
      wallet.color = color;
      this.saveWallets(wallets);
    }
  }
}
