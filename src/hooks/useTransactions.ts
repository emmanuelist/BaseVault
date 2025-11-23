import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { base } from 'wagmi/chains';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap';
  token: string;
  amount: string;
  value: string;
  to?: string;
  from?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

export function useTransactions() {
  const { address, isConnected } = useAccount();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', address, base.id],
    queryFn: async () => {
      if (!address) return [];
      
      // Using Basescan API
      const basescanKey = import.meta.env.VITE_BASESCAN_API_KEY;
      
      if (!basescanKey) {
        console.warn('Basescan API key not found. Using mock transaction data.');
        return [];
      }

      try {
        const response = await fetch(
          `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${basescanKey}`
        );

        if (!response.ok) {
          console.error('Failed to fetch transactions');
          return [];
        }

        const data = await response.json();
        
        if (data.status !== '1' || !data.result) {
          return [];
        }

        return data.result.map((tx: any) => {
          const isReceive = tx.to.toLowerCase() === address.toLowerCase();
          const value = (parseInt(tx.value) / 1e18).toFixed(4);
          
          return {
            id: tx.hash,
            type: isReceive ? 'receive' : 'send',
            token: 'ETH',
            amount: value,
            value: `$${(parseFloat(value) * 3417).toFixed(2)}`, // Mock ETH price
            to: isReceive ? undefined : `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`,
            from: isReceive ? `${tx.from.slice(0, 6)}...${tx.from.slice(-4)}` : undefined,
            date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
            status: tx.txreceipt_status === '1' ? 'completed' : 'failed',
            hash: tx.hash,
          } as Transaction;
        }).slice(0, 20); // Limit to 20 most recent
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
    },
    enabled: !!address && isConnected,
  });

  return {
    transactions: transactions || [],
    isLoading,
    isConnected,
  };
}
