import { useState } from 'react'
import { StatisticsAccountChart } from '../components/StatisticsAccountChart'
import { StatisticsCategoryChart } from '../components/StatisticsCategoryChart'
import { StatisticsTrendChart } from '../components/StatisticsTrendChart'
import { useStatistics } from '../hooks/useStatistics'
import { downloadCsv } from '../lib/csv'
import { formatDate } from '../lib/format'
import './EstadisticasPage.css'

function defaultFrom() {
  const date = new Date()
  date.setMonth(date.getMonth() - 11, 1)
  return date.toISOString().slice(0, 10)
}

function defaultTo() {
  return new Date().toISOString().slice(0, 10)
}

export function EstadisticasPage() {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)

  const { monthlyTrend, accountComparison, categoryBreakdown, movements, loading, error } =
    useStatistics({ from, to })

  function handleExport() {
    downloadCsv(
      `estadisticas-${from}-a-${to}.csv`,
      ['Fecha', 'Tipo', 'Cuenta', 'Categoría', 'Monto'],
      movements.map((movement) => [
        formatDate(movement.date),
        movement.type,
        movement.account,
        movement.category,
        movement.amount.toFixed(2),
      ]),
    )
  }

  return (
    <section>
      <div className="estadisticas-page__header">
        <h1 className="estadisticas-page__title">Estadísticas</h1>

        <div className="estadisticas-page__controls">
          <div className="estadisticas-page__field">
            <label htmlFor="stats-from">Desde</label>
            <input
              id="stats-from"
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="estadisticas-page__field">
            <label htmlFor="stats-to">Hasta</label>
            <input
              id="stats-to"
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="estadisticas-page__export-button"
            onClick={handleExport}
            disabled={movements.length === 0}
          >
            Descargar CSV
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && (
        <div className="estadisticas-page__grid">
          <StatisticsTrendChart data={monthlyTrend} />
          <StatisticsAccountChart data={accountComparison} />
          <StatisticsCategoryChart data={categoryBreakdown} />
        </div>
      )}
    </section>
  )
}
