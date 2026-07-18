import { useCallback, useEffect, useState } from 'react'
import { getAccounts, getCharges, getChargeTypes } from '../lib/apiClient'

export interface ChargeRecord {
  id: number
  name: string
  date: string
  amount: number
  detail?: string | null
  accountId: number
  accountName: string
  chargeTypeId: number
  chargeTypeName: string
}

interface UseChargesResult {
  charges: ChargeRecord[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCharges(): UseChargesResult {
  const [charges, setCharges] = useState<ChargeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [chargesData, accounts, chargeTypes] = await Promise.all([
          getCharges(),
          getAccounts(),
          getChargeTypes(),
        ])

        if (cancelled) return

        const accountNames = new Map(accounts.map((account) => [account.id, account.name]))
        const chargeTypeNames = new Map(chargeTypes.map((type) => [type.id, type.name]))

        const records = chargesData
          .map((charge) => ({
            id: charge.id,
            name: charge.name,
            date: charge.date,
            amount: Number(charge.amount),
            detail: charge.detail,
            accountId: charge.account_id,
            accountName: accountNames.get(charge.account_id) ?? 'Cuenta',
            chargeTypeId: charge.charge_type_id,
            chargeTypeName: chargeTypeNames.get(charge.charge_type_id) ?? 'Otro',
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setCharges(records)
      } catch {
        if (!cancelled) setError('No se pudieron cargar los cargos.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  return { charges, loading, error, refetch }
}
