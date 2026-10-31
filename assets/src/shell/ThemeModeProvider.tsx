import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_THEME } from '../data/themes.ts'
import type { ThemeId } from '../data/types.ts'
import {
  getSystemMode,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  subscribeToSystemMode,
  ThemeModeContext,
  type ThemeMode,
} from './useThemeMode.ts'

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [chosenTheme, setChosenTheme] = useState<ThemeId | null>(readStoredTheme)
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode)
  const theme = chosenTheme ?? DEFAULT_THEME

  // "Auto" follows system changes (AC-09.1)
  useEffect(() => subscribeToSystemMode(setSystemMode), [])

  useEffect(() => {
    const resolved = resolveTheme(theme, systemMode)
    document.documentElement.dataset.theme = resolved.id
    void setTheme(resolved.ui5Theme!)
  }, [theme, systemMode])

  const selectTheme = useCallback((id: ThemeId) => {
    setChosenTheme(id)
    storeTheme(id)
  }, [])

  const value = useMemo(() => ({ theme, selectTheme }), [theme, selectTheme])

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}
