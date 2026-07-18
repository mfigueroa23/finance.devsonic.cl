import { MONTH_LABELS } from './months'

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(amount: string | number) {
  return CURRENCY_FORMATTER.format(Number(amount))
}

export function maskAccountNumber(accountNumber: string) {
  return `•••• ${accountNumber.slice(-4)}`
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function formatMovementTimestamp(date: string) {
  const value = new Date(date)
  const day = value.getDate()
  const month = MONTH_LABELS[value.getMonth()].toLowerCase()
  const time = `${pad(value.getHours())}:${pad(value.getMinutes())}`

  return `${day} ${month}, ${time}`
}
