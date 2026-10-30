import { useEffect, useState } from 'react'

/**
 * Returns whether bars should show their target value. Starts empty and fills after the
 * first paint so the built-in width transition animates; with reduced motion bars are
 * filled from the start (AC-03.6, AC-08.3).
 */
export function useBarFill(reduceMotion: boolean): boolean {
  const [filled, setFilled] = useState(reduceMotion)

  useEffect(() => {
    if (reduceMotion) {
      setFilled(true)
      return
    }
    const frame = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion])

  return filled
}
