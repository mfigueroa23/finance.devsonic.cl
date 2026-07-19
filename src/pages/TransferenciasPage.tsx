import { useState } from 'react'
import { Modal } from '../components/Modal'
import { TransferForm } from '../components/TransferForm'
import { Card, CardContent } from '../components/ui/card'
import { useAccounts } from '../hooks/useAccounts'
import { useTransfers } from '../hooks/useTransfers'
import { formatCurrency, formatDate } from '../lib/format'
import './TransferenciasPage.css'

export function TransferenciasPage() {
  const { accounts } = useAccounts()
  const { transfers, loading, error, refetch } = useTransfers()

  const [showForm, setShowForm] = useState(false)

  function handleSuccess() {
    setShowForm(false)
    refetch()
  }

  return (
    <section>
      <div className="transferencias-page__header">
        <h1 className="transferencias-page__title">Transferencias</h1>
        <button
          type="button"
          className="transferencias-page__new-button"
          onClick={() => setShowForm(true)}
        >
          + Nueva transferencia
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && transfers.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin transferencias registradas.</p>
      )}

      {!loading && !error && transfers.length > 0 && (
        <Card>
          <CardContent>
            <table className="transferencias-page__table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nombre</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr key={transfer.id}>
                    <td>{formatDate(transfer.date)}</td>
                    <td>{transfer.name}</td>
                    <td>{transfer.fromAccountName}</td>
                    <td>{transfer.toAccountName}</td>
                    <td className="transferencias-page__amount">
                      {formatCurrency(transfer.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Registrar transferencia">
        <TransferForm accounts={accounts} onCancel={() => setShowForm(false)} onSuccess={handleSuccess} />
      </Modal>
    </section>
  )
}
