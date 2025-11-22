'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from '@/src/components/ui/table'
import { useHyperliquidData } from '@/src/hooks/useHyperliquidData'
import { formatUsdc } from '@/src/utils/format'

export function PositionsTable() {
  const hl = useHyperliquidData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>HyperLiquid Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>PnL</TableHead>
              <TableHead>ROE</TableHead>
              <TableHead>Liq</TableHead>
              <TableHead>Lev</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {hl?.positions.map((pos) => (
              <TableRow key={pos.symbol}>
                <TableCell>{pos.symbol}</TableCell>
                <TableCell>{pos.size}</TableCell>
                <TableCell>{formatUsdc(pos.entry)}</TableCell>
                <TableCell>{formatUsdc(pos.value)}</TableCell>
                <TableCell className={pos.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatUsdc(pos.pnl)}
                </TableCell>
                <TableCell>{pos.roe.toFixed(2)} %</TableCell>
                <TableCell>{pos.liq ? formatUsdc(pos.liq) : '-'}</TableCell>
                <TableCell>{pos.leverage}x</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
