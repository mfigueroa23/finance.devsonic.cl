import { useEffect, useState } from 'react'
import { getAccounts, getAccountTypes, type Account, type AccountType } from '../lib/apiClient'

export interface AccountWithType extends Account {
  accountType: AccountType | undefined
}

interface UseAccountsResult {
  accounts: AccountWithType[]
  loading: boolean
  error: string | null
}

export function useAccounts(): UseAccountsResult {
  const [accounts, setAccounts] = useState<AccountWithType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [accountsData, accountTypesData] = await Promise.all([
          getAccounts(),
          getAccountTypes(),
        ])

        if (cancelled) return

        const accountTypesById = new Map(accountTypesData.map((type) => [type.id, type]))

        setAccounts(
          accountsData.map((account) => ({
            ...account,
            accountType: accountTypesById.get(account.account_type_id),
          })),
        )
      } catch {
        if (!cancelled) setError('No se pudieron cargar las cuentas.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { accounts, loading, error }
}
