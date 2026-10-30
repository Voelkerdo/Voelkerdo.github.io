import { ThemeProvider } from '@ui5/webcomponents-react'
import { HashRouter, Route, Routes } from 'react-router'

function LaunchpadPlaceholder() {
  return <main>Dominik Völker</main>
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LaunchpadPlaceholder />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
