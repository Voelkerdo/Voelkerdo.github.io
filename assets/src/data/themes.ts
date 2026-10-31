import type { ThemeDef, ThemeGroup, ThemeId } from './types.ts'

const emulated = { ui5Theme: 'sap_fiori_3', emulated: true } as const

// Theme time travel, newest first within each group (AC-11.2, D-15)
export const themes: ThemeDef[] = [
  { id: 'sunset-coral-auto', name: 'Sunset Coral (Auto)', year: 2026, group: 'Today' },
  {
    id: 'sunset-coral-light',
    name: 'Sunset Coral Light',
    year: 2026,
    group: 'Today',
    ui5Theme: 'sap_horizon',
  },
  {
    id: 'sunset-coral-dark',
    name: 'Sunset Coral Dark',
    year: 2026,
    group: 'Today',
    ui5Theme: 'sap_horizon_dark',
  },
  {
    id: 'horizon-morning',
    name: 'SAP Morning Horizon',
    year: 2022,
    group: 'SAP Fiori',
    ui5Theme: 'sap_horizon',
  },
  {
    id: 'horizon-evening',
    name: 'SAP Evening Horizon',
    year: 2022,
    group: 'SAP Fiori',
    ui5Theme: 'sap_horizon_dark',
  },
  {
    id: 'quartz-light',
    name: 'SAP Quartz Light',
    year: 2019,
    group: 'SAP Fiori',
    ui5Theme: 'sap_fiori_3',
  },
  {
    id: 'quartz-dark',
    name: 'SAP Quartz Dark',
    year: 2019,
    group: 'SAP Fiori',
    ui5Theme: 'sap_fiori_3_dark',
  },
  // Not shipped by UI5 Web Components 2.x: recreated on top of Quartz Light (TD-13, styles/eras.css)
  { id: 'belize', name: 'SAP Belize', year: 2016, group: 'SAP Fiori', ...emulated },
  { id: 'blue-crystal', name: 'SAP Blue Crystal', year: 2013, group: 'SAP Fiori', ...emulated },
  { id: 'corbu', name: 'SAP Corbu', year: 2012, group: 'SAP GUI', ...emulated },
  { id: 'signature', name: 'SAP Signature', year: 2004, group: 'SAP GUI', ...emulated },
  { id: 'enjoy', name: 'SAP Enjoy', year: 1999, group: 'SAP GUI', ...emulated },
  { id: 'classic', name: 'SAP Classic', year: 1992, group: 'SAP GUI', ...emulated },
]

export const THEME_GROUPS: ThemeGroup[] = ['Today', 'SAP Fiori', 'SAP GUI']

export const DEFAULT_THEME: ThemeId = 'sunset-coral-auto'

export function findTheme(id: string): ThemeDef | undefined {
  return themes.find((theme) => theme.id === id)
}

/** Label in Settings › Appearance: name with the year beside it (AC-11.2) */
export function themeLabel(theme: ThemeDef): string {
  return `${theme.name} · ${theme.year}`
}
