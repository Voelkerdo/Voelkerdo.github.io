import { Timeline, TimelineItem } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/suitcase.js'
import { formatPeriod, sortedCareer } from '../../data/career.ts'

const stations = sortedCareer()

export function CareerCard() {
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
