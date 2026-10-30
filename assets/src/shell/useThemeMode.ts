import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export const STORAGE_KEY = 'theme-mode'
export const UI5_THEMES: Record<ThemeMode, string> = {
  light: 'sap_horizon',
  dark: 'sap_horizon_dark',
}

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function getSystemMode(): ThemeMode {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/** Reads the manually chosen mode; storage may be unavailable (private mode, blocked site data). */
export function readStoredMode(): ThemeMode | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

export function storeMode(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Persisting is a convenience only
  }
}

export function subscribeToSystemMode(onChange: (mode: ThemeMode) => void): () => void {
  const query = window.matchMedia(DARK_QUERY)
  const listener = (event: MediaQueryListEvent) => onChange(event.matches ? 'dark' : 'light')
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

export interface ThemeModeContextValue {
  mode: ThemeMode
  toggleMode: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext)
  if (!context) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return context
}
