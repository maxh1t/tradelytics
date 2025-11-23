import { CdpClient } from '@coinbase/cdp-sdk'
import { NextResponse } from 'next/server'
import superjson from 'superjson'

const cdp = new CdpClient()

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address') as `0x${string}`

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 })
    }

    const result = await cdp.evm.listTokenBalances({
      network: 'base-sepolia',
      address,
    })
    const safe = superjson.serialize(result)

    return NextResponse.json(safe.json, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch balances' }, { status: 500 })
  }
}
