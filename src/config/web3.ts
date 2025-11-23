import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'

// Get projectId from environment or use a placeholder
export const projectId = '870932a1b71549eb99cfcd5a2165e6e4'

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Base Portfolio Tracker',
  description: 'Track your DeFi portfolio on Base network',
  url: 'https://baseportfolio.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [base, baseSepolia] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})
