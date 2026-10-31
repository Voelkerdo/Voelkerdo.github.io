import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ui5/webcomponents-react/dist/Assets.js'
import App from './App.tsx'
import './styles/theme.css'
import './styles/eras.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
