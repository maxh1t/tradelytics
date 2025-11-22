export function formatUsdc(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0'
  }

  // Control thousands separator and decimals
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}
