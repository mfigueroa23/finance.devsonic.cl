import type { MovementType } from '../hooks/useMovements'

const MOVEMENT_ICON_ID: Record<MovementType, string> = {
  income: 'icon-ingresos',
  charge: 'icon-cargos',
  transfer: 'icon-transferencias',
}

export function getMovementIconId(type: MovementType) {
  return MOVEMENT_ICON_ID[type]
}
