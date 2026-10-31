import type { CareerStation } from './types.ts'

// Provided by Dominik (D-3, AC-04.2)
export const career: CareerStation[] = [
  {
    id: 'meyer-werft-application-expert',
    from: '2025-07',
    role: 'Application Expert SAP Development and SAP Authorizations',
    company: 'MEYER WERFT GmbH',
    highlights: [
      'Build and maintain ABAP applications – RAP, ABAP Programming Model for SAP Fiori, reports and forms',
      'Manage SAP users and authorization roles',
      'Improve development processes and workflows',
    ],
  },
  {
    id: 'meyer-werft-application-professional',
    from: '2019-08',
    to: '2025-06',
    role: 'Application Professional',
    company: 'MEYER WERFT GmbH',
    highlights: [
      'Maintain SAP authorization concepts and roles',
      'Develop print forms with SAP Adobe Forms',
      'Build object-oriented ABAP applications (ABAP OO)',
    ],
  },
  {
    id: 'meyer-werft-apprenticeship',
    from: '2016-08',
    to: '2019-07',
    role: 'IT Specialist for Application Development (apprenticeship)',
    company: 'MEYER WERFT GmbH',
    highlights: ['Implement REST APIs for system integration'],
  },
]

/** Stations visible on desktop before "Show all" (AC-04.3) */
export const VISIBLE_STATIONS = 1

/** Newest station first, by start month (AC-04.1). */
export function sortedCareer(stations: CareerStation[] = career): CareerStation[] {
  return [...stations].sort((a, b) => b.from.localeCompare(a.from))
}

const monthFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  return monthFormat.format(new Date(Date.UTC(year, month - 1)))
}

/** e.g. "Jan 2022 – Present" (AC-04.1) */
export function formatPeriod(station: Pick<CareerStation, 'from' | 'to'>): string {
  return `${formatMonth(station.from)} – ${station.to ? formatMonth(station.to) : 'Present'}`
}
