# 🏦 BaseVault

**Advanced Portfolio Tracker for Base Network**

BaseVault is a comprehensive Web3 portfolio management dashboard built specifically for the Base blockchain ecosystem. Track your crypto holdings, analyze performance, manage multiple wallets, and export detailed reports—all without requiring a backend or smart contracts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Base](https://img.shields.io/badge/Network-Base-0052FF)

## 🌟 Features

### 📊 Historical Portfolio Tracking
- **365-Day Snapshots**: Automatic daily portfolio value tracking stored locally
- **Interactive Charts**: Visualize portfolio performance over 7D, 30D, 90D, or ALL time
- **Performance Metrics**: Track 7-day and 30-day returns with percentage changes
- **Best Performers**: Identify top-performing tokens in your portfolio

### 📈 Advanced Analytics
- **Performance Dashboard**: Real-time stats showing 7D/30D returns
- **Portfolio Allocation**: Pie chart visualization of asset distribution
- **Best/Worst Performers**: Quickly identify winners and losers
- **Value Tracking**: Total portfolio value with USD conversion

### 👛 Multi-Wallet Support
- **Unlimited Wallets**: Track any number of Base addresses
- **Custom Labels**: Name your wallets (Main, Trading, Cold Storage, etc.)
- **Color Coding**: Assign colors for easy visual identification
- **Easy Switching**: Seamlessly switch between tracked addresses
- **Address Management**: Add, edit, and remove wallets on the fly

### 🔍 Transaction Intelligence
- **Smart Categorization**: Automatically categorizes transactions
  - Send/Receive
  - Swap
  - Contract Interaction
  - Approval
  - NFT Transfer
- **DeFi Protocol Detection**: Identifies interactions with major protocols
  - Uniswap
  - Aave
  - Aerodrome
  - BaseSwap
  - Compound
  - SushiSwap
  - And more...
- **Gas Analytics**: 30-day gas spending insights
  - Total gas spent
  - Average gas per transaction
  - Highest single transaction cost
  - Transaction count

### 🔔 Alerts & Notifications
- **Price Alerts**: Set custom price targets for any token
- **Browser Notifications**: Get notified when price conditions are met
- **Alert Management**: View, edit, and delete active alerts
- **Multiple Conditions**: Support for both "above" and "below" thresholds

### 📤 Export & Reporting
- **Multiple Export Formats**: CSV and detailed reports
- **Portfolio Snapshot**: Export current token holdings with values
- **Transaction History**: Full transaction export with categorization
- **Historical Data**: Export portfolio value over time
- **Tax Reports**: IRS Form 8949 compatible format for capital gains
- **Comprehensive Reports**: Full portfolio export with all data

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Fully responsive theme system
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Skeleton Loaders**: Smooth loading states
- **Empty States**: Helpful guidance when no data is available
- **Intuitive Navigation**: Clean, organized dashboard layout

### 🔐 Security & Privacy
- **Local Storage**: All data stored in your browser
- **No Backend**: No servers, no third-party data collection
- **Self-Custodial**: You control your keys and data
- **Privacy First**: Track wallets without exposing private keys

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern UI library with hooks
- **TypeScript 5.8.3**: Type-safe development
- **Vite 5.4.19**: Lightning-fast build tool and dev server

### Web3 Integration
- **Wagmi 2.19.4**: React hooks for Ethereum
- **Viem 2.39.0**: TypeScript Ethereum library
- **Web3Modal 5.1.11**: Beautiful wallet connection UI
- **WalletConnect 2.x**: Multi-wallet support
- **@reown/walletkit**: Advanced wallet functionality

### UI Components
- **shadcn/ui**: High-quality React components
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Recharts**: Powerful charting library

### State & Data Management
- **TanStack React Query 5.83.0**: Server state management
- **LocalStorage API**: Client-side persistence
- **Browser Notification API**: Native notifications

### Networks Supported
- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia Testnet** (Chain ID: 84532)

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **Bun**: Fast JavaScript runtime (or use npm/yarn)
- **Base Wallet**: MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/emmanuelist/BaseVault.git
   cd BaseVault
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Add your API keys** (optional but recommended)
   ```env
   # BaseScan API for transaction history
   VITE_BASESCAN_API_KEY=your_basescan_api_key
   
   # Alchemy API for NFT gallery (optional)
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

5. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:8080
   ```

### Building for Production

```bash
bun run build
# or
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
# or
npm run preview
```

## 📖 Usage Guide

### Connecting Your Wallet

1. Click the **"Connect Wallet"** button in the top right
2. Select your preferred wallet provider
3. Approve the connection request
4. Your Base address will appear, and data will start loading

### Tracking Multiple Wallets

1. Scroll to the **"Multi-Wallet Manager"** section
2. Click **"Add Wallet"** 
3. Enter a Base address (0x...)
4. Give it a custom label (e.g., "Cold Storage")
5. Choose a color for easy identification
6. Click **"Add"**

You can track any Base address—you don't need to own it!

### Setting Price Alerts

1. Navigate to the **"Alert Manager"** section
2. Click **"Enable Notifications"** (first time only)
3. Select a token from the dropdown
4. Choose condition (Above/Below)
5. Enter target price
6. Click **"Add Alert"**

You'll receive browser notifications when the price condition is met.

### Exporting Your Data

1. Click the **"Advanced Export"** button
2. Choose export type:
   - **Portfolio Snapshot**: Current holdings
   - **Transaction History**: All transactions with categories
   - **Portfolio History**: Historical values
   - **Tax Report**: IRS Form 8949 format
   - **Full Report**: Everything combined
3. File downloads automatically as CSV

### Viewing Analytics

- **Performance Stats**: Top cards show 7D/30D returns
- **Portfolio Chart**: Interactive graph with time period selector
- **Allocation Pie Chart**: Visual breakdown of holdings
- **Gas Analytics**: 30-day spending insights
- **Transaction History**: Categorized transaction list

## 🗂️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── skeletons/      # Loading states
│   ├── PortfolioDashboard.tsx
│   ├── PortfolioChart.tsx
│   ├── TokenHoldings.tsx
│   ├── NFTGallery.tsx
│   ├── TransactionHistory.tsx
│   ├── PerformanceStats.tsx
│   ├── PortfolioAllocation.tsx
│   ├── MultiWalletManager.tsx
│   ├── GasAnalytics.tsx
│   ├── AlertManager.tsx
│   └── AdvancedExportButton.tsx
├── config/             # Configuration
│   └── web3.ts        # Web3Modal and Wagmi setup
├── hooks/             # Custom React hooks
│   ├── useTokenBalances.ts
│   ├── useTransactions.ts
│   ├── useNFTs.ts
│   └── usePortfolioTracking.ts
├── lib/               # Utility libraries
│   ├── utils.ts
│   ├── portfolioHistory.ts      # Historical tracking
│   ├── multiWallet.ts           # Multi-wallet management
│   ├── transactionAnalyzer.ts   # Transaction intelligence
│   └── alertService.ts          # Alert & notification system
├── pages/             # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
└── App.tsx            # Main app component
```

## 🎯 Key Services

### Portfolio History Service
Manages daily snapshots and performance tracking:
- `saveSnapshot()`: Records daily portfolio value
- `getSnapshotsInRange()`: Retrieves historical data
- `calculatePerformance()`: Computes returns
- `getBestPerformer()`: Identifies top token

### Multi-Wallet Service
Handles multiple wallet tracking:
- `addWallet()`: Adds new address to track
- `removeWallet()`: Removes tracked address
- `updateWalletLabel()`: Changes wallet name
- `setConnectedWallet()`: Sets active wallet

### Transaction Analyzer
Categorizes and analyzes transactions:
- `categorizeTransaction()`: Identifies transaction type
- `detectProtocol()`: Recognizes DeFi protocols
- `getGasAnalytics()`: Calculates gas metrics

### Alert Service
Manages price alerts and notifications:
- `addPriceAlert()`: Creates new alert
- `checkPriceAlerts()`: Monitors price conditions
- `sendNotification()`: Triggers browser notification
- `requestNotificationPermission()`: Asks for permission

## 🔧 Configuration

### Environment Variables

```env
# Required for transaction history
VITE_BASESCAN_API_KEY=your_key_here

# Optional: For NFT gallery
VITE_ALCHEMY_API_KEY=your_key_here

# ⚠️ NEVER commit private keys!
# Use wallet connection instead
```

### Getting API Keys

**BaseScan API Key** (Free):
1. Visit [BaseScan.org](https://basescan.org)
2. Create account and verify email
3. Go to API-KEYs section
4. Generate new key

**Alchemy API Key** (Free tier available):
1. Visit [Alchemy.com](https://www.alchemy.com)
2. Sign up for account
3. Create new app on Base network
4. Copy API key from dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and TypeScript patterns
- Add comments for complex logic
- Test changes on both Base Mainnet and Sepolia
- Ensure responsive design works on mobile
- Update README for new features

## 🐛 Known Issues & Limitations

- **LocalStorage Limits**: Browser storage typically caps at 5-10MB
- **Historical Data**: Limited to 365 days of snapshots
- **Rate Limits**: BaseScan/Alchemy APIs have free tier limits
- **NFT Support**: Requires Alchemy API key for full functionality
- **Price Data**: Relies on real-time token prices from Base network

## 🛣️ Roadmap

### Phase 2 (Future)
- [ ] Smart contract integration for on-chain portfolio tracking
- [ ] DeFi position tracking (lending, staking, liquidity)
- [ ] Portfolio comparison with other addresses
- [ ] Advanced tax reporting (multi-country support)
- [ ] Mobile app (React Native)
- [ ] Cloud backup options

### Phase 3 (Later)
- [ ] Multi-chain support (Ethereum, Optimism, Arbitrum)
- [ ] Social features (share portfolios, leaderboards)
- [ ] AI-powered insights and recommendations
- [ ] Automated trading strategies
- [ ] Portfolio rebalancing tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base Network**: Built for the Base Talent Protocol
- **shadcn/ui**: Beautiful component library
- **Wagmi Team**: Excellent Web3 React hooks
- **WalletConnect**: Seamless wallet integration
- **Recharts**: Powerful chart visualizations
- **Radix UI**: Accessible component primitives

## ⚠️ Disclaimer

BaseVault is provided "as is" without warranty of any kind. This tool is for informational purposes only and should not be considered financial advice. Always verify transaction data on BaseScan.org. The developers are not responsible for any financial losses incurred while using this software.
