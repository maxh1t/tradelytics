'use client'

import { Dashboard } from '@/src/components/Dashboard'
import { Header } from '@/src/components/Header'
import { HLProvider } from '@/src/providers/HLProvider'
import { WalletProvider } from '@/src/providers/WalletProvider'

export default function Home() {
  return (
    <WalletProvider>
      <HLProvider>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <Dashboard />
        </div>
      </HLProvider>
    </WalletProvider>
  )
}
