import { useState } from 'react'
import type { AccountWithType } from '../hooks/useAccounts'
import { ChargeForm } from './ChargeForm'
import { IncomeForm } from './IncomeForm'
import { Modal } from './Modal'
import './QuickActions.css'
import { TransferForm } from './TransferForm'

interface QuickActionsProps {
  accounts: AccountWithType[]
  onMovementCreated: () => void
}

type ActiveModal = 'income' | 'charge' | 'transfer' | null

export function QuickActions({ accounts, onMovementCreated }: QuickActionsProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)

  function close() {
    setActiveModal(null)
  }

  function handleSuccess() {
    close()
    onMovementCreated()
  }

  return (
    <div className="quick-actions">
      <button
        type="button"
        className="quick-actions__button"
        onClick={() => setActiveModal('income')}
      >
        <span className="quick-actions__badge quick-actions__badge--income">
          <svg className="quick-actions__icon" aria-hidden="true">
            <use href="/icons.svg#icon-ingresos" />
          </svg>
        </span>
        Ingreso
      </button>

      <button
        type="button"
        className="quick-actions__button"
        onClick={() => setActiveModal('charge')}
      >
        <span className="quick-actions__badge quick-actions__badge--charge">
          <svg className="quick-actions__icon" aria-hidden="true">
            <use href="/icons.svg#icon-cargos" />
          </svg>
        </span>
        Cargo
      </button>

      <button
        type="button"
        className="quick-actions__button"
        onClick={() => setActiveModal('transfer')}
      >
        <span className="quick-actions__badge quick-actions__badge--transfer">
          <svg className="quick-actions__icon" aria-hidden="true">
            <use href="/icons.svg#icon-transferencias" />
          </svg>
        </span>
        Transferencia
      </button>

      <Modal open={activeModal === 'income'} onClose={close} title="Registrar ingreso">
        <IncomeForm accounts={accounts} onCancel={close} onSuccess={handleSuccess} />
      </Modal>

      <Modal open={activeModal === 'charge'} onClose={close} title="Registrar cargo">
        <ChargeForm accounts={accounts} onCancel={close} onSuccess={handleSuccess} />
      </Modal>

      <Modal
        open={activeModal === 'transfer'}
        onClose={close}
        title="Registrar transferencia"
      >
        <TransferForm accounts={accounts} onCancel={close} onSuccess={handleSuccess} />
      </Modal>
    </div>
  )
}
