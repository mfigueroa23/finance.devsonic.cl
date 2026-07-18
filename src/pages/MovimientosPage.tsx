import { useMemo, useState } from 'react'
import { MovementListItem } from '../components/MovementListItem'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useMovements } from '../hooks/useMovements'
import './MovimientosPage.css'

const PAGE_SIZE = 10

export function MovimientosPage() {
  const { movements, loading, error } = useMovements()
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(movements.length / PAGE_SIZE))

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return movements.slice(start, start + PAGE_SIZE)
  }, [movements, page])

  return (
    <section>
      <h1 className="movimientos-page__title">Movimientos</h1>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && movements.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin movimientos registrados.</p>
      )}

      {!loading && !error && movements.length > 0 && (
        <Card>
          <CardContent>
            <ul className="movimientos-page__list">
              {pageItems.map((movement) => (
                <MovementListItem key={movement.id} movement={movement} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!loading && !error && pageCount > 1 && (
        <div className="movimientos-page__pagination">
          <Button
            type="button"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Anterior
          </Button>
          <span className="movimientos-page__page-label">
            Página {page} de {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page === pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Siguiente
          </Button>
        </div>
      )}
    </section>
  )
}
