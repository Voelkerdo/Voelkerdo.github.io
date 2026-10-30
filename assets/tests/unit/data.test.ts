import { describe, expect, it } from 'vitest'
import { career } from '../../src/data/career.ts'
import { contactChannels } from '../../src/data/contact.ts'
import { profile } from '../../src/data/profile.ts'
import { projects } from '../../src/data/projects.ts'
import { skillGroups } from '../../src/data/skills.ts'
import { buildCards, countSkills, yearsOfExperience } from '../../src/data/cards.ts'

const ids = (items: { id: string }[]) => items.map((i) => i.id)
const isUnique = (values: string[]) => new Set(values).size === values.length

describe('data', () => {
  it('AC-01.3 card KPIs are derived from the data', () => {
    const cards = Object.fromEntries(buildCards(new Date('2026-10-30')).map((t) => [t.id, t]))
    expect(cards.projects.kpi).toBe(String(projects.length))
    expect(cards.skills.kpi).toBe(String(countSkills(skillGroups)))
    expect(cards.career.kpi).toBe(String(yearsOfExperience(career, new Date('2026-10-30'))))
    expect(cards.contact.kpi).toBe(String(contactChannels.length))
  })

  it('AC-01.3 counts distinct skills and full years of experience', () => {
    expect(
      countSkills([
        { id: 'backend', title: 'A', skills: ['X', 'Y'] },
        { id: 'sap', title: 'B', skills: ['Y'] },
      ]),
    ).toBe(2)
    const stations = [{ id: 'a', from: '2020-11', role: 'r', company: 'c', highlights: [] }]
    expect(yearsOfExperience(stations, new Date('2026-10-15'))).toBe(5)
    expect(yearsOfExperience(stations, new Date('2026-11-15'))).toBe(6)
    expect(yearsOfExperience([])).toBe(0)
  })

  it('AC-02.3 projects come from a curated list with complete entries', () => {
    expect(projects.length).toBeGreaterThan(0)
    for (const p of projects) {
      expect(p.name).not.toBe('')
      expect(p.description).not.toBe('')
      expect(p.technologies.length).toBeGreaterThan(0)
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//)
    }
  })

  it('AC-03.1 skills are grouped into backend, frontend, frameworks and further SAP experience', () => {
    expect(ids(skillGroups)).toEqual(['backend', 'frontend', 'frameworks', 'sap'])
  })

  it('AC-03.2 skills contain the initial content from the intent', () => {
    const byId = Object.fromEntries(skillGroups.map((g) => [g.id, g.skills]))
    expect(byId.backend).toEqual(['ABAP', 'Node.js'])
    expect(byId.frontend).toEqual(['SAP UI5', 'JavaScript', 'HTML5'])
    expect(byId.frameworks).toEqual([
      'SAP UI5',
      'ABAP RAP',
      'ABAP Programming Model for Fiori',
      'SAP OData (SEGW)',
      'SAP Adobe Forms',
    ])
    expect(byId.sap).toEqual(['User & Authorization Management'])
  })

  it('AC-04.2 career stations use YYYY-MM dates', () => {
    for (const s of career) {
      expect(s.from).toMatch(/^\d{4}-\d{2}$/)
      if (s.to) expect(s.to).toMatch(/^\d{4}-\d{2}$/)
    }
  })

  it('AC-05.1 GitHub is the primary contact channel and points to the profile', () => {
    const primary = contactChannels.filter((c) => c.primary)
    expect(primary).toHaveLength(1)
    expect(primary[0].id).toBe('github')
    expect(primary[0].url).toBe(profile.githubUrl)
  })

  it('AC-01.6 cards have the specified sizes', () => {
    const sizes = Object.fromEntries(buildCards().map((c) => [c.id, c.size]))
    expect(sizes).toEqual({
      projects: 'large',
      skills: 'wide',
      career: 'tall',
      contact: 'small',
      github: 'small',
    })
  })

  it('AC-01.2 GitHub card links to the profile', () => {
    const github = buildCards().find((t) => t.id === 'github')
    expect(github?.href).toBe('https://github.com/Voelkerdo')
  })

  it('AC-02.3 / AC-04.2 / AC-05.1 ids are unique', () => {
    for (const list of [projects, skillGroups, career, contactChannels, buildCards()]) {
      expect(isUnique(ids(list))).toBe(true)
    }
  })
})
