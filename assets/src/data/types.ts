export interface Profile {
  name: string
  tagline: string
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
export type CardSize = 'large' | 'wide' | 'tall' | 'small'

export interface CardDef {
  id: string
  title: string
  subtitle?: string
  /** UI5 icon name */
  icon: string
  kpi?: string
  size: CardSize
  /** External link, e.g. the GitHub profile */
  href?: string
}
