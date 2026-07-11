import { NavLink } from 'react-router-dom'
import { CURRENT_USER, getInitials } from '../lib/currentUser'
import './Sidebar.css'

interface SidebarProps {
  open: boolean
  onNavigate: () => void
}

const NAV_ITEMS = [
  { to: '/cuentas', label: 'Cuentas', icon: 'icon-cuentas' },
  { to: '/ingresos', label: 'Ingresos', icon: 'icon-ingresos' },
  { to: '/cargos', label: 'Cargos', icon: 'icon-cargos' },
  { to: '/transferencias', label: 'Transferencias', icon: 'icon-transferencias' },
  { to: '/estadisticas', label: 'Estadísticas', icon: 'icon-estadisticas' },
]

export function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo" aria-hidden="true" />
        <div className="sidebar__brand-text">
          <strong>Finance Assistant</strong>
          <span>powered by DevSonic</span>
        </div>
      </div>

      <p className="sidebar__section-label">Módulos</p>

      <nav className="sidebar__nav">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
              >
                <svg className="sidebar__icon" aria-hidden="true">
                  <use href={`/icons.svg#${item.icon}`} />
                </svg>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__avatar">{getInitials(CURRENT_USER.name)}</span>
        <div className="sidebar__user">
          <strong>{CURRENT_USER.name}</strong>
          <span>{CURRENT_USER.status}</span>
        </div>
      </div>
    </aside>
  )
}
