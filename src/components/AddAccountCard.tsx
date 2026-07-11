import './AddAccountCard.css'

export function AddAccountCard() {
  return (
    <article className="add-account-card">
      <button type="button" className="add-account-card__button" aria-label="Ver más cuentas">
        <svg className="add-account-card__icon" aria-hidden="true">
          <use href="/icons.svg#icon-plus" />
        </svg>
      </button>
      <span>Ver más cuentas</span>
    </article>
  )
}
