import { career } from './career.ts'
import { contactChannels } from './contact.ts'
import { profile } from './profile.ts'
import { projects } from './projects.ts'
import { skillGroups } from './skills.ts'
import type { CardDef, CareerStation, SkillGroup } from './types.ts'

/** Number of distinct skills across all groups (a skill may appear in several groups). */
export function countSkills(groups: SkillGroup[]): number {
  return new Set(groups.flatMap((g) => g.skills)).size
}

/** Full years since the earliest career station started. */
export function yearsOfExperience(stations: CareerStation[], now: Date = new Date()): number {
  if (stations.length === 0) return 0
  const earliest = stations.map((s) => s.from).sort()[0]
  const [year, month] = earliest.split('-').map(Number)
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month)
  return Math.max(0, Math.floor(months / 12))
}

export function buildCards(now: Date = new Date()): CardDef[] {
  return [
    {
      id: 'projects',
      title: 'Projects',
      subtitle: 'Selected repositories',
      icon: 'source-code',
      kpi: String(projects.length),
      size: 'large',
    },
    {
      id: 'skills',
      title: 'Skills',
      subtitle: 'Tech stack',
      icon: 'wrench',
      kpi: String(countSkills(skillGroups)),
      size: 'wide',
    },
    {
      id: 'career',
      title: 'Career',
      subtitle: 'Years of experience',
      icon: 'history',
      kpi: String(yearsOfExperience(career, now)),
      size: 'tall',
    },
    {
      id: 'contact',
      title: 'Contact',
      subtitle: 'Get in touch',
      icon: 'email',
      kpi: String(contactChannels.length),
      size: 'small',
    },
    {
      id: 'github',
      title: 'GitHub',
      subtitle: `@${profile.githubUsername}`,
      icon: 'chain-link',
      size: 'small',
      href: profile.githubUrl,
    },
  ]
}
