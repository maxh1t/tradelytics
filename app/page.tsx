'use client'

import { useEffect } from 'react'

import { Dashboard } from '@/src/components/Dashboard'
import { Header } from '@/src/components/Header'
import { useHyperliquidStore } from '@/src/stores/hyperliquid'

export default function Home() {
  const hydrateClient = useHyperliquidStore((s) => s.hydrateClient)
  const disconnect = useHyperliquidStore((s) => s.disconnect)
  useEffect(() => {
    hydrateClient()

    return () => {
      disconnect()
    }
  }, [hydrateClient, disconnect])

  return (
    <div className='flex flex-col min-h-0 h-screen'>
      <Header />
      <Dashboard />
    </div>
  )
}
