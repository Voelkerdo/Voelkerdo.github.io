import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useThemeMode } from './useThemeMode.ts'

const FADE_IN = 0.2
const COUNT = 1.5
const FADE_OUT = 0.3
// Time to read the arrival year before the overlay fades out
const HOLD = 0.4

/**
 * Year counter shown while switching to a theme of another year (AC-11.6, AC-11.7).
 * Lives in the top layer (popover) so it covers the UI5 settings dialog, which is there too (TD-14).
 */
export function TimeTravelOverlay() {
  const { travel, arrive, endTravel } = useThemeMode()
  const reduceMotion = useReducedMotion() ?? false
  const overlayRef = useRef<HTMLDivElement>(null)
  // Counted year; null until the count starts, so a new journey never shows a stale year
  const [countedYear, setCountedYear] = useState<number | null>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!travel || !overlay) return
    let cancelled = false
    const controls: { stop: () => void }[] = []
    const track = <T extends { stop: () => void }>(animation: T) => {
      controls.push(animation)
      return animation
    }

    overlay.showPopover()

    void (async () => {
      await track(animate(overlay, { opacity: [0, 1] }, { duration: FADE_IN }))
      if (cancelled) return
      if (!reduceMotion) {
        await track(
          animate(travel.fromYear, travel.toYear, {
            duration: COUNT,
            ease: 'easeOut',
            onUpdate: (value) => setCountedYear(Math.round(value)),
          }),
        )
      }
      if (cancelled) return
      arrive()
      await track(animate(overlay, { opacity: 0 }, { duration: FADE_OUT, delay: HOLD }))
      if (cancelled) return
      overlay.hidePopover()
      endTravel()
    })()

    return () => {
      cancelled = true
      controls.forEach((c) => c.stop())
      if (overlay.matches(':popover-open')) overlay.hidePopover()
      setCountedYear(null)
    }
  }, [travel, reduceMotion, arrive, endTravel])

  return (
    <div ref={overlayRef} popover="manual" className="time-travel" data-testid="time-travel">
      {travel && (
        <>
          <span className="time-travel-year" data-testid="time-travel-year" aria-hidden="true">
            {reduceMotion ? travel.toYear : (countedYear ?? travel.fromYear)}
          </span>
          <span className="time-travel-target" aria-hidden="true">
            {travel.toName}
          </span>
        </>
      )}
      <span role="status" className="visually-hidden">
        {travel ? `Travelling to ${travel.toYear} – ${travel.toName}` : ''}
      </span>
    </div>
  )
}
