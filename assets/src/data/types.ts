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
  /** Shown instead of the URL, e.g. for long profile URLs */
  description?: string
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

/** Group in Settings › Appearance (AC-11.2) */
export type ThemeGroup = 'Today' | 'SAP Fiori' | 'SAP GUI'

export type ThemeId =
  | 'sunset-coral-auto'
  | 'sunset-coral-light'
  | 'sunset-coral-dark'
  | 'horizon-morning'
  | 'horizon-evening'
  | 'quartz-light'
  | 'quartz-dark'
  | 'belize'
  | 'blue-crystal'
  | 'corbu'
  | 'signature'
  | 'enjoy'
  | 'classic'

export interface ThemeDef {
  id: ThemeId
  name: string
  /** Year the theme first appeared at SAP (D-15) */
  year: number
  group: ThemeGroup
  /** UI5 base theme; omitted for "Auto", which follows the system mode */
  ui5Theme?: string
  /** Recreated via UI5 CSS variables, not shipped by UI5 (TD-13) */
  emulated?: boolean
}
