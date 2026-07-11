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
