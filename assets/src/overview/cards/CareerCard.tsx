import { Button, Timeline, TimelineItem, type TimelineDomRef } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/suitcase.js'
import { useReducedMotion } from 'motion/react'
import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type TransitionEvent,
} from 'react'
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
  // On collapse the current station's highlights close only after the container has shrunk
  const [highlightsOpen, setHighlightsOpen] = useState(false)
  // Animate only after the visitor toggled, not when the first measurement arrives
  const [toggled, setToggled] = useState(false)
  const [heights, setHeights] = useState<Heights | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<TimelineDomRef>(null)

  const collapsible = desktop && stations.length > VISIBLE_STATIONS
  const animated = toggled && !reduceMotion

  // One UI5 Timeline, clipped by its container; both heights are derived from the current
  // layout, so they stay valid while the highlights open or close (D-16, tech spec §6)
  useLayoutEffect(() => {
    const container = containerRef.current
    const timeline = timelineRef.current
    if (!collapsible || !container || !timeline) return
    const measure = () => {
      const items = timeline.querySelectorAll('[ui5-timeline-item]')
      const firstHidden = items[VISIBLE_STATIONS]
      const highlights = items[0]?.querySelector('.career-highlights-wrap')
      if (!firstHidden || !highlights) return
      // Rects include the card's hover lift (scale), offsetHeight does not (AC-07.3)
      const box = container.getBoundingClientRect()
      const scale = container.offsetHeight > 0 ? box.height / container.offsetHeight : 1
      const openHeight = highlights.firstElementChild!.scrollHeight
      const currentHeight = highlights.getBoundingClientRect().height / scale
      setHeights({
        collapsed: (firstHidden.getBoundingClientRect().top - box.top) / scale - currentHeight,
        full: timeline.getBoundingClientRect().height / scale - currentHeight + openHeight,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(timeline)
    return () => observer.disconnect()
  }, [collapsible])

  const toggle = () => {
    const next = !showAll
    setShowAll(next)
    setToggled(true)
    if (next || reduceMotion) setHighlightsOpen(next)
  }

  const onContainerTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !showAll) setHighlightsOpen(false)
  }

  const height = collapsible && heights ? (showAll ? heights.full : heights.collapsed) : undefined

  return (
    <div className="career">
      <div
        ref={containerRef}
        id={STATIONS_ID}
        className="career-stations"
        data-animated={animated}
        style={{ height }}
        onTransitionEnd={onContainerTransitionEnd}
      >
        <Timeline ref={timelineRef} className="career-timeline" accessibleName="Career">
          {stations.map((station, index) => {
            // Collapsed on desktop: role, company and period of the current station only (AC-04.3)
            const open = !collapsible || index > 0 || highlightsOpen
            return (
              <TimelineItem
                key={station.id}
                data-station-id={station.id}
                icon="suitcase"
                titleText={station.role}
                subtitleText={`${station.company} · ${formatPeriod(station)}`}
                inert={collapsible && !showAll && index >= VISIBLE_STATIONS}
              >
                <div
                  className="career-highlights-wrap"
                  data-open={open}
                  data-animated={animated}
                  inert={!open}
                >
                  <ul className="career-highlights">
                    {station.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </TimelineItem>
            )
          })}
        </Timeline>
      </div>
      {collapsible && (
        <Button
          design="Transparent"
          className="career-toggle"
          data-testid="career-toggle"
          accessibilityAttributes={{ expanded: showAll, controls: STATIONS_ID }}
          onClick={toggle}
        >
          {showAll ? 'Show less' : `Show all (${stations.length})`}
        </Button>
      )}
    </div>
  )
}
