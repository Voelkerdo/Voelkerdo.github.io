import { createContext, useContext } from 'react'
import { DEFAULT_THEME, findTheme } from '../data/themes.ts'
import type { ThemeDef, ThemeId } from '../data/types.ts'

export type ThemeMode = 'light' | 'dark'

export const STORAGE_KEY = 'theme'
/** Before CR-8 only the mode of Sunset Coral was stored */
export const LEGACY_STORAGE_KEY = 'theme-mode'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function getSystemMode(): ThemeMode {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/** Reads the chosen theme; storage may be unavailable (private mode, blocked site data). */
export function readStoredTheme(): ThemeId | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) return findTheme(stored)?.id ?? null
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy !== 'light' && legacy !== 'dark') return null
    const migrated: ThemeId = `sunset-coral-${legacy}`
    window.localStorage.setItem(STORAGE_KEY, migrated)
    window.localStorage.removeItem(LEGACY_STORAGE_KEY)
    return migrated
  } catch {
    return null
  }
}

export function storeTheme(id: ThemeId): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Persisting is a convenience only
  }
}

/** "Auto" becomes the light or dark variant of Sunset Coral (AC-09.1, AC-11.3) */
export function resolveTheme(id: ThemeId, systemMode: ThemeMode): ThemeDef {
  const resolvedId = id === DEFAULT_THEME ? (`sunset-coral-${systemMode}` as const) : id
  return findTheme(resolvedId) ?? findTheme(`sunset-coral-${systemMode}`)!
}

export function subscribeToSystemMode(onChange: (mode: ThemeMode) => void): () => void {
  const query = window.matchMedia(DARK_QUERY)
  const listener = (event: MediaQueryListEvent) => onChange(event.matches ? 'dark' : 'light')
  query.addEventListener('change', listener)
  return () => query.removeEventListener('change', listener)
}

/** A theme change across years, shown by the time travel overlay (AC-11.6) */
export interface Travel {
  fromYear: number
  toYear: number
  /** Name of the theme travelled to */
  toName: string
}

export interface ThemeModeContextValue {
  /** The chosen theme, "Auto" included */
  theme: ThemeId
  selectTheme: (id: ThemeId) => void
  travel: Travel | null
  /** The overlay covers the page: switch the theme now */
  arrive: () => void
  /** The overlay has faded out */
  endTravel: () => void
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext)
  if (!context) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return context
}
