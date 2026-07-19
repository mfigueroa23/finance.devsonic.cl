import { useCallback, useEffect, useState } from 'react'
import { getAccounts, getCharges, getChargeTypes, getIncomes, getIncomeTypes } from '../lib/apiClient'
import { getMonthsInRange } from '../lib/months'

export interface MonthlyTrendPoint {
  month: string
  ingresos: number
  gastos: number
}

export interface AccountComparisonPoint {
  account: string
  ingresos: number
  gastos: number
}

export interface CategoryBreakdownPoint {
  category: string
  amount: number
  percentage: number
}

export interface StatisticsMovement {
  date: string
  type: 'Ingreso' | 'Cargo'
  account: string
  category: string
  amount: number
}

export interface DateRange {
  from: string
  to: string
}

interface UseStatisticsResult {
  monthlyTrend: MonthlyTrendPoint[]
  accountComparison: AccountComparisonPoint[]
  categoryBreakdown: CategoryBreakdownPoint[]
  movements: StatisticsMovement[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useStatistics(range: DateRange): UseStatisticsResult {
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendPoint[]>([])
  const [accountComparison, setAccountComparison] = useState<AccountComparisonPoint[]>([])
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdownPoint[]>([])
  const [movements, setMovements] = useState<StatisticsMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [incomes, charges, accounts, incomeTypes, chargeTypes] = await Promise.all([
          getIncomes(),
          getCharges(),
          getAccounts(),
          getIncomeTypes(),
          getChargeTypes(),
        ])

        if (cancelled) return

        const from = new Date(range.from)
        const to = new Date(`${range.to}T23:59:59`)

        const accountNames = new Map(accounts.map((account) => [account.id, account.name]))
        const incomeTypeNames = new Map(incomeTypes.map((type) => [type.id, type.name]))
        const chargeTypeNames = new Map(chargeTypes.map((type) => [type.id, type.name]))

        const incomesInRange = incomes.filter((income) => {
          const date = new Date(income.date)
          return date >= from && date <= to
        })
        const chargesInRange = charges.filter((charge) => {
          const date = new Date(charge.date)
          return date >= from && date <= to
        })

        const months = getMonthsInRange(from, to)
        const trendByKey = new Map(
          months.map((bucket) => [
            `${bucket.year}-${bucket.month}`,
            { month: bucket.label, ingresos: 0, gastos: 0 },
          ]),
        )

        for (const income of incomesInRange) {
          const date = new Date(income.date)
          const bucket = trendByKey.get(`${date.getFullYear()}-${date.getMonth()}`)
          if (bucket) bucket.ingresos += Number(income.amount)
        }

        for (const charge of chargesInRange) {
          const date = new Date(charge.date)
          const bucket = trendByKey.get(`${date.getFullYear()}-${date.getMonth()}`)
          if (bucket) bucket.gastos += Number(charge.amount)
        }

        const accountByKey = new Map(
          accounts.map((account) => [account.id, { account: account.name, ingresos: 0, gastos: 0 }]),
        )

        for (const income of incomesInRange) {
          const bucket = accountByKey.get(income.account_id)
          if (bucket) bucket.ingresos += Number(income.amount)
        }

        for (const charge of chargesInRange) {
          const bucket = accountByKey.get(charge.account_id)
          if (bucket) bucket.gastos += Number(charge.amount)
        }

        const categoryTotals = new Map<string, number>()
        for (const charge of chargesInRange) {
          const category = chargeTypeNames.get(charge.charge_type_id) ?? 'Otros'
          categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + Number(charge.amount))
        }
        const categoryTotal = Array.from(categoryTotals.values()).reduce((sum, value) => sum + value, 0)

        const movementRecords: StatisticsMovement[] = [
          ...incomesInRange.map((income) => ({
            date: income.date,
            type: 'Ingreso' as const,
            account: accountNames.get(income.account_id) ?? 'Cuenta',
            category: incomeTypeNames.get(income.income_type_id) ?? 'Otro',
            amount: Number(income.amount),
          })),
          ...chargesInRange.map((charge) => ({
            date: charge.date,
            type: 'Cargo' as const,
            account: accountNames.get(charge.account_id) ?? 'Cuenta',
            category: chargeTypeNames.get(charge.charge_type_id) ?? 'Otro',
            amount: Number(charge.amount),
          })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setMonthlyTrend(Array.from(trendByKey.values()))
        setAccountComparison(
          Array.from(accountByKey.values()).filter((entry) => entry.ingresos > 0 || entry.gastos > 0),
        )
        setCategoryBreakdown(
          Array.from(categoryTotals.entries())
            .map(([category, amount]) => ({
              category,
              amount,
              percentage: categoryTotal ? Math.round((amount / categoryTotal) * 100) : 0,
            }))
            .sort((a, b) => b.amount - a.amount),
        )
        setMovements(movementRecords)
      } catch {
        if (!cancelled) setError('No se pudieron cargar las estadísticas.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [range.from, range.to, reloadKey])

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  return { monthlyTrend, accountComparison, categoryBreakdown, movements, loading, error, refetch }
}
