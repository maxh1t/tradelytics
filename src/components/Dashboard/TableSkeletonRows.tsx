import { Skeleton } from '@/src/components/ui/skeleton'

export function TableSkeletonRows({ rows = 4, cols = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className='py-2'>
              <Skeleton className='h-4 w-20' />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
