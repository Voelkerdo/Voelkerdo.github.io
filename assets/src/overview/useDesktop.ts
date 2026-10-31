import { useSyncExternalStore } from 'react'

// Only the 4-column grid needs the cards to stay short (AC-01.11, tech spec §6)
const DESKTOP_QUERY = '(min-width: 1024px)'

export function useDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(DESKTOP_QUERY)
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
  )
}
