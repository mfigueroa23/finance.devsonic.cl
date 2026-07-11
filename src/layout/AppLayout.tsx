import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import './AppLayout.css'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      <button
        type="button"
        className="app-layout__menu-button"
        aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setSidebarOpen((open) => !open)}
      >
        <svg className="app-layout__menu-icon" aria-hidden="true">
          <use href={`/icons.svg#${sidebarOpen ? 'icon-close' : 'icon-menu'}`} />
        </svg>
      </button>

      {sidebarOpen && (
        <div className="app-layout__backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
