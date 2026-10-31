import { Button, Timeline, TimelineItem, type TimelineDomRef } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/suitcase.js'
import { useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { formatPeriod, sortedCareer, VISIBLE_STATIONS } from '../../data/career.ts'

const stations = sortedCareer()
const STATIONS_ID = 'career-stations'
// Only the 4-column grid places Career next to the short cards (AC-04.3, tech spec §6)
const DESKTOP_QUERY = '(min-width: 1024px)'

function useDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(DESKTOP_QUERY)
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
  )
}

interface Heights {
  collapsed: number
  full: number
}

export function CareerCard() {
  const reduceMotion = useReducedMotion() ?? false
  const desktop = useDesktop()
  const [showAll, setShowAll] = useState(false)
  // Animate only after the visitor toggled, not when the first measurement arrives
  const [toggled, setToggled] = useState(false)
  const [heights, setHeights] = useState<Heights | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<TimelineDomRef>(null)

  const collapsible = desktop && stations.length > VISIBLE_STATIONS
  const collapsed = collapsible && !showAll

  // The timeline stays one UI5 Timeline; its container is clipped to the measured height (D-16)
  useLayoutEffect(() => {
    const container = containerRef.current
    const timeline = timelineRef.current
    if (!collapsible || !container || !timeline) return
    const measure = () => {
      const firstHidden = timeline.querySelectorAll('[ui5-timeline-item]')[VISIBLE_STATIONS]
      if (!firstHidden) return
      const top = container.getBoundingClientRect().top
      setHeights({
        collapsed: firstHidden.getBoundingClientRect().top - top,
        full: timeline.getBoundingClientRect().height,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(timeline)
    return () => observer.disconnect()
  }, [collapsible])

  const height = collapsible && heights ? (showAll ? heights.full : heights.collapsed) : undefined

  return (
    <div className="career">
      <div
        ref={containerRef}
        id={STATIONS_ID}
        className="career-stations"
        data-animated={toggled && !reduceMotion}
        style={{ height }}
      >
        <Timeline ref={timelineRef} className="career-timeline" accessibleName="Career">
          {stations.map((station, index) => (
            <TimelineItem
              key={station.id}
              data-station-id={station.id}
              icon="suitcase"
              titleText={station.role}
              subtitleText={`${station.company} · ${formatPeriod(station)}`}
              inert={collapsed && index >= VISIBLE_STATIONS}
            >
              <ul className="career-highlights">
                {station.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
      {collapsible && (
        <Button
          design="Transparent"
          className="career-toggle"
          data-testid="career-toggle"
          accessibilityAttributes={{ expanded: showAll, controls: STATIONS_ID }}
          onClick={() => {
            setShowAll((value) => !value)
            setToggled(true)
          }}
        >
          {showAll ? 'Show less' : `Show all (${stations.length})`}
        </Button>
      )}
    </div>
  )
}
