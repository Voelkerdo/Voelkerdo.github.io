export interface Profile {
  name: string
  tagline: string
  /** Shown as "Currently building: …" in the profile card (AC-01.10) */
  currentlyBuilding: string
  githubUsername: string
  githubUrl: string
  avatarUrl?: string
  siteRepoUrl: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  repoUrl: string
}

export type SkillLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Familiar'

export interface Skill {
  name: string
  level: SkillLevel
}

export interface CareerStation {
  id: string
  /** Start month, format `YYYY-MM` */
  from: string
  /** End month, format `YYYY-MM`; omitted for the current position */
  to?: string
  role: string
  company: string
  highlights: string[]
}

export interface ContactChannel {
  id: string
  label: string
  url: string
  /** UI5 icon name */
  icon: string
  primary?: boolean
}

/** Card size in the bento grid (AC-01.6) */
export type CardSize = 'large' | 'wide' | 'tall'

export interface CardDef {
  id: string
  title: string
  subtitle?: string
  /** UI5 icon name */
  icon: string
  kpi?: string
  size: CardSize
}

export interface NotificationDef {
  id: string
  title: string
  text: string
  /** Relative time label, e.g. "Just now" */
  time: string
  importance?: 'High'
  /** Opened in a new tab when the notification is clicked */
  href?: string
}
