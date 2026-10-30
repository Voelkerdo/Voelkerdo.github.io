import { ThemeProvider } from '@ui5/webcomponents-react'
import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { appRoutes } from './apps/appRoutes.tsx'
import { LaunchpadShell } from './shell/LaunchpadShell.tsx'
import { ThemeModeProvider } from './shell/ThemeModeProvider.tsx'

// Replaced by the real launchpad page in T-07
function LaunchpadPlaceholder() {
  return <main className="launchpad-placeholder">Dominik Völker</main>
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeModeProvider>
        <HashRouter>
          <LaunchpadShell>
            <Routes>
              <Route path="/" element={<LaunchpadPlaceholder />} />
              {appRoutes.map((r) => (
                <Route key={r.id} path={r.path} element={r.element} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LaunchpadShell>
        </HashRouter>
      </ThemeModeProvider>
    </ThemeProvider>
  )
}
