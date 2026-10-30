import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  getSystemMode,
  readStoredMode,
  storeMode,
  subscribeToSystemMode,
  ThemeModeContext,
  UI5_THEMES,
  type ThemeMode,
} from './useThemeMode.ts'

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [manualMode, setManualMode] = useState<ThemeMode | null>(readStoredMode)
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode)
  const mode = manualMode ?? systemMode

  // Follow system changes as long as the visitor has not chosen a mode manually (AC-09.1)
  useEffect(() => subscribeToSystemMode(setSystemMode), [])

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    void setTheme(UI5_THEMES[mode])
  }, [mode])

  const toggleMode = useCallback(() => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark'
    setManualMode(next)
    storeMode(next)
  }, [mode])

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode])

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}
