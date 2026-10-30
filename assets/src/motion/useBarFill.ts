import { useEffect, useState } from 'react'

/**
 * Returns whether bars should show their target value. Bars stay empty until `start` is true
 * (card entered and in view), then fill on the next frame so the built-in width transition is
 * visible; with reduced motion they are filled from the start (AC-03.6, AC-08.3).
 */
export function useBarFill(reduceMotion: boolean, start: boolean): boolean {
  const [filled, setFilled] = useState(reduceMotion)

  useEffect(() => {
    if (reduceMotion) {
      setFilled(true)
      return
    }
    if (!start) return
    const frame = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion, start])

  return filled
}
