import { useEffect, useState } from 'react'
import { getIncomeTypes, type IncomeType } from '../lib/apiClient'

interface UseIncomeTypesResult {
  incomeTypes: IncomeType[]
  loading: boolean
  error: string | null
}

export function useIncomeTypes(): UseIncomeTypesResult {
  const [incomeTypes, setIncomeTypes] = useState<IncomeType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getIncomeTypes()
        if (!cancelled) setIncomeTypes(data)
      } catch {
        if (!cancelled) setError('No se pudieron cargar los tipos de ingreso.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { incomeTypes, loading, error }
}
