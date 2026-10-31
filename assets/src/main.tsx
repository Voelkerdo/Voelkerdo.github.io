import { setDefaultFontLoading } from '@ui5/webcomponents-base/dist/config/Fonts.js'
import { setLanguage } from '@ui5/webcomponents-base/dist/config/Language.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ui5/webcomponents-react/dist/Assets.js'
import App from './App.tsx'
import './styles/fonts.css'
import './styles/theme.css'
import './styles/eras.css'

// No font requests to the UI5 CDN; styles/fonts.css serves "72" from this site (AC-13.1)
setDefaultFontLoading(false)
// The site is English (intent); without this UI5 follows the browser and loads e.g. German texts
void setLanguage('en')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
