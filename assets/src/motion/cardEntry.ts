import { createContext, useContext } from 'react'

/** True once the surrounding card has finished its entry animation (AC-03.6). */
export const CardEntryContext = createContext(true)

export function useCardEntered(): boolean {
  return useContext(CardEntryContext)
}
