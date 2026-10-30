import type { CareerStation } from './types.ts'

// TODO(content): replace placeholder stations with real career data (D-3)
export const career: CareerStation[] = [
  {
    id: 'placeholder-current',
    from: '2022-01',
    role: 'Fullstack Developer',
    company: 'Company A',
    highlights: ['Placeholder highlight'],
  },
  {
    id: 'placeholder-previous',
    from: '2019-08',
    to: '2021-12',
    role: 'SAP Developer',
    company: 'Company B',
    highlights: ['Placeholder highlight'],
  },
]

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
