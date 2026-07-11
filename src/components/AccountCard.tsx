import type { AccountWithType } from '../hooks/useAccounts'
import { getAccountVariant } from '../lib/accountStyles'
import { CURRENT_USER } from '../lib/currentUser'
import { formatCurrency, maskAccountNumber } from '../lib/format'
import './AccountCard.css'

interface AccountCardProps {
  account: AccountWithType
}

export function AccountCard({ account }: AccountCardProps) {
  const variant = getAccountVariant(account.accountType?.name)

  return (
    <article className={`account-card account-card--${variant}`}>
      <div className="account-card__header">
        <span className="account-card__name">{account.name}</span>
      </div>
      <p className="account-card__balance">{formatCurrency(account.total_amount)}</p>
      <div className="account-card__footer">
        <span>{CURRENT_USER.name}</span>
        <span>{maskAccountNumber(account.account_number)}</span>
      </div>
    </article>
  )
}
