import { PropsWithChildren, useEffect } from 'react'

import { useHyperliquidStore } from '@/src/stores/hyperliquid'

export function HLProvider({ children }: PropsWithChildren) {
  const hydrateClient = useHyperliquidStore((s) => s.hydrateClient)
  const disconnect = useHyperliquidStore((s) => s.disconnect)
  useEffect(() => {
    hydrateClient()
  }, [hydrateClient, disconnect])

  return children
}
