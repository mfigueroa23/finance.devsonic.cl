import type { Movement } from '../hooks/useMovements'
import { formatCurrency, formatMovementTimestamp } from '../lib/format'
import { getMovementIconId } from '../lib/movementIcons'
import './MovementListItem.css'

interface MovementListItemProps {
  movement: Movement
}

export function MovementListItem({ movement }: MovementListItemProps) {
  const isPositive = movement.amount >= 0
  const sign = isPositive ? '+' : '-'

  return (
    <li className="movement-item">
      <span className={`movement-item__badge movement-item__badge--${movement.type}`}>
        <svg className="movement-item__icon" aria-hidden="true">
          <use href={`/icons.svg#${getMovementIconId(movement.type)}`} />
        </svg>
      </span>

      <div className="movement-item__body">
        <p className="movement-item__title">{movement.title}</p>
        <p className="movement-item__subtitle">{movement.subtitle}</p>
      </div>

      <div className="movement-item__amount-group">
        <p
          className={`movement-item__amount movement-item__amount--${isPositive ? 'positive' : 'negative'}`}
        >
          {sign}
          {formatCurrency(Math.abs(movement.amount))}
        </p>
        <p className="movement-item__timestamp">{formatMovementTimestamp(movement.date)}</p>
      </div>
    </li>
  )
}
