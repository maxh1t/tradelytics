import { create } from 'zustand'

import { Token } from '@/src/types'

type WalletState = {
  tokens: Token[]
  loading: boolean
  setLoading: (v: boolean) => void
  setTokens: (tokens: Token[]) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  tokens: [],
  loading: true,

  setLoading: (loading) => set({ loading }),
  setTokens: (tokens) => set({ tokens }),
}))
