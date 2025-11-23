import { useEvmAddress } from '@coinbase/cdp-hooks'
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'

import { useWalletStore } from '@/src/stores/wallet'

import { Token } from '../types'

export function WalletProvider({ children }: PropsWithChildren) {
  const setLoading = useWalletStore((s) => s.setLoading)
  const setTokens = useWalletStore((s) => s.setTokens)

  const firstLoadDone = useRef(false)

  const { evmAddress } = useEvmAddress()

  const fetchBalance = useCallback(async () => {
    if (!evmAddress) return

    try {
      const tokens = await fetchWalletTokens(evmAddress)
      setTokens(tokens)

      if (!firstLoadDone.current) {
        firstLoadDone.current = true
        setLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [evmAddress, setTokens, setLoading])

  useEffect(() => {
    if (!evmAddress) {
      // reset everything cleanly
      firstLoadDone.current = false
      setLoading(false)
      setTokens(null)
      return
    }

    // First-time load
    if (!firstLoadDone.current) {
      setLoading(true)
      fetchBalance()
    }

    const id = setInterval(fetchBalance, 3000)
    return () => clearInterval(id)
  }, [evmAddress, fetchBalance, setLoading, setTokens])

  return children
}

type PriceResponse = {
  data: {
    amount: '2748.33'
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
    {
      symbol: 'ETH',
      amount: ethAmount,
      price: ethPrice,
      value: ethAmount * ethPrice,
    },
    {
      symbol: 'USDC',
      amount: usdcAmount,
      price: 1,
      value: usdcAmount,
    },
    {
      symbol: 'EURC',
      amount: eurcAmount,
      price: eurcPrice,
      value: eurcAmount * eurcPrice,
    },
  ]
}
