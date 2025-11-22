'use client'

import { useEvmAddress } from '@coinbase/cdp-hooks'
import { useEffect, useState, useCallback } from 'react'
import { createPublicClient, http, formatEther } from 'viem'
import { baseSepolia } from 'viem/chains'

type PriceResponse = { data: { amount: '2748.33'; base: 'ETH'; currency: 'USDC' } }

// Simple ETH price from CDP (fallback)
async function fetchEthPriceUsd() {
  const res = await fetch('https://api.coinbase.com/v2/prices/ETH-USDC/buy')
  const data = (await res.json()) as PriceResponse
  return Number(data.data?.amount)
}

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

export function useWalletBalance() {
  const { evmAddress } = useEvmAddress()
  const [ethBalance, setEthBalance] = useState(0)
  const [ethPrice, setEthPrice] = useState(0)
  const [usdcValue, setUsdcValue] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!evmAddress) {
      setEthBalance(0)
      setEthPrice(0)
      setUsdcValue(0)
      return
    }

    setLoading(true)

    try {
      const wei = await client.getBalance({ address: evmAddress })
      const eth = Number(formatEther(wei))

      const price = await fetchEthPriceUsd()
      const usdValue = eth * price

      setEthBalance(eth)
      setEthPrice(price)
      setUsdcValue(usdValue) // USDC ~ USD peg
    } catch (e) {
      console.error(e)
    }

    setLoading(false)
  }, [evmAddress])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    const id = setInterval(load, 3000)
    return () => clearInterval(id)
  }, [load])

  return {
    ethPrice,
    ethBalance: evmAddress ? ethBalance : 0,
    usdcValue: evmAddress ? usdcValue : 0,
    loading,
  }
}
