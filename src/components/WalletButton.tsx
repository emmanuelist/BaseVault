import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function WalletButton() {
  const { open } = useWeb3Modal()
  const { address, isConnected, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openInExplorer = () => {
    if (address) {
      window.open(`https://basescan.org/address/${address}`, '_blank')
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="glass-card px-3 py-2 rounded-lg flex items-center gap-2">
          <p className="text-sm font-medium">{formatAddress(address)}</p>
          <div className="flex gap-1">
            <Button
              onClick={copyAddress}
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-accent"
              title="Copy address"
            >
              <Copy className={`h-3 w-3 ${copied ? 'text-success' : ''}`} />
            </Button>
            <Button
              onClick={openInExplorer}
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-accent"
              title="View on BaseScan"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => open()}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
    >
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
