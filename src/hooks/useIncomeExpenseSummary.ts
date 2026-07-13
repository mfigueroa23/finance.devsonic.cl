import { useCallback, useEffect, useState } from 'react'
import { getCharges, getIncomes } from '../lib/apiClient'
import { getLastSixMonths } from '../lib/months'

export interface MonthlySummary {
  month: string
  ingresos: number
  gastos: number
}

interface UseIncomeExpenseSummaryResult {
  data: MonthlySummary[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useIncomeExpenseSummary(): UseIncomeExpenseSummaryResult {
  const [data, setData] = useState<MonthlySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [incomes, charges] = await Promise.all([getIncomes(), getCharges()])

        if (cancelled) return

        const months = getLastSixMonths()
        const summaryByKey = new Map(
          months.map((bucket) => [
            `${bucket.year}-${bucket.month}`,
            { month: bucket.label, ingresos: 0, gastos: 0 },
          ]),
        )

        for (const income of incomes) {
          const date = new Date(income.date)
          const key = `${date.getFullYear()}-${date.getMonth()}`
          const bucket = summaryByKey.get(key)
          if (bucket) bucket.ingresos += Number(income.amount)
        }

        for (const charge of charges) {
          const date = new Date(charge.date)
          const key = `${date.getFullYear()}-${date.getMonth()}`
          const bucket = summaryByKey.get(key)
          if (bucket) bucket.gastos += Number(charge.amount)
        }

        setData(Array.from(summaryByKey.values()))
      } catch {
        if (!cancelled) setError('No se pudo cargar el resumen de ingresos y gastos.')
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

  return { data, loading, error, refetch }
}
