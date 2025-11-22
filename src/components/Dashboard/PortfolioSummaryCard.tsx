'use client'

import { SummaryCard } from '@/src/components/Dashboard/SummaryCard'
import { useHyperliquidData } from '@/src/hooks/useHyperliquidData'
import { useHyperliquidStore } from '@/src/stores/hyperliquid'
import { useWalletStore } from '@/src/stores/wallet'
import { formatUsdc } from '@/src/utils/format'

export function PortfolioSummaryCard() {
  const hl = useHyperliquidData()
  const tokens = useWalletStore((s) => s.tokens)
  const walletLoading = useWalletStore((s) => s.loading)
  const hlLoading = useHyperliquidStore((s) => s.loading)

  const walletValue = tokens.reduce((sum, t) => sum + (t.value || 0), 0)
  const hlValue = hl?.accountValue ?? 0
  const unrealizedPnl = hl?.totalUnrealized ?? 0

  const total = walletValue + hlValue

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <SummaryCard title='Total Portfolio Value' value={formatUsdc(total)} loading={walletLoading || hlLoading} />

      <SummaryCard title='Wallet Value' value={formatUsdc(walletValue)} loading={walletLoading} />

      <SummaryCard title='HL Account Value' value={hl ? formatUsdc(hlValue) : '—'} loading={hlLoading} />

      <SummaryCard
        title='Unrealized PnL'
        value={formatUsdc(unrealizedPnl)}
        loading={hlLoading}
        highlight={unrealizedPnl}
      />
    </div>
  )
}
