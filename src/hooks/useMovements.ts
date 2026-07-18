import { useCallback, useEffect, useState } from 'react'
import { getAccounts, getCharges, getIncomes, getTransfers } from '../lib/apiClient'

export type MovementType = 'income' | 'charge' | 'transfer'

export interface Movement {
  id: string
  type: MovementType
  title: string
  subtitle: string
  amount: number
  date: string
}

interface UseMovementsResult {
  movements: Movement[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMovements(): UseMovementsResult {
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [accounts, incomes, charges, transfers] = await Promise.all([
          getAccounts(),
          getIncomes(),
          getCharges(),
          getTransfers(),
        ])

        if (cancelled) return

        const accountNames = new Map(accounts.map((account) => [account.id, account.name]))

        const incomeMovements: Movement[] = incomes.map((income) => ({
          id: `income-${income.id}`,
          type: 'income',
          title: income.name,
          subtitle: `Ingreso · ${accountNames.get(income.account_id) ?? 'Cuenta'}`,
          amount: Number(income.amount),
          date: income.date,
        }))

        const chargeMovements: Movement[] = charges.map((charge) => ({
          id: `charge-${charge.id}`,
          type: 'charge',
          title: charge.name,
          subtitle: `Cargo · ${accountNames.get(charge.account_id) ?? 'Cuenta'}`,
          amount: -Number(charge.amount),
          date: charge.date,
        }))

        const transferMovements: Movement[] = transfers.map((transfer) => ({
          id: `transfer-${transfer.id}`,
          type: 'transfer',
          title: transfer.name,
          subtitle: `Transferencia · ${accountNames.get(transfer.from_account_id) ?? 'Cuenta'}`,
          amount: -Number(transfer.amount),
          date: transfer.date,
        }))

        const all = [...incomeMovements, ...chargeMovements, ...transferMovements].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )

        setMovements(all)
      } catch {
        if (!cancelled) setError('No se pudo cargar el historial de movimientos.')
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

  return { movements, loading, error, refetch }
}
