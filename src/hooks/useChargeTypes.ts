import { useEffect, useState } from 'react'
import { getChargeTypes, type ChargeType } from '../lib/apiClient'

interface UseChargeTypesResult {
  chargeTypes: ChargeType[]
  loading: boolean
  error: string | null
}

export function useChargeTypes(): UseChargeTypesResult {
  const [chargeTypes, setChargeTypes] = useState<ChargeType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getChargeTypes()
        if (!cancelled) setChargeTypes(data)
      } catch {
        if (!cancelled) setError('No se pudieron cargar los tipos de cargo.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { chargeTypes, loading, error }
}
