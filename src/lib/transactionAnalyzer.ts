// Transaction categorization and DeFi protocol detection

export type TransactionCategory = 
  | 'send' 
  | 'receive' 
  | 'swap' 
  | 'mint' 
  | 'burn'
  | 'approve'
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'deposit'
  | 'withdraw'
  | 'contract_interaction'
  | 'unknown';

export interface DeFiProtocol {
  name: string;
  type: 'dex' | 'lending' | 'staking' | 'bridge' | 'other';
  logo?: string;
}

// Known DeFi protocol addresses on Base network
const PROTOCOL_ADDRESSES: Record<string, DeFiProtocol> = {
  // Uniswap V3 on Base
  '0x2626664c2603336e57b271c5c0b26f421741e481': {
    name: 'Uniswap V3',
    type: 'dex',
  },
  '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24': {
    name: 'Uniswap Universal Router',
    type: 'dex',
  },
  // Aave on Base
  '0xa238dd80c259a72e81d7e4664a9801593f98d1c5': {
    name: 'Aave V3',
    type: 'lending',
  },
  // Aerodrome (Base DEX)
  '0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43': {
    name: 'Aerodrome',
    type: 'dex',
  },
  // Compound on Base
  '0x9c4ec768c28520b50860ea7a15bd7213a9ff58bf': {
    name: 'Compound V3',
    type: 'lending',
  },
  // BaseSwap
  '0x327df1e6de05895d2ab08513aadd9313fe505d86': {
    name: 'BaseSwap',
    type: 'dex',
  },
};

// Function signatures for common operations
const FUNCTION_SIGNATURES: Record<string, TransactionCategory> = {
  '0xa9059cbb': 'send',       // transfer(address,uint256)
  '0x23b872dd': 'send',       // transferFrom(address,address,uint256)
  '0x095ea7b3': 'approve',    // approve(address,uint256)
  '0x38ed1739': 'swap',       // swapExactTokensForTokens
  '0x7ff36ab5': 'swap',       // swapExactETHForTokens
  '0x40c10f19': 'mint',       // mint(address,uint256)
  '0x42966c68': 'burn',       // burn(uint256)
  '0xa694fc3a': 'stake',      // stake(uint256)
  '0x2e1a7d4d': 'withdraw',   // withdraw(uint256)
  '0x3ccfd60b': 'withdraw',   // withdraw()
  '0x4e71d92d': 'claim',      // claim()
};

export class TransactionAnalyzer {
  /**
   * Categorize a transaction based on its data
   */
  static categorizeTransaction(
    from: string,
    to: string,
    value: string,
    input: string,
    userAddress: string
  ): TransactionCategory {
    const isFromUser = from.toLowerCase() === userAddress.toLowerCase();
    const isToUser = to.toLowerCase() === userAddress.toLowerCase();
    
    // Simple ETH transfer
    if (input === '0x' || input === '0x0') {
      return isFromUser ? 'send' : 'receive';
    }

    // Check function signature (first 10 characters: 0x + 8 hex chars)
    const signature = input.slice(0, 10);
    if (FUNCTION_SIGNATURES[signature]) {
      return FUNCTION_SIGNATURES[signature];
    }

    // If interacting with a contract
    if (input.length > 10) {
      return 'contract_interaction';
    }

    return 'unknown';
  }

  /**
   * Detect DeFi protocol from address
   */
  static detectProtocol(address: string): DeFiProtocol | null {
    const lowercaseAddress = address.toLowerCase();
    return PROTOCOL_ADDRESSES[lowercaseAddress] || null;
  }

  /**
   * Get a human-readable description of the transaction
   */
  static getTransactionDescription(
    category: TransactionCategory,
    protocol: DeFiProtocol | null,
    tokenSymbol?: string
  ): string {
    if (protocol) {
      switch (category) {
        case 'swap':
          return `Swap on ${protocol.name}`;
        case 'deposit':
          return `Deposit to ${protocol.name}`;
        case 'withdraw':
          return `Withdraw from ${protocol.name}`;
        case 'stake':
          return `Stake on ${protocol.name}`;
        case 'unstake':
          return `Unstake from ${protocol.name}`;
        default:
          return `${this.getCategoryLabel(category)} via ${protocol.name}`;
      }
    }

    const token = tokenSymbol ? ` ${tokenSymbol}` : '';
    
    switch (category) {
      case 'send':
        return `Send${token}`;
      case 'receive':
        return `Receive${token}`;
      case 'swap':
        return `Token Swap`;
      case 'mint':
        return `Mint${token}`;
      case 'burn':
        return `Burn${token}`;
      case 'approve':
        return `Approve${token}`;
      case 'stake':
        return `Stake${token}`;
      case 'unstake':
        return `Unstake${token}`;
      case 'claim':
        return `Claim Rewards`;
      case 'deposit':
        return `Deposit${token}`;
      case 'withdraw':
        return `Withdraw${token}`;
      case 'contract_interaction':
        return 'Contract Interaction';
      default:
        return 'Transaction';
    }
  }

  /**
   * Get category label
   */
  static getCategoryLabel(category: TransactionCategory): string {
    const labels: Record<TransactionCategory, string> = {
      send: 'Send',
      receive: 'Receive',
      swap: 'Swap',
      mint: 'Mint',
      burn: 'Burn',
      approve: 'Approve',
      stake: 'Stake',
      unstake: 'Unstake',
      claim: 'Claim',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      contract_interaction: 'Contract',
      unknown: 'Unknown',
    };
    return labels[category];
  }

  /**
   * Get category color
   */
  static getCategoryColor(category: TransactionCategory): string {
    const colors: Record<TransactionCategory, string> = {
      send: 'text-red-500',
      receive: 'text-green-500',
      swap: 'text-blue-500',
      mint: 'text-purple-500',
      burn: 'text-orange-500',
      approve: 'text-yellow-500',
      stake: 'text-emerald-500',
      unstake: 'text-amber-500',
      claim: 'text-teal-500',
      deposit: 'text-indigo-500',
      withdraw: 'text-pink-500',
      contract_interaction: 'text-gray-500',
      unknown: 'text-muted-foreground',
    };
    return colors[category];
  }

  /**
   * Calculate total gas spent across transactions
   */
  static calculateTotalGas(transactions: any[]): {
    totalGasUsed: number;
    totalGasCost: string;
    averageGasPrice: string;
  } {
    let totalGasUsed = 0;
    let totalGasCostWei = BigInt(0);

    transactions.forEach((tx) => {
      if (tx.gasUsed && tx.gasPrice) {
        totalGasUsed += parseInt(tx.gasUsed);
        totalGasCostWei += BigInt(tx.gasUsed) * BigInt(tx.gasPrice);
      }
    });

    const totalGasCostEth = Number(totalGasCostWei) / 1e18;
    const averageGasPrice = transactions.length > 0
      ? Number(totalGasCostWei / BigInt(totalGasUsed || 1)) / 1e9
      : 0;

    return {
      totalGasUsed,
      totalGasCost: totalGasCostEth.toFixed(6),
      averageGasPrice: averageGasPrice.toFixed(2),
    };
  }

  /**
   * Get gas analytics for a specific period
   */
  static getGasAnalytics(transactions: any[], days: number = 30): {
    totalSpent: string;
    transactionCount: number;
    avgPerTx: string;
    highestTx: string;
  } {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    const recentTxs = transactions.filter((tx) => {
      const timestamp = parseInt(tx.timeStamp) * 1000;
      return timestamp >= cutoffTime;
    });

    const { totalGasCost } = this.calculateTotalGas(recentTxs);
    const avgPerTx = recentTxs.length > 0
      ? (parseFloat(totalGasCost) / recentTxs.length).toFixed(6)
      : '0';

    // Find highest gas tx
    let highestGas = 0;
    recentTxs.forEach((tx) => {
      if (tx.gasUsed && tx.gasPrice) {
        const gasCost = (BigInt(tx.gasUsed) * BigInt(tx.gasPrice)) / BigInt(1e18);
        if (Number(gasCost) > highestGas) {
          highestGas = Number(gasCost);
        }
      }
    });

    return {
      totalSpent: totalGasCost,
      transactionCount: recentTxs.length,
      avgPerTx,
      highestTx: highestGas.toFixed(6),
    };
  }
}
