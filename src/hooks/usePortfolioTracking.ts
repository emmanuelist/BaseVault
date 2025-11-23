import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTokenBalances } from './useTokenBalances';
import { PortfolioHistoryService } from '@/lib/portfolioHistory';

/**
 * Hook that automatically tracks portfolio history
 * Creates daily snapshots for historical charts
 */
export function usePortfolioTracking() {
  const { address, isConnected } = useAccount();
  const { tokens, isLoading } = useTokenBalances();

  useEffect(() => {
    if (!isConnected || !address || isLoading || tokens.length === 0) {
      return;
    }

    // Calculate total portfolio value
    const totalValue = tokens.reduce((sum, token) => {
      const value = parseFloat(token.value.replace(/[$,]/g, ''));
      return sum + value;
    }, 0);

    // Create snapshot
    const snapshot = {
      timestamp: Date.now(),
      totalValue,
      tokens: tokens.map(t => ({
        symbol: t.symbol,
        balance: t.balance,
        value: t.value,
        price: t.price,
      })),
      walletAddress: address,
    };

    // Save to history
    PortfolioHistoryService.saveSnapshot(snapshot);
  }, [address, isConnected, tokens, isLoading]);

  return {
    history: PortfolioHistoryService.getHistory(),
  };
}
