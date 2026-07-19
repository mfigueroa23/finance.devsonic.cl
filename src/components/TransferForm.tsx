import { useState, type FormEvent } from 'react'
import type { AccountWithType } from '../hooks/useAccounts'
import { createTransfer } from '../lib/apiClient'
import { formatCurrency } from '../lib/format'
import './MovementForm.css'

interface TransferFormProps {
  accounts: AccountWithType[]
  onSuccess: () => void
  onCancel: () => void
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function TransferForm({ accounts, onSuccess, onCancel }: TransferFormProps) {
  const [name, setName] = useState('')
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [fromAccountId, setFromAccountId] = useState('')
  const [toAccountId, setToAccountId] = useState('')
  const [detail, setDetail] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fromAccount = accounts.find((account) => String(account.id) === fromAccountId)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!name || !date || !amount || !fromAccountId || !toAccountId) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    if (Number(amount) <= 0) {
      setError('El monto debe ser mayor a 0.')
      return
    }

    if (fromAccountId === toAccountId) {
      setError('La cuenta de origen y destino deben ser distintas.')
      return
    }

    if (fromAccount && Number(amount) > Number(fromAccount.total_amount)) {
      setError('El monto excede el saldo disponible en la cuenta de origen.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await createTransfer({
        name,
        date,
        amount: Number(amount),
        detail: detail || undefined,
        from_account_id: Number(fromAccountId),
        to_account_id: Number(toAccountId),
      })
      onSuccess()
    } catch {
      setError('No se pudo registrar la transferencia.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="movement-form" onSubmit={handleSubmit}>
      <div className="movement-form__field">
        <label htmlFor="transfer-name">Nombre</label>
        <input
          id="transfer-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="transfer-date">Fecha</label>
        <input
          id="transfer-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="transfer-amount">Monto</label>
        <input
          id="transfer-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="transfer-from">Cuenta de origen</label>
        <select
          id="transfer-from"
          value={fromAccountId}
          onChange={(e) => setFromAccountId(e.target.value)}
          required
        >
          <option value="">Selecciona una cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        {fromAccount && (
          <span className="movement-form__hint">
            Saldo disponible: {formatCurrency(fromAccount.total_amount)}
          </span>
        )}
      </div>

      <div className="movement-form__field">
        <label htmlFor="transfer-to">Cuenta de destino</label>
        <select
          id="transfer-to"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
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
        <label htmlFor="transfer-detail">Detalle (opcional)</label>
        <textarea
          id="transfer-detail"
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
          {submitting ? 'Guardando…' : 'Registrar transferencia'}
        </button>
      </div>
    </form>
  )
}
