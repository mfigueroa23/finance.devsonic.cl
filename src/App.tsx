import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { CuentasPage } from './pages/CuentasPage'
import { IngresosPage } from './pages/IngresosPage'
import { MovimientosPage } from './pages/MovimientosPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/cuentas" replace />} />
        <Route path="cuentas" element={<CuentasPage />} />
        <Route path="movimientos" element={<MovimientosPage />} />
        <Route path="ingresos" element={<IngresosPage />} />
        <Route path="cargos" element={<ComingSoonPage title="Cargos" />} />
        <Route
          path="transferencias"
          element={<ComingSoonPage title="Transferencias" />}
        />
        <Route
          path="estadisticas"
          element={<ComingSoonPage title="Estadísticas" />}
        />
      </Route>
    </Routes>
  )
}

export default App
