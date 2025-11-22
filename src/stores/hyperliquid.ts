'use client'

import * as hl from '@nktkas/hyperliquid'
import { ClearinghouseStateResponse } from '@nktkas/hyperliquid'
import { persist } from 'zustand/middleware'
import { create } from 'zustand/react'

type HyperliquidState = {
  infoClient: hl.InfoClient | null
  subsClient: hl.SubscriptionClient | null
  wsTransport: hl.WebSocketTransport | null

  privateKey: string | null
  walletAddress: string | null

  loading: boolean
  error: string | null

  clearinghouseState: ClearinghouseStateResponse | null

  setPrivateKey: (key: string) => void
  setWalletAddress: (addr: string) => void

  init: () => Promise<boolean>
  disconnect: () => void
  hydrateClient: () => Promise<void>
}

export const useHyperliquidStore = create<HyperliquidState>()(
  persist(
    (set, get) => ({
      infoClient: null,
      subsClient: null,
      wsTransport: null,

      privateKey: null,
      walletAddress: null,

      loading: true,
      error: null,

      clearinghouseState: null,

      setPrivateKey: (privateKey) => set({ privateKey }),
      setWalletAddress: (walletAddress) => set({ walletAddress }),

      init: async () => {
        set({ loading: true, error: null })

        const { privateKey, walletAddress } = get()
        if (!privateKey || !walletAddress) {
          set({ loading: false, error: 'Missing key or wallet' })
          return false
        }

        try {
          // REST API client
          const infoClient = new hl.InfoClient({
            transport: new hl.HttpTransport({ isTestnet: true }),
          })

          // Test account access
          const clearinghouseState = await infoClient.clearinghouseState({ user: walletAddress })

          const wsTransport = new hl.WebSocketTransport({ isTestnet: true })
          // WS subscriptions
          const subsClient = new hl.SubscriptionClient({ transport: wsTransport })

          subsClient.clearinghouseState({ user: walletAddress }, ({ clearinghouseState }) => {
            set({ clearinghouseState })
          })

          set({
            subsClient,
            clearinghouseState,
            wsTransport,
            loading: false,
          })

          return true
        } catch (err) {
          console.error(err)
          set({ loading: false, error: 'Invalid credentials' })
          return false
        }
      },
      hydrateClient: async () => {
        const { privateKey, walletAddress, clearinghouseState } = get()
        set({ loading: false })
        if (!privateKey || !walletAddress || clearinghouseState) return

        await get().init()
      },
      disconnect: () => {
        const { wsTransport } = get()
        if (wsTransport) {
          wsTransport.close()
        }

        set({
          infoClient: null,
          subsClient: null,
          clearinghouseState: null,
          error: null,
          walletAddress: null,
          privateKey: null,
        })
      },
    }),
    { name: 'hyperliquid-store', partialize: (s) => ({ privateKey: s.privateKey, walletAddress: s.walletAddress }) },
  ),
)
