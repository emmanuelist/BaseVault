// Historical portfolio tracking service
// Stores daily snapshots in localStorage for historical charts

interface PortfolioSnapshot {
  timestamp: number;
  totalValue: number;
  tokens: {
    symbol: string;
    balance: string;
    value: string;
    price: string;
  }[];
  walletAddress: string;
}

interface PortfolioHistory {
  snapshots: PortfolioSnapshot[];
  lastUpdated: number;
}

const STORAGE_KEY = 'basevault_portfolio_history';
const SNAPSHOT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

export class PortfolioHistoryService {
  // Get all historical snapshots
  static getHistory(): PortfolioHistory {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { snapshots: [], lastUpdated: 0 };
    }
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing portfolio history:', error);
      return { snapshots: [], lastUpdated: 0 };
    }
  }

  // Save a new snapshot
  static saveSnapshot(snapshot: PortfolioSnapshot): void {
    const history = this.getHistory();
    
    // Check if we need a new snapshot (only once per day)
    const now = Date.now();
    const lastSnapshot = history.snapshots[history.snapshots.length - 1];
    
    if (lastSnapshot && (now - lastSnapshot.timestamp) < SNAPSHOT_INTERVAL) {
      // Update the last snapshot instead of creating a new one
      history.snapshots[history.snapshots.length - 1] = snapshot;
    } else {
      // Add new snapshot
      history.snapshots.push(snapshot);
    }
    
    // Keep only last 365 days
    const oneYearAgo = now - (365 * SNAPSHOT_INTERVAL);
    history.snapshots = history.snapshots.filter(s => s.timestamp > oneYearAgo);
    
    history.lastUpdated = now;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving portfolio history:', error);
    }
  }

  // Get snapshots for a specific time range
  static getSnapshotsInRange(days: number): PortfolioSnapshot[] {
    const history = this.getHistory();
    const cutoffTime = Date.now() - (days * SNAPSHOT_INTERVAL);
    
    return history.snapshots.filter(s => s.timestamp >= cutoffTime);
  }

  // Calculate portfolio performance
  static calculatePerformance(days: number): {
    startValue: number;
    endValue: number;
    change: number;
    changePercent: number;
  } {
    const snapshots = this.getSnapshotsInRange(days);
    
    if (snapshots.length < 2) {
      return {
        startValue: 0,
        endValue: 0,
        change: 0,
        changePercent: 0,
      };
    }
    
    const startValue = snapshots[0].totalValue;
    const endValue = snapshots[snapshots.length - 1].totalValue;
    const change = endValue - startValue;
    const changePercent = (change / startValue) * 100;
    
    return {
      startValue,
      endValue,
      change,
      changePercent,
    };
  }

  // Get best performing token
  static getBestPerformer(days: number): {
    symbol: string;
    changePercent: number;
  } | null {
    const snapshots = this.getSnapshotsInRange(days);
    
    if (snapshots.length < 2) return null;
    
    const firstSnapshot = snapshots[0];
    const lastSnapshot = snapshots[snapshots.length - 1];
    
    let bestToken = { symbol: '', changePercent: -Infinity };
    
    firstSnapshot.tokens.forEach(firstToken => {
      const lastToken = lastSnapshot.tokens.find(t => t.symbol === firstToken.symbol);
      if (lastToken) {
        const firstValue = parseFloat(firstToken.value.replace(/[$,]/g, ''));
        const lastValue = parseFloat(lastToken.value.replace(/[$,]/g, ''));
        const changePercent = ((lastValue - firstValue) / firstValue) * 100;
        
        if (changePercent > bestToken.changePercent) {
          bestToken = { symbol: firstToken.symbol, changePercent };
        }
      }
    });
    
    return bestToken.symbol ? bestToken : null;
  }

  // Get worst performing token
  static getWorstPerformer(days: number): {
    symbol: string;
    changePercent: number;
  } | null {
    const snapshots = this.getSnapshotsInRange(days);
    
    if (snapshots.length < 2) return null;
    
    const firstSnapshot = snapshots[0];
    const lastSnapshot = snapshots[snapshots.length - 1];
    
    let worstToken = { symbol: '', changePercent: Infinity };
    
    firstSnapshot.tokens.forEach(firstToken => {
      const lastToken = lastSnapshot.tokens.find(t => t.symbol === firstToken.symbol);
      if (lastToken) {
        const firstValue = parseFloat(firstToken.value.replace(/[$,]/g, ''));
        const lastValue = parseFloat(lastToken.value.replace(/[$,]/g, ''));
        const changePercent = ((lastValue - firstValue) / firstValue) * 100;
        
        if (changePercent < worstToken.changePercent) {
          worstToken = { symbol: firstToken.symbol, changePercent };
        }
      }
    });
    
    return worstToken.symbol ? worstToken : null;
  }

  // Clear all history (for testing or reset)
  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export history as JSON
  static exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  // Import history from JSON
  static importHistory(jsonData: string): void {
    try {
      const history = JSON.parse(jsonData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error importing portfolio history:', error);
      throw new Error('Invalid history data');
    }
  }
}
