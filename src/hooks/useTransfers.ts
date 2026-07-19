import { useCallback, useEffect, useState } from 'react'
import { getAccounts, getTransfers } from '../lib/apiClient'

export interface TransferRecord {
  id: number
  name: string
  date: string
  amount: number
  detail?: string | null
  fromAccountId: number
  fromAccountName: string
  toAccountId: number
  toAccountName: string
}

interface UseTransfersResult {
  transfers: TransferRecord[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTransfers(): UseTransfersResult {
  const [transfers, setTransfers] = useState<TransferRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [transfersData, accounts] = await Promise.all([getTransfers(), getAccounts()])

        if (cancelled) return

        const accountNames = new Map(accounts.map((account) => [account.id, account.name]))

        const records = transfersData
          .map((transfer) => ({
            id: transfer.id,
            name: transfer.name,
            date: transfer.date,
            amount: Number(transfer.amount),
            detail: transfer.detail,
            fromAccountId: transfer.from_account_id,
            fromAccountName: accountNames.get(transfer.from_account_id) ?? 'Cuenta',
            toAccountId: transfer.to_account_id,
            toAccountName: accountNames.get(transfer.to_account_id) ?? 'Cuenta',
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setTransfers(records)
      } catch {
        if (!cancelled) setError('No se pudieron cargar las transferencias.')
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

  return { transfers, loading, error, refetch }
}
