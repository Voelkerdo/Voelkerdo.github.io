import { Title } from '@ui5/webcomponents-react'

export function AppPlaceholder({ title }: { title: string }) {
  return (
    <main className="app-placeholder">
      <Title level="H2">{title}</Title>
    </main>
  )
}
