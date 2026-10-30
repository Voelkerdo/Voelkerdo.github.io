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

export type SkillGroupId = 'backend' | 'frontend' | 'frameworks' | 'sap'

export interface SkillGroup {
  id: SkillGroupId
  title: string
  skills: string[]
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

export interface TileDef {
  id: string
  title: string
  subtitle?: string
  /** UI5 icon name */
  icon: string
  kpi?: string
  /** Internal app route, e.g. `/projects` */
  route?: string
  /** External link, e.g. the GitHub profile */
  href?: string
}
