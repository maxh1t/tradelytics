import { useEvmAddress } from '@coinbase/cdp-hooks'
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'
import { createPublicClient, formatEther, http } from 'viem'
import { baseSepolia } from 'viem/chains'

import { useWalletStore } from '@/src/stores/wallet'

import { Token } from '../types'

type PriceResponse = {
  data: {
    amount: '2748.33'
    base: 'ETH'
    currency: 'USDC'
  }
}

const API_PRICES = {
  eth: 'https://api.coinbase.com/v2/prices/ETH-USDC/buy',
  eurc: 'https://api.coinbase.com/v2/prices/EURC-USDC/buy',
}

// Simple ETH price from CDP (fallback)
async function fetchPriceUsd(url: string) {
  const res = await fetch(url)
  const data = (await res.json()) as PriceResponse
  return Number(data.data?.amount)
}

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

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

async function fetchErc20Balance(address: `0x${string}`, token: `0x${string}`) {
  const [balance, decimals] = await Promise.all([
    client.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    }),
    client.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'decimals',
      args: [],
    }),
  ])

  return Number(balance) / 10 ** Number(decimals)
}

export const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
]

async function fetchWalletTokens(address: `0x${string}`): Promise<Token[]> {
  const [ethWei, usdcAmount, eurcAmount] = await Promise.all([
    client.getBalance({ address }),
    fetchErc20Balance(address, '0x036CbD53842c5426634e7929541eC2318f3dCF7e'),
    fetchErc20Balance(address, '0x808456652fdb597867f38412077A9182bf77359F'),
  ])

  const [ethPrice, eurcPrice] = await Promise.all([fetchPriceUsd(API_PRICES.eth), fetchPriceUsd(API_PRICES.eurc)])

  const eth = Number(formatEther(ethWei))

  return [
    { symbol: 'ETH', amount: eth, price: ethPrice, value: eth * ethPrice },
    { symbol: 'USDC', amount: usdcAmount, price: 1, value: usdcAmount },
    { symbol: 'EURC', amount: eurcAmount, price: eurcPrice, value: eurcAmount * eurcPrice },
  ]
}
