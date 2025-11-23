import { create } from 'zustand'

import { Token } from '@/src/types'

type WalletState = {
  tokens: Token[] | null
  loading: boolean
  setLoading: (v: boolean) => void
  setTokens: (tokens: Token[] | null) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  tokens: null,
  loading: true,

  setLoading: (loading) => set({ loading }),
  setTokens: (tokens) => set({ tokens }),
}))
