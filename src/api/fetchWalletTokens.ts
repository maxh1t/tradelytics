import { Token } from '@/src/types'

type PriceResponse = {
  data: {
    amount: string
  }
}

function normalizeAmount(amount: { amount: string; decimals: number }) {
  return Number(amount.amount) / 10 ** amount.decimals
}

export type TokenBalanceResponse = {
  balances: TokenBalance[]
  nextPageToken: string | null
}

export type TokenBalance = {
  token: {
    network: 'base-sepolia' | string
    contractAddress: `0x${string}`
    symbol: string
    name: string
  }
  amount: {
    amount: string
    decimals: number
  }
}

const API_PRICES = {
  eth: 'https://api.coinbase.com/v2/prices/ETH-USDC/buy',
  eurc: 'https://api.coinbase.com/v2/prices/EURC-USDC/buy',
}

async function fetchPriceUsd(url: string) {
  const res = await fetch(url)
  const data = (await res.json()) as PriceResponse
  return Number(data.data?.amount)
}

export async function fetchWalletTokens(address: `0x${string}`): Promise<Token[]> {
  const res = await fetch(`/api?address=${address}`)
  const { balances } = (await res.json()) as TokenBalanceResponse

  let ethAmount = 0
  let usdcAmount = 0
  let eurcAmount = 0

  balances.forEach((b: TokenBalance) => {
    const amt = normalizeAmount(b.amount)

    switch (b.token.symbol) {
      case 'ETH':
        ethAmount = amt
        break
      case 'USDC':
        usdcAmount = amt
        break
      case 'EURC':
        eurcAmount = amt
        break
    }
  })

  const [ethPrice, eurcPrice] = await Promise.all([fetchPriceUsd(API_PRICES.eth), fetchPriceUsd(API_PRICES.eurc)])

  return [
    { symbol: 'ETH', amount: ethAmount, price: ethPrice, value: ethAmount * ethPrice },
    { symbol: 'USDC', amount: usdcAmount, price: 1, value: usdcAmount },
    { symbol: 'EURC', amount: eurcAmount, price: eurcPrice, value: eurcAmount * eurcPrice },
  ]
}
