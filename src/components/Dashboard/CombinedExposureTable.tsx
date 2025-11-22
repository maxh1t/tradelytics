'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/src/components/ui/table'
import { useHyperliquidData } from '@/src/hooks/useHyperliquidData'
import { useWalletStore } from '@/src/stores/wallet'
import { formatUsdc } from '@/src/utils/format'

export function CombinedExposureTable() {
  const wallet = useWalletStore((s) => s.tokens)
  const hl = useHyperliquidData()

  // Build map: symbol -> walletUsd
  const walletMap = wallet.reduce<Record<string, number>>((acc, t) => {
    acc[t.symbol.toUpperCase()] = (acc[t.symbol.toUpperCase()] || 0) + t.value
    return acc
  }, {})

  // Build map: symbol -> hlUsd
  const hlMap = (hl?.positions || []).reduce<Record<string, number>>((acc, p) => {
    const sym = p.symbol.toUpperCase()
    acc[sym] = (acc[sym] || 0) + p.value
    return acc
  }, {})

  // Union all asset symbols
  const symbols = Array.from(new Set([...Object.keys(walletMap), ...Object.keys(hlMap)]))

  // Total portfolio
  const totalPortfolioUsd = symbols.reduce((sum, sym) => sum + (walletMap[sym] || 0) + (hlMap[sym] || 0), 0)

  const rows = symbols.map((symbol) => {
    const walletUsd = walletMap[symbol] || 0
    const hlUsd = hlMap[symbol] || 0
    const totalUsd = walletUsd + hlUsd
    const weight = totalPortfolioUsd > 0 ? totalUsd / totalPortfolioUsd : 0

    return { symbol, walletUsd, hlUsd, totalUsd, weight }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combined Exposure</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Wallet USD</TableHead>
              <TableHead>HL USD</TableHead>
              <TableHead>Total USD</TableHead>
              <TableHead>Weight</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((e) => (
              <TableRow key={e.symbol}>
                <TableCell>{e.symbol}</TableCell>
                <TableCell>{formatUsdc(e.walletUsd)}</TableCell>
                <TableCell>{formatUsdc(e.hlUsd)}</TableCell>
                <TableCell>{formatUsdc(e.totalUsd)}</TableCell>
                <TableCell>{(e.weight * 100).toFixed(1)} %</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
