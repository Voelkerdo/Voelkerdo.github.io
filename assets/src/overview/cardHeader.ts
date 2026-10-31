import { createContext, useContext, useEffect } from 'react'

/** Header texts a card view can set instead of its CardDef (AC-01.3, AC-02.6) */
export interface HeaderOverride {
  subtitle?: string
  kpi?: string
}

export const CardHeaderContext = createContext<(override: HeaderOverride | null) => void>(() => {})

/** Shows the given subtitle and KPI in the surrounding card header while mounted */
export function useCardHeader(override: HeaderOverride): void {
  const setOverride = useContext(CardHeaderContext)
  const { subtitle, kpi } = override
  useEffect(() => {
    setOverride({ subtitle, kpi })
    return () => setOverride(null)
  }, [setOverride, subtitle, kpi])
}
