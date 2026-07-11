const ACCOUNT_TYPE_VARIANTS: Record<string, string> = {
  'cuenta corriente': 'checking',
  'cuenta de ahorro': 'savings',
  'tarjeta de crédito': 'credit',
}

export function getAccountVariant(typeName: string | undefined) {
  if (!typeName) return 'default'
  return ACCOUNT_TYPE_VARIANTS[typeName.trim().toLowerCase()] ?? 'default'
}
