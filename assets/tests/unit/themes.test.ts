import { describe, expect, it } from 'vitest'
import { DEFAULT_THEME, themeLabel, themes } from '../../src/data/themes.ts'

describe('theme catalog', () => {
  it('AC-11.2 lists the themes grouped, newest first, with their year', () => {
    expect(themes.map((t) => [t.group, themeLabel(t)])).toEqual([
      ['Today', 'Sunset Coral (Auto) · 2026'],
      ['Today', 'Sunset Coral Light · 2026'],
      ['Today', 'Sunset Coral Dark · 2026'],
      ['SAP Fiori', 'SAP Morning Horizon · 2022'],
      ['SAP Fiori', 'SAP Evening Horizon · 2022'],
      ['SAP Fiori', 'SAP Quartz Light · 2019'],
      ['SAP Fiori', 'SAP Quartz Dark · 2019'],
    ])
  })

  it('AC-11.2 years never increase along the list', () => {
    const years = themes.map((t) => t.year)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })

  it('AC-11.3 default is Sunset Coral (Auto), which has no fixed UI5 theme', () => {
    expect(DEFAULT_THEME).toBe('sunset-coral-auto')
    expect(themes.find((t) => t.id === DEFAULT_THEME)?.ui5Theme).toBeUndefined()
  })

  it('AC-11.5 Horizon and Quartz are real UI5 themes', () => {
    expect(
      themes.filter((t) => t.group === 'SAP Fiori').map((t) => [t.id, t.ui5Theme, t.emulated]),
    ).toEqual([
      ['horizon-morning', 'sap_horizon', undefined],
      ['horizon-evening', 'sap_horizon_dark', undefined],
      ['quartz-light', 'sap_fiori_3', undefined],
      ['quartz-dark', 'sap_fiori_3_dark', undefined],
    ])
  })

  it('AC-11.2 theme IDs are unique', () => {
    expect(new Set(themes.map((t) => t.id)).size).toBe(themes.length)
  })
})
