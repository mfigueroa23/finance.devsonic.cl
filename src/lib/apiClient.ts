const API_BASE_URL = import.meta.env.VITE_API_DOMAIN

export interface AccountType {
  id: number
  name: string
}

export interface Account {
  id: number
  name: string
  bank_name: string
  account_number: string
  total_amount: string
  account_type_id: number
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getAccounts() {
  return apiFetch<Account[]>('/accounts')
}

export function getAccountTypes() {
  return apiFetch<AccountType[]>('/account-types')
}
