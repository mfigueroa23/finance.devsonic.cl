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

export interface IncomeType {
  id: number
  name: string
}

export interface ChargeType {
  id: number
  name: string
}

export interface CreateIncomeInput {
  name: string
  date: string
  amount: number
  detail?: string
  income_type_id: number
  account_id: number
}

export interface CreateChargeInput {
  name: string
  date: string
  amount: number
  detail?: string
  charge_type_id: number
  account_id: number
}

export interface CreateTransferInput {
  name: string
  date: string
  amount: number
  detail?: string
  from_account_id: number
  to_account_id: number
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST'
  body?: unknown
}

async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

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

export function getIncomeTypes() {
  return apiFetch<IncomeType[]>('/income-types')
}

export function getChargeTypes() {
  return apiFetch<ChargeType[]>('/charge-types')
}

export function createIncome(input: CreateIncomeInput) {
  return apiFetch<{ id: number }>('/income', { method: 'POST', body: input })
}

export function createCharge(input: CreateChargeInput) {
  return apiFetch<{ id: number }>('/charges', { method: 'POST', body: input })
}

export function createTransfer(input: CreateTransferInput) {
  return apiFetch<{ id: number }>('/transfers', { method: 'POST', body: input })
}
