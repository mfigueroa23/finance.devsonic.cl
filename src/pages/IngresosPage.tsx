import { useMemo, useState } from 'react'
import { IncomeForm } from '../components/IncomeForm'
import { Modal } from '../components/Modal'
import { Card, CardContent } from '../components/ui/card'
import { useAccounts } from '../hooks/useAccounts'
import { useIncomes } from '../hooks/useIncomes'
import { useIncomeTypes } from '../hooks/useIncomeTypes'
import { formatCurrency, formatDate } from '../lib/format'
import './IngresosPage.css'

export function IngresosPage() {
  const { accounts } = useAccounts()
  const { incomeTypes } = useIncomeTypes()
  const { incomes, loading, error, refetch } = useIncomes()

  const [showForm, setShowForm] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [incomeTypeId, setIncomeTypeId] = useState('')

  const hasFilters = Boolean(dateFrom || dateTo || incomeTypeId)

  const filteredIncomes = useMemo(() => {
    return incomes.filter((income) => {
      if (dateFrom && new Date(income.date) < new Date(dateFrom)) return false
      if (dateTo && new Date(income.date) > new Date(`${dateTo}T23:59:59`)) return false
      if (incomeTypeId && income.incomeTypeId !== Number(incomeTypeId)) return false
      return true
    })
  }, [incomes, dateFrom, dateTo, incomeTypeId])

  function clearFilters() {
    setDateFrom('')
    setDateTo('')
    setIncomeTypeId('')
  }

  function handleSuccess() {
    setShowForm(false)
    refetch()
  }

  return (
    <section>
      <div className="ingresos-page__header">
        <h1 className="ingresos-page__title">Ingresos</h1>
        <button
          type="button"
          className="ingresos-page__new-button"
          onClick={() => setShowForm(true)}
        >
          + Nuevo ingreso
        </button>
      </div>

      <div className="ingresos-page__filters">
        <div className="ingresos-page__filter-field">
          <label htmlFor="filter-date-from">Desde</label>
          <input
            id="filter-date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="ingresos-page__filter-field">
          <label htmlFor="filter-date-to">Hasta</label>
          <input
            id="filter-date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <div className="ingresos-page__filter-field">
          <label htmlFor="filter-income-type">Tipo de ingreso</label>
          <select
            id="filter-income-type"
            value={incomeTypeId}
            onChange={(e) => setIncomeTypeId(e.target.value)}
          >
            <option value="">Todos</option>
            {incomeTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button type="button" className="ingresos-page__clear-filters" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && filteredIncomes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {hasFilters
            ? 'No hay ingresos que coincidan con los filtros.'
            : 'Sin ingresos registrados.'}
        </p>
      )}

      {!loading && !error && filteredIncomes.length > 0 && (
        <Card>
          <CardContent>
            <table className="ingresos-page__table">
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
                {filteredIncomes.map((income) => (
                  <tr key={income.id}>
                    <td>{formatDate(income.date)}</td>
                    <td>{income.name}</td>
                    <td>{income.accountName}</td>
                    <td>{income.incomeTypeName}</td>
                    <td className="ingresos-page__amount">+{formatCurrency(income.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Registrar ingreso">
        <IncomeForm accounts={accounts} onCancel={() => setShowForm(false)} onSuccess={handleSuccess} />
      </Modal>
    </section>
  )
}
