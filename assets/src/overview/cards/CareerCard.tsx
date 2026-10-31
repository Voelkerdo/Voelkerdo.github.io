import { Button, Timeline, TimelineItem, type ButtonDomRef } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/suitcase.js'
import '@ui5/webcomponents-icons/dist/navigation-up-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import { useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { formatPeriod, sortedCareer } from '../../data/career.ts'
import { useDesktop } from '../useDesktop.ts'

const stations = sortedCareer()
// Room for the ▲ arrow above a station title after scrolling (px)
const ARROW_SPACE = 32

/** Scroll positions at which each station starts, below the ▲ arrow */
function stationStops(area: HTMLElement): number[] {
  const box = area.getBoundingClientRect()
  // Rects include the card's hover lift (scale), offsetHeight does not (AC-07.3)
  const scale = area.offsetHeight > 0 ? box.height / area.offsetHeight : 1
  return [...area.querySelectorAll('[ui5-timeline-item]')].map((item, index) => {
    const top = (item.getBoundingClientRect().top - box.top) / scale + area.scrollTop
    return index === 0 ? 0 : Math.max(0, top - ARROW_SPACE)
  })
}

/**
 * Next scroll position: the neighbouring station. A station taller than the area is paged
 * through, keeping the lines under the arrow fades in view (AC-04.4).
 */
function scrollTarget(area: HTMLElement, direction: 1 | -1): number {
  const current = area.scrollTop
  const view = area.clientHeight
  const max = area.scrollHeight - view
  const stops = stationStops(area)
  const next =
    direction === 1
      ? stops.find((stop) => stop > current + 1)
      : stops.findLast((stop) => stop < current - 1)
  const page = view - 2 * ARROW_SPACE
  const target =
    next === undefined || Math.abs(next - current) > page ? current + direction * page : next
  return Math.min(max, Math.max(0, target))
}

function CareerTimeline() {
  return (
    <Timeline className="career-timeline" accessibleName="Career">
      {stations.map((station) => (
        <TimelineItem
          key={station.id}
          data-station-id={station.id}
          icon="suitcase"
          titleText={station.role}
          subtitleText={`${station.company} · ${formatPeriod(station)}`}
        >
          <ul className="career-highlights">
            {station.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

export function CareerCard() {
  const desktop = useDesktop()
  return desktop ? <ScrollingCareer /> : <CareerTimeline />
}

// Desktop: fixed height, moved only by the arrows; the mouse wheel keeps scrolling the page (D-18)
function ScrollingCareer() {
  const reduceMotion = useReducedMotion() ?? false
  const areaRef = useRef<HTMLDivElement>(null)
  const upRef = useRef<ButtonDomRef>(null)
  const downRef = useRef<ButtonDomRef>(null)
  const [canScroll, setCanScroll] = useState({ up: false, down: false })

  const update = useCallback(() => {
    const area = areaRef.current
    if (!area) return
    const up = area.scrollTop > 1
    const down = area.scrollTop < area.scrollHeight - area.clientHeight - 1
    setCanScroll((prev) => (prev.up === up && prev.down === down ? prev : { up, down }))
  }, [])

  useEffect(() => {
    const area = areaRef.current
    if (!area) return
    update()
    const observer = new ResizeObserver(update)
    observer.observe(area)
    if (area.firstElementChild) observer.observe(area.firstElementChild)
    area.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      area.removeEventListener('scroll', update)
    }
  }, [update])

  // Keep keyboard focus when an arrow disappears at the start or end
  useEffect(() => {
    const active = document.activeElement
    if (!canScroll.down && active === downRef.current) upRef.current?.focus()
    if (!canScroll.up && active === upRef.current) downRef.current?.focus()
  }, [canScroll])

  const scroll = (direction: 1 | -1) => {
    const area = areaRef.current
    if (!area) return
    area.scrollTo({
      top: scrollTarget(area, direction),
      behavior: reduceMotion ? 'instant' : 'smooth',
    })
  }

  return (
    <div className="career-scroll">
      <div ref={areaRef} className="career-scroll-area" data-testid="career-scroll-area">
        <CareerTimeline />
      </div>
      <div className="career-arrow career-arrow-up" hidden={!canScroll.up}>
        <Button
          ref={upRef}
          design="Transparent"
          icon="navigation-up-arrow"
          accessibleName="Previous station"
          tooltip="Previous station"
          data-testid="career-up"
          onClick={() => scroll(-1)}
        />
      </div>
      <div className="career-arrow career-arrow-down" hidden={!canScroll.down}>
        <Button
          ref={downRef}
          design="Transparent"
          icon="navigation-down-arrow"
          accessibleName="Next station"
          tooltip="Next station"
          data-testid="career-down"
          onClick={() => scroll(1)}
        />
      </div>
    </div>
  )
}
