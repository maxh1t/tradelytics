import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { cn } from '@/src/lib/utils'

export function SummaryCard({
  title,
  value,
  loading,
  highlight,
}: {
  title: string
  value: string
  loading: boolean
  highlight?: number
}) {
  const isPositive = highlight !== undefined && highlight >= 0
  const isNegative = highlight !== undefined && highlight < 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm text-gray-600'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-xl font-semibold',
            isPositive && 'text-green-600',
            isNegative && 'text-red-600',
            loading && 'text-gray-400',
          )}
        >
          {loading ? 'Loading...' : value}
        </div>
      </CardContent>
    </Card>
  )
}
