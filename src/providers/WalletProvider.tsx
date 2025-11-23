import { useEvmAddress } from '@coinbase/cdp-hooks'
import { PropsWithChildren, useCallback, useEffect, useRef } from 'react'

import { fetchWalletTokens } from '@/src/api/fetchWalletTokens'
import { useWalletStore } from '@/src/stores/wallet'

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
