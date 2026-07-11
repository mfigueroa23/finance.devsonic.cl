import { useEffect, useState } from 'react'
import { CURRENT_USER, getFirstName } from '../lib/currentUser'
import './WelcomeHeader.css'

const DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function formatSpanishDate(date: Date) {
  const formatted = DATE_FORMATTER.format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function WelcomeHeader() {
  const [today, setToday] = useState(() => new Date())

  useEffect(() => {
    const intervalId = setInterval(() => setToday(new Date()), 60_000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <header className="welcome-header">
      <h1>Hola, {getFirstName(CURRENT_USER.name)} 👋</h1>
      <p>{formatSpanishDate(today)}</p>
    </header>
  )
}
