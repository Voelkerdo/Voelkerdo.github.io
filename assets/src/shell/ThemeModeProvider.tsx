import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { DEFAULT_THEME, findTheme } from '../data/themes.ts'
import type { ThemeDef, ThemeId } from '../data/types.ts'
import {
  getSystemMode,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  subscribeToSystemMode,
  ThemeModeContext,
  type ThemeMode,
  type Travel,
} from './useThemeMode.ts'

function applyTheme(resolved: ThemeDef): Promise<void> {
  document.documentElement.dataset.theme = resolved.id
  return setTheme(resolved.ui5Theme!)
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [chosenTheme, setChosenTheme] = useState<ThemeId | null>(readStoredTheme)
  const [systemMode, setSystemMode] = useState<ThemeMode>(getSystemMode)
  const [travel, setTravel] = useState<Travel | null>(null)
  // Theme to arrive at; a selection made while travelling replaces it
  const travelTarget = useRef<ThemeId | null>(null)
  const theme = chosenTheme ?? DEFAULT_THEME
  const resolvedTheme = resolveTheme(theme, systemMode)

  // "Auto" follows system changes (AC-09.1)
  useEffect(() => subscribeToSystemMode(setSystemMode), [])

  useEffect(() => {
    void applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const selectTheme = useCallback(
    (id: ThemeId) => {
      storeTheme(id)
      if (travelTarget.current) {
        travelTarget.current = id
        return
      }
      const from = resolveTheme(theme, systemMode)
      const to = resolveTheme(id, systemMode)
      if (from.year !== to.year) {
        // Across years: the overlay counts, then calls arrive() (AC-11.6)
        travelTarget.current = id
        setTravel({ fromYear: from.year, toYear: to.year, toName: findTheme(id)!.name })
        return
      }
      // Same year (e.g. Light ↔ Dark): cross-fade only (AC-11.6)
      if (!document.startViewTransition) {
        setChosenTheme(id)
        return
      }
      document.startViewTransition(async () => {
        await applyTheme(to)
        setChosenTheme(id)
      })
    },
    [theme, systemMode],
  )

  const arrive = useCallback(() => {
    if (travelTarget.current) setChosenTheme(travelTarget.current)
  }, [])

  const endTravel = useCallback(() => {
    travelTarget.current = null
    setTravel(null)
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, selectTheme, travel, arrive, endTravel }),
    [theme, resolvedTheme, selectTheme, travel, arrive, endTravel],
  )

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}
