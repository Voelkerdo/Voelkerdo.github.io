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
      ['SAP Fiori', 'SAP Belize · 2016'],
      ['SAP Fiori', 'SAP Blue Crystal · 2013'],
      ['SAP GUI', 'SAP Corbu · 2012'],
      ['SAP GUI', 'SAP Signature · 2004'],
      ['SAP GUI', 'SAP Enjoy · 1999'],
      ['SAP GUI', 'SAP Classic · 1992'],
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
      themes.filter((t) => !t.emulated && t.group === 'SAP Fiori').map((t) => [t.id, t.ui5Theme]),
    ).toEqual([
      ['horizon-morning', 'sap_horizon'],
      ['horizon-evening', 'sap_horizon_dark'],
      ['quartz-light', 'sap_fiori_3'],
      ['quartz-dark', 'sap_fiori_3_dark'],
    ])
  })

  it('AC-11.5 older themes are recreated on top of SAP Quartz Light', () => {
    expect(themes.filter((t) => t.emulated).map((t) => [t.id, t.ui5Theme])).toEqual([
      ['belize', 'sap_fiori_3'],
      ['blue-crystal', 'sap_fiori_3'],
      ['corbu', 'sap_fiori_3'],
      ['signature', 'sap_fiori_3'],
      ['enjoy', 'sap_fiori_3'],
      ['classic', 'sap_fiori_3'],
    ])
  })

  it('AC-11.2 theme IDs are unique', () => {
    expect(new Set(themes.map((t) => t.id)).size).toBe(themes.length)
  })
})
