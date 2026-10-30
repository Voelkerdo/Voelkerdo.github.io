import { ThemeProvider } from '@ui5/webcomponents-react'
import { OverviewPage } from './overview/OverviewPage.tsx'
import { AppShell } from './shell/AppShell.tsx'
import { ThemeModeProvider } from './shell/ThemeModeProvider.tsx'

export default function App() {
  return (
    <ThemeProvider>
      <ThemeModeProvider>
        <AppShell>
          <OverviewPage />
        </AppShell>
      </ThemeModeProvider>
    </ThemeProvider>
  )
}
