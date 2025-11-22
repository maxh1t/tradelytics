'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from '@/src/components/ui/table'
import { useWalletStore } from '@/src/stores/wallet'
import { formatUsdc } from '@/src/utils/format'

export function WalletAssetsTable() {
  const tokens = useWalletStore((s) => s.tokens)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tokens.map((asset) => (
              <TableRow key={asset.symbol}>
                <TableCell>{asset.symbol}</TableCell>
                <TableCell>{asset.amount}</TableCell>
                <TableCell>{formatUsdc(asset.price)}</TableCell>
                <TableCell>{formatUsdc(asset.value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
