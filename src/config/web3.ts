import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { formatJsonRpcRequest } from '@walletconnect/utils'

// Get projectId from environment or use a placeholder
export const projectId = '870932a1b71549eb99cfcd5a2165e6e4'

if (!projectId) throw new Error('Project ID is not defined')

// Enhanced metadata with WalletConnect integration
const metadata = {
  name: 'BaseVault',
  description: 'Secure DeFi Portfolio Tracker on Base Network',
  url: 'https://basevault.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig with enhanced WalletConnect support
const chains = [base, baseSepolia] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: true,
})

// Export utility function for formatting JSON-RPC requests
export { formatJsonRpcRequest }
