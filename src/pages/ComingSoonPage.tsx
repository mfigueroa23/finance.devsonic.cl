interface ComingSoonPageProps {
  title: string
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <section className="coming-soon">
      <h1>{title}</h1>
      <p>Este módulo estará disponible próximamente.</p>
    </section>
  )
}
