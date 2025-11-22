'use client'

import { CombinedExposureTable } from './CombinedExposureTable'
import { PortfolioSummaryCard } from './PortfolioSummaryCard'
import { PositionsTable } from './PositionsTable'
import { RiskAlertsPanel } from './RiskAlertsPanel'
import { WalletAssetsTable } from './WalletAssetsTable'

export function Dashboard() {
  return (
    <div className='p-6 space-y-6'>
      <PortfolioSummaryCard />
      <CombinedExposureTable />
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <WalletAssetsTable />
        <RiskAlertsPanel />
      </div>
      <PositionsTable />
    </div>
  )
}
