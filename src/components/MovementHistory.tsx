import { Link } from 'react-router-dom'
import { useMovements } from '../hooks/useMovements'
import './MovementHistory.css'
import { MovementListItem } from './MovementListItem'

const PREVIEW_COUNT = 5

export function MovementHistory() {
  const { movements, loading, error } = useMovements()

  return (
    <section className="movement-history">
      <div className="movement-history__header">
        <h2 className="movement-history__title">Historial de movimientos</h2>
        <Link to="/movimientos" className="movement-history__link">
          Ver todo
        </Link>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && movements.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin movimientos registrados.</p>
      )}

      {!loading && !error && movements.length > 0 && (
        <ul className="movement-history__list">
          {movements.slice(0, PREVIEW_COUNT).map((movement) => (
            <MovementListItem key={movement.id} movement={movement} />
          ))}
        </ul>
      )}
    </section>
  )
}
