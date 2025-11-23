'use client'

import { useEvmAddress } from '@coinbase/cdp-hooks'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { useHyperliquidData } from '@/src/hooks/useHyperliquidData'
import { useWalletStore } from '@/src/stores/wallet'

import { Button } from '../ui/button'

type Alert = {
  message: string
  fixable: boolean
  fixLabel?: string
  onFix?: () => void
}

export function RiskAlertsPanel() {
  const wallet = useWalletStore()
  const hl = useHyperliquidData()
  const { evmAddress } = useEvmAddress()

  const alerts = useMemo<Alert[]>(() => {
    const list: Alert[] = []

    const walletTotal = wallet.tokens?.reduce((s, t) => s + t.value, 0) ?? 0
    const hlTotal = hl?.accountValue ?? 0
    const total = walletTotal + hlTotal

    // HL alerts
    if (hl && hl.positions.length > 0) {
      hl.positions.forEach((p) => {
        if (p.leverage > 10) {
          list.push({
            message: `${p.symbol} leverage is too high (${p.leverage}x)`,
            fixable: true,
            fixLabel: 'Reduce leverage',
            onFix: () => notImplemented('Reduce leverage'),
          })
        }

        if (p.pnl < 0 && Math.abs(p.pnl) > hlTotal * 0.05) {
          list.push({
            message: `${p.symbol} unrealized loss exceeds 5 % of account`,
            fixable: false,
          })
        }

        if (p.liq && p.liq < p.entry * 0.8) {
          list.push({
            message: `${p.symbol} liquidation price is close`,
            fixable: true,
            fixLabel: 'Reduce size',
            onFix: () => notImplemented('Reduce size'),
          })
        }

        const exposure = p.value / total
        if (exposure > 0.3) {
          list.push({
            message: `${p.symbol} exposure is high (${(exposure * 100).toFixed(1)} %)`,
            fixable: false,
          })
        }
      })
    }

    // Wallet alerts
    if (evmAddress) {
      wallet.tokens?.forEach((t) => {
        const exposure = walletTotal > 0 ? t.value / walletTotal : 0
        if (exposure > 0.2) {
          list.push({
            message: `${t.symbol} dominates wallet (${(exposure * 100).toFixed(1)} %)`,
            fixable: true,
            fixLabel: 'Rebalance',
            onFix: () => notImplemented('Rebalance'),
          })
        }
      })

      const eth = wallet.tokens?.find((t) => t.symbol === 'ETH')
      if (eth && eth.amount < 0.005) {
        list.push({
          message: 'ETH balance is low for gas fees',
          fixable: true,
          fixLabel: 'Buy ETH',
          onFix: () => notImplemented('Buy ETH'),
        })
      }

      const hasStable = wallet.tokens?.some((t) => t.symbol === 'USDC' || t.symbol === 'EURC')
      if (!hasStable) {
        list.push({
          message: 'Wallet has no stablecoin exposure',
          fixable: true,
          fixLabel: 'Buy USDC',
          onFix: () => notImplemented('Buy USDC'),
        })
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
          <div key={i} className='flex items-center justify-between border p-2 rounded-sm bg-red-50 text-red-700'>
            <div className='text-sm'>{a.message}</div>

            {a.fixable && a.onFix && (
              <Button size='sm' variant='outline' onClick={a.onFix}>
                {a.fixLabel}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function notImplemented(name: string) {
  toast.warning('Not implemented in demo', {
    description: `${name} action will be available later`,
  })
}
