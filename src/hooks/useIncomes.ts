import { useCallback, useEffect, useState } from 'react'
import { getAccounts, getIncomes, getIncomeTypes } from '../lib/apiClient'

export interface IncomeRecord {
  id: number
  name: string
  date: string
  amount: number
  detail?: string | null
  accountId: number
  accountName: string
  incomeTypeId: number
  incomeTypeName: string
}

interface UseIncomesResult {
  incomes: IncomeRecord[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useIncomes(): UseIncomesResult {
  const [incomes, setIncomes] = useState<IncomeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [incomesData, accounts, incomeTypes] = await Promise.all([
          getIncomes(),
          getAccounts(),
          getIncomeTypes(),
        ])

        if (cancelled) return

        const accountNames = new Map(accounts.map((account) => [account.id, account.name]))
        const incomeTypeNames = new Map(incomeTypes.map((type) => [type.id, type.name]))

        const records = incomesData
          .map((income) => ({
            id: income.id,
            name: income.name,
            date: income.date,
            amount: Number(income.amount),
            detail: income.detail,
            accountId: income.account_id,
            accountName: accountNames.get(income.account_id) ?? 'Cuenta',
            incomeTypeId: income.income_type_id,
            incomeTypeName: incomeTypeNames.get(income.income_type_id) ?? 'Otro',
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setIncomes(records)
      } catch {
        if (!cancelled) setError('No se pudieron cargar los ingresos.')
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

  return { incomes, loading, error, refetch }
}
