import { ThemeProvider } from '@ui5/webcomponents-react'
import { HashRouter, Route, Routes } from 'react-router'
import { ThemeModeProvider } from './shell/ThemeModeProvider.tsx'

function LaunchpadPlaceholder() {
  return <main>Dominik Völker</main>
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemeModeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LaunchpadPlaceholder />} />
          </Routes>
        </HashRouter>
      </ThemeModeProvider>
    </ThemeProvider>
  )
}
