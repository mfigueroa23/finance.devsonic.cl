import { AccountCard } from '../components/AccountCard'
import { AddAccountCard } from '../components/AddAccountCard'
import { WelcomeHeader } from '../components/WelcomeHeader'
import { useAccounts } from '../hooks/useAccounts'
import './CuentasPage.css'

export function CuentasPage() {
  const { accounts, loading, error } = useAccounts()

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
    </>
  )
}
