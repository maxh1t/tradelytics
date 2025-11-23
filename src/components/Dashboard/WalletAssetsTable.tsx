'use client'

import { TableSkeletonRows } from '@/src/components/Dashboard/TableSkeletonRows'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Table, TableBody, TableRow, TableHead, TableHeader, TableCell } from '@/src/components/ui/table'
import { useWalletStore } from '@/src/stores/wallet'
import { formatUsdc } from '@/src/utils/format'

export function WalletAssetsTable() {
  const tokens = useWalletStore((s) => s.tokens)
  const loading = useWalletStore((s) => s.loading)

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
            {loading ? (
              <TableSkeletonRows rows={3} cols={4} />
            ) : !tokens || tokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='text-sm text-gray-500'>
                  Connect your wallet to view assets
                </TableCell>
              </TableRow>
            ) : (
              tokens?.map((asset) => (
                <TableRow key={asset.symbol}>
                  <TableCell>{asset.symbol}</TableCell>
                  <TableCell>{asset.amount}</TableCell>
                  <TableCell>{formatUsdc(asset.price)}</TableCell>
                  <TableCell>{formatUsdc(asset.value)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
