'use client'

import { useEvmAddress } from '@coinbase/cdp-hooks'
import { useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useHyperliquidData } from '@/src/hooks/useHyperliquidData'
import { useWalletStore } from '@/src/stores/wallet'

export function RiskAlertsPanel() {
  const { evmAddress } = useEvmAddress()
  const wallet = useWalletStore()
  const hl = useHyperliquidData()

  const alerts = useMemo(() => {
    const list: string[] = []

    if (!wallet.tokens.length && !hl) return list

    const walletTotal = wallet.tokens.reduce((a, t) => a + t.value, 0)
    const hlTotal = hl?.accountValue ?? 0
    const total = walletTotal + hlTotal

    // === HyperLiquid Alerts ===
    hl?.positions.forEach((p) => {
      // leverage
      if (p.leverage > 10) {
        list.push(`${p.symbol} leverage is too high (${p.leverage}x)`)
      }

      // unrealized loss
      const lossPercent = p.pnl / (hlTotal || 1)
      if (lossPercent < -0.05) {
        list.push(`${p.symbol} unrealized loss exceeds 5% of account`)
      }

      // liquidation risk
      if (p.liq && p.liq < p.entry * 0.8) {
        list.push(`${p.symbol} liquidation price is close`)
      }

      // exposure
      const exposure = p.value / total
      if (exposure > 0.3) {
        list.push(`${p.symbol} exposure is high (${(exposure * 100).toFixed(1)}%)`)
      }
    })

    if (evmAddress) {
      // === Wallet Alerts ===
      // concentration
      wallet.tokens.forEach((t) => {
        const exposure = t.value / walletTotal
        if (exposure > 0.1) {
          list.push(`${t.symbol} dominates wallet (${(exposure * 100).toFixed(1)}%)`)
        }
      })

      // diversification
      if (wallet.tokens.length === 1) {
        list.push(`Wallet diversification is low (only ${wallet.tokens[0].symbol})`)
      }

      // stablecoin presence
      const hasStable = wallet.tokens.some((t) => ['USDC', 'EURC'].includes(t.symbol))
      if (!hasStable) {
        list.push(`Wallet has no stablecoin exposure`)
      }

      // gas balance
      const eth = wallet.tokens.find((t) => t.symbol === 'ETH')
      if (eth && eth.amount < 0.005) {
        list.push(`ETH balance is low for gas fees`)
      }

      // wallet vs HL ratio
      if (walletTotal < hlTotal * 0.1) {
        list.push('Wallet balance is too small compared to HL exposure')
      }
    }

    return list
  }, [wallet.tokens, hl, evmAddress])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Alerts</CardTitle>
      </CardHeader>

      <CardContent className='space-y-2'>
        {alerts.length === 0 && <div className='text-sm text-gray-500'>No active alerts</div>}

        {alerts.map((a, i) => (
          <div key={i} className='text-sm text-red-600'>
            {a}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
