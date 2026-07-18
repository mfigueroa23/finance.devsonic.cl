import { AccountCard } from '../components/AccountCard'
import { AddAccountCard } from '../components/AddAccountCard'
import { ExpensesByCategoryChart } from '../components/ExpensesByCategoryChart'
import { IncomeExpenseChart } from '../components/IncomeExpenseChart'
import { MovementHistory } from '../components/MovementHistory'
import { QuickActions } from '../components/QuickActions'
import { WelcomeHeader } from '../components/WelcomeHeader'
import { useAccounts } from '../hooks/useAccounts'
import './CuentasPage.css'

export function CuentasPage() {
  const { accounts, loading, error, refetch } = useAccounts()

  return (
    <>
      <WelcomeHeader />

      <section className="accounts-section">
        <h2 className="accounts-section__title">Tus cuentas</h2>

        {loading && <p>Cargando cuentas…</p>}
        {error && <p className="accounts-section__error">{error}</p>}

        {!loading && !error && (
          <div className="accounts-grid">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
            <AddAccountCard />
          </div>
        )}
      </section>

      {!loading && !error && (
        <QuickActions accounts={accounts} onMovementCreated={refetch} />
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <IncomeExpenseChart />
        <ExpensesByCategoryChart />
      </div>

      <MovementHistory />
    </>
  )
}
