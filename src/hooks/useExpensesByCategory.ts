import { useCallback, useEffect, useState } from 'react'
import { getCharges, getChargeTypes } from '../lib/apiClient'

export interface CategorySummary {
  category: string
  amount: number
  percentage: number
}

interface UseExpensesByCategoryResult {
  data: CategorySummary[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useExpensesByCategory(): UseExpensesByCategoryResult {
  const [data, setData] = useState<CategorySummary[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [charges, chargeTypes] = await Promise.all([getCharges(), getChargeTypes()])

        if (cancelled) return

        const chargeTypeNames = new Map(chargeTypes.map((type) => [type.id, type.name]))
        const now = new Date()
        const amountByCategory = new Map<string, number>()

        for (const charge of charges) {
          const date = new Date(charge.date)
          if (date.getFullYear() !== now.getFullYear() || date.getMonth() !== now.getMonth()) continue

          const category = chargeTypeNames.get(charge.charge_type_id) ?? 'Otros'
          amountByCategory.set(category, (amountByCategory.get(category) ?? 0) + Number(charge.amount))
        }

        const monthTotal = Array.from(amountByCategory.values()).reduce((sum, amount) => sum + amount, 0)

        const summary = Array.from(amountByCategory.entries())
          .map(([category, amount]) => ({
            category,
            amount,
            percentage: monthTotal ? Math.round((amount / monthTotal) * 100) : 0,
          }))
          .sort((a, b) => b.amount - a.amount)

        setData(summary)
        setTotal(monthTotal)
      } catch {
        if (!cancelled) setError('No se pudo cargar el resumen de gastos por categoría.')
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

  return { data, total, loading, error, refetch }
}
