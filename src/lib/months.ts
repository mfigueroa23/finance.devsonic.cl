export const MONTH_LABELS = [
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

export function getMonthsInRange(from: Date, to: Date): MonthBucket[] {
  const buckets: MonthBucket[] = []
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1)
  const end = new Date(to.getFullYear(), to.getMonth(), 1)

  while (cursor <= end) {
    buckets.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      label: `${MONTH_LABELS[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(-2)}`,
    })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return buckets
}
