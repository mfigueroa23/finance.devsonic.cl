const MONTH_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
]

export interface MonthBucket {
  year: number
  month: number
  label: string
}

export function getLastSixMonths(reference: Date = new Date()): MonthBucket[] {
  const buckets: MonthBucket[] = []

  for (let offset = 5; offset >= 0; offset--) {
    const date = new Date(reference.getFullYear(), reference.getMonth() - offset, 1)
    buckets.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: MONTH_LABELS[date.getMonth()],
    })
  }

  return buckets
}
