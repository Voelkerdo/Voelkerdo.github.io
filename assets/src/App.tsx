import { ThemeProvider } from '@ui5/webcomponents-react'
import { domAnimation, LazyMotion } from 'motion/react'
import { OverviewPage } from './overview/OverviewPage.tsx'
import { AppShell } from './shell/AppShell.tsx'
import { ThemeModeProvider } from './shell/ThemeModeProvider.tsx'

export default function App() {
  return (
    <ThemeProvider>
      {/* Only the animation features the cards use, a smaller start bundle on phones (AC-08.2) */}
      <LazyMotion features={domAnimation} strict>
        <ThemeModeProvider>
          <AppShell>
            <OverviewPage />
          </AppShell>
        </ThemeModeProvider>
      </LazyMotion>
    </ThemeProvider>
  )
}
