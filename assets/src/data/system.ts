// Settings › System, like the system information of a Fiori launchpad (REQ-12)

export interface SystemEntry {
  label: string
  value: string
}

const { versions, buildDate, commit } = __SYSTEM_INFO__

export const techStack: SystemEntry[] = [
  { label: 'React', value: versions.react },
  { label: 'TypeScript', value: versions.typescript },
  { label: 'Vite', value: versions.vite },
  { label: 'SAP UI5 Web Components', value: versions.ui5 },
  { label: 'Motion', value: versions.motion },
]

// Host chosen in CR-12 (D-19)
export const hosting: SystemEntry[] = [
  { label: 'Provider', value: 'GitHub Pages' },
  { label: 'Type', value: 'Static site, no backend' },
]

export const build: SystemEntry[] = [
  { label: 'Build date', value: buildDate },
  { label: 'Commit', value: commit },
]
