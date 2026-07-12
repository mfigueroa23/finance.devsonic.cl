import { useState, type FormEvent } from 'react'
import type { AccountWithType } from '../hooks/useAccounts'
import { useIncomeTypes } from '../hooks/useIncomeTypes'
import { createIncome } from '../lib/apiClient'
import './MovementForm.css'

interface IncomeFormProps {
  accounts: AccountWithType[]
  onSuccess: () => void
  onCancel: () => void
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function IncomeForm({ accounts, onSuccess, onCancel }: IncomeFormProps) {
  const { incomeTypes, loading: loadingIncomeTypes } = useIncomeTypes()

  const [name, setName] = useState('')
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [incomeTypeId, setIncomeTypeId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [detail, setDetail] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!name || !date || !amount || !incomeTypeId || !accountId) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    if (Number(amount) <= 0) {
      setError('El monto debe ser mayor a 0.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await createIncome({
        name,
        date,
        amount: Number(amount),
        detail: detail || undefined,
        income_type_id: Number(incomeTypeId),
        account_id: Number(accountId),
      })
      onSuccess()
    } catch {
      setError('No se pudo registrar el ingreso.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="movement-form" onSubmit={handleSubmit}>
      <div className="movement-form__field">
        <label htmlFor="income-name">Nombre</label>
        <input
          id="income-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="income-date">Fecha</label>
        <input
          id="income-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="income-amount">Monto</label>
        <input
          id="income-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="income-type">Tipo de ingreso</label>
        <select
          id="income-type"
          value={incomeTypeId}
          onChange={(e) => setIncomeTypeId(e.target.value)}
          disabled={loadingIncomeTypes}
          required
        >
          <option value="">
            {loadingIncomeTypes ? 'Cargando…' : 'Selecciona un tipo'}
          </option>
          {incomeTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="movement-form__field">
        <label htmlFor="income-account">Cuenta</label>
        <select
          id="income-account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          required
        >
          <option value="">Selecciona una cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="movement-form__field">
        <label htmlFor="income-detail">Detalle (opcional)</label>
        <textarea
          id="income-detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
      </div>

      {error && <p className="movement-form__error">{error}</p>}

      <div className="movement-form__actions">
        <button type="button" className="movement-form__cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="movement-form__submit" disabled={submitting}>
          {submitting ? 'Guardando…' : 'Registrar ingreso'}
        </button>
      </div>
    </form>
  )
}
