import { useHyperliquidStore } from '@/src/stores/hyperliquid'

export const useHyperliquidData = () => {
  const clearinghouseState = useHyperliquidStore((s) => s.clearinghouseState)

  if (!clearinghouseState) return null

  const positions = clearinghouseState.assetPositions.map((p) => {
    const pos = p.position

    return {
      symbol: pos.coin,
      size: Number(pos.szi),
      entry: Number(pos.entryPx),
      value: Number(pos.positionValue),
      pnl: Number(pos.unrealizedPnl),
      roe: Number(pos.returnOnEquity),
      liq: pos.liquidationPx ? Number(pos.liquidationPx) : null,
      rawUsd: Number(pos.marginUsed),
      leverage: pos.leverage.value,
    }
  })

  const accountValue = Number(clearinghouseState.marginSummary.accountValue)
  const totalNtl = Number(clearinghouseState.marginSummary.totalNtlPos)
  const totalUnrealized = positions.reduce((sum, p) => sum + p.pnl, 0)
  const crossLeverage = accountValue > 0 ? totalNtl / accountValue : 0

  return {
    accountValue,
    totalNtl,
    totalUnrealized,
    crossLeverage,
    withdrawable: Number(clearinghouseState.withdrawable),
    positions,
  }
}
