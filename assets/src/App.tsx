import { ThemeProvider } from '@ui5/webcomponents-react'
import { AppShell } from './shell/AppShell.tsx'
import { ThemeModeProvider } from './shell/ThemeModeProvider.tsx'

// Replaced by the overview page in T-16
function OverviewPlaceholder() {
  return <main className="overview-placeholder">Dominik Völker</main>
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeModeProvider>
        <AppShell>
          <OverviewPlaceholder />
        </AppShell>
      </ThemeModeProvider>
    </ThemeProvider>
  )
}
