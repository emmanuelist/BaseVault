import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { base } from 'wagmi/chains';

// Popular Base network tokens
const BASE_TOKENS = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
    decimals: 6,
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    address: '0xEB796bdb90fFA0f28255275e16936D25d3418603' as `0x${string}`,
    decimals: 18,
    logo: 'https://cryptologos.cc/logos/aave-aave-logo.png',
  },
] as const;

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
] as const;

export function useTokenBalances() {
  const { address, isConnected } = useAccount();
  
  // Get ETH balance
  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address,
    chainId: base.id,
  });

  // Get ERC20 token balances
  const tokenContracts = address ? BASE_TOKENS.map((token) => ({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf' as const,
    args: [address] as const,
    chainId: base.id,
  })) : [];

  // @ts-expect-error - Complex type inference issue with useReadContracts
  const { data: tokenBalances, isLoading: tokensLoading } = useReadContracts({
    contracts: tokenContracts,
    query: {
      enabled: !!address && isConnected && tokenContracts.length > 0,
    },
  });

  const tokens = [];

  // Add ETH
  if (ethBalance) {
    const ethAmount = parseFloat(formatUnits(ethBalance.value, ethBalance.decimals));
    // Mock price - in production, fetch from Coingecko or similar
    const ethPrice = 3417;
    tokens.push({
      symbol: 'ETH',
      name: 'Ethereum',
      balance: ethAmount.toFixed(4),
      value: `$${(ethAmount * ethPrice).toFixed(2)}`,
      price: `$${ethPrice.toFixed(2)}`,
      change: 5.2, // Mock data
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    });
  }

  // Add ERC20 tokens
  if (tokenBalances) {
    BASE_TOKENS.forEach((token, index) => {
      const result = tokenBalances[index];
      if (result.status === 'success' && result.result !== undefined) {
        const balance = parseFloat(formatUnits(BigInt(result.result.toString()), token.decimals));
        
        if (balance > 0) {
          // Mock prices - in production, fetch from Coingecko
          const prices: Record<string, number> = {
            USDC: 1.0,
            AAVE: 86.53,
          };
          
          const price = prices[token.symbol] || 0;
          
          tokens.push({
            symbol: token.symbol,
            name: token.name,
            balance: balance.toFixed(token.symbol === 'USDC' ? 2 : 4),
            value: `$${(balance * price).toFixed(2)}`,
            price: `$${price.toFixed(2)}`,
            change: Math.random() * 20 - 10, // Mock data
            logo: token.logo,
          });
        }
      }
    });
  }

  return {
    tokens,
    isLoading: ethLoading || tokensLoading,
    isConnected,
  };
}
