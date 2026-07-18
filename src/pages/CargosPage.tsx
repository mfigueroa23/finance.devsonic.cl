import { useMemo, useState } from 'react'
import { ChargeForm } from '../components/ChargeForm'
import { Modal } from '../components/Modal'
import { Card, CardContent } from '../components/ui/card'
import { useAccounts } from '../hooks/useAccounts'
import { useCharges } from '../hooks/useCharges'
import { useChargeTypes } from '../hooks/useChargeTypes'
import { formatCurrency, formatDate } from '../lib/format'
import './CargosPage.css'

export function CargosPage() {
  const { accounts } = useAccounts()
  const { chargeTypes } = useChargeTypes()
  const { charges, loading, error, refetch } = useCharges()

  const [showForm, setShowForm] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [chargeTypeId, setChargeTypeId] = useState('')

  const hasFilters = Boolean(dateFrom || dateTo || chargeTypeId)

  const filteredCharges = useMemo(() => {
    return charges.filter((charge) => {
      if (dateFrom && new Date(charge.date) < new Date(dateFrom)) return false
      if (dateTo && new Date(charge.date) > new Date(`${dateTo}T23:59:59`)) return false
      if (chargeTypeId && charge.chargeTypeId !== Number(chargeTypeId)) return false
      return true
    })
  }, [charges, dateFrom, dateTo, chargeTypeId])

  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setChargeTypeId('')
  }

  function handleSuccess() {
    setShowForm(false)
    refetch()
  }

  return (
    <section>
      <div className="cargos-page__header">
        <h1 className="cargos-page__title">Cargos</h1>
        <button
          type="button"
          className="cargos-page__new-button"
          onClick={() => setShowForm(true)}
        >
          + Nuevo cargo
        </button>
      </div>

      <div className="cargos-page__filters">
        <div className="cargos-page__filter-field">
          <label htmlFor="filter-date-from">Desde</label>
          <input
            id="filter-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="cargos-page__filter-field">
          <label htmlFor="filter-date-to">Hasta</label>
          <input
            id="filter-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <div className="cargos-page__filter-field">
          <label htmlFor="filter-charge-type">Tipo de cargo</label>
          <select
            id="filter-charge-type"
            value={chargeTypeId}
            onChange={(e) => setChargeTypeId(e.target.value)}
          >
            <option value="">Todos</option>
            {chargeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button type="button" className="cargos-page__clear-filters" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && filteredCharges.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? 'No hay cargos que coincidan con los filtros.'
            : 'Sin cargos registrados.'}
        </p>
      )}

      {!loading && !error && filteredCharges.length > 0 && (
        <Card>
          <CardContent>
            <table className="cargos-page__table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Cuenta</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {filteredCharges.map((charge) => (
                  <tr key={charge.id}>
                    <td>{formatDate(charge.date)}</td>
                    <td>{charge.name}</td>
                    <td>{charge.accountName}</td>
                    <td>{charge.chargeTypeName}</td>
                    <td className="cargos-page__amount">-{formatCurrency(charge.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Registrar cargo">
        <ChargeForm accounts={accounts} onCancel={() => setShowForm(false)} onSuccess={handleSuccess} />
      </Modal>
    </section>
  )
}
