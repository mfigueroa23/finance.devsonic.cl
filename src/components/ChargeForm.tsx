import { useState, type FormEvent } from 'react'
import type { AccountWithType } from '../hooks/useAccounts'
import { useChargeTypes } from '../hooks/useChargeTypes'
import { createCharge } from '../lib/apiClient'
import './MovementForm.css'

interface ChargeFormProps {
  accounts: AccountWithType[]
  onSuccess: () => void
  onCancel: () => void
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function ChargeForm({ accounts, onSuccess, onCancel }: ChargeFormProps) {
  const { chargeTypes, loading: loadingChargeTypes } = useChargeTypes()

  const [name, setName] = useState('')
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [chargeTypeId, setChargeTypeId] = useState('')
  const [accountId, setAccountId] = useState('')
  const [detail, setDetail] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!name || !date || !amount || !chargeTypeId || !accountId) {
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
      await createCharge({
        name,
        date,
        amount: Number(amount),
        detail: detail || undefined,
        charge_type_id: Number(chargeTypeId),
        account_id: Number(accountId),
      })
      onSuccess()
    } catch {
      setError('No se pudo registrar el cargo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="movement-form" onSubmit={handleSubmit}>
      <div className="movement-form__field">
        <label htmlFor="charge-name">Nombre</label>
        <input
          id="charge-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="charge-date">Fecha</label>
        <input
          id="charge-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="charge-amount">Monto</label>
        <input
          id="charge-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="movement-form__field">
        <label htmlFor="charge-type">Tipo de cargo</label>
        <select
          id="charge-type"
          value={chargeTypeId}
          onChange={(e) => setChargeTypeId(e.target.value)}
          disabled={loadingChargeTypes}
          required
        >
          <option value="">
            {loadingChargeTypes ? 'Cargando…' : 'Selecciona un tipo'}
          </option>
          {chargeTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className="movement-form__field">
        <label htmlFor="charge-account">Cuenta</label>
        <select
          id="charge-account"
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
        <label htmlFor="charge-detail">Detalle (opcional)</label>
        <textarea
          id="charge-detail"
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
          {submitting ? 'Guardando…' : 'Registrar cargo'}
        </button>
      </div>
    </form>
  )
}
