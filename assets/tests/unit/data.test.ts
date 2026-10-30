import { describe, expect, it } from 'vitest'
import { career } from '../../src/data/career.ts'
import { contactChannels } from '../../src/data/contact.ts'
import { profile } from '../../src/data/profile.ts'
import { projects } from '../../src/data/projects.ts'
import { LEVEL_PERCENT, skills, sortedSkills } from '../../src/data/skills.ts'
import { buildCards, countSkills, yearsOfExperience } from '../../src/data/cards.ts'

const ids = (items: { id: string }[]) => items.map((i) => i.id)
const isUnique = (values: string[]) => new Set(values).size === values.length

describe('data', () => {
  it('AC-01.3 card KPIs are derived from the data', () => {
    const cards = Object.fromEntries(buildCards(new Date('2026-10-30')).map((t) => [t.id, t]))
    expect(cards.projects.kpi).toBe(String(projects.length))
    expect(cards.skills.kpi).toBe(String(countSkills(skills)))
    expect(cards.career.kpi).toBe(String(yearsOfExperience(career, new Date('2026-10-30'))))
    expect(cards.contact.kpi).toBe(String(contactChannels.length))
  })

  it('AC-01.3 profile and GitHub cards have no KPI', () => {
    const cards = Object.fromEntries(buildCards().map((c) => [c.id, c]))
    expect(cards.about.kpi).toBeUndefined()
    expect(cards.github.kpi).toBeUndefined()
  })

  it('AC-01.8 the profile card comes first', () => {
    expect(buildCards()[0]).toMatchObject({ id: 'about', title: 'About me' })
  })

  it('AC-01.3 counts distinct skills and full years of experience', () => {
    expect(
      countSkills([
        { name: 'X', level: 'Expert' },
        { name: 'Y', level: 'Familiar' },
        { name: 'Y', level: 'Familiar' },
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

  it('AC-03.2 skills contain all 10 skills from the intent, each once', () => {
    expect(skills.map((s) => s.name)).toEqual([
      'ABAP',
      'Node.js',
      'SAP UI5',
      'JavaScript',
      'HTML5',
      'ABAP RAP',
      'ABAP Programming Model for Fiori',
      'SAP OData (SEGW)',
      'SAP Adobe Forms',
      'User & Authorization Management',
    ])
    expect(isUnique(skills.map((s) => s.name))).toBe(true)
  })

  it('AC-03.5 levels map to bar lengths', () => {
    expect(LEVEL_PERCENT).toEqual({ Expert: 100, Advanced: 75, Intermediate: 50, Familiar: 25 })
  })

  it('AC-03.4 / AC-03.7 every skill has the level provided by Dominik', () => {
    expect(Object.fromEntries(skills.map((s) => [s.name, s.level]))).toEqual({
      ABAP: 'Advanced',
      'Node.js': 'Intermediate',
      'SAP UI5': 'Familiar',
      JavaScript: 'Familiar',
      HTML5: 'Advanced',
      'ABAP RAP': 'Intermediate',
      'ABAP Programming Model for Fiori': 'Advanced',
      'SAP OData (SEGW)': 'Expert',
      'SAP Adobe Forms': 'Expert',
      'User & Authorization Management': 'Advanced',
    })
  })

  it('AC-03.8 skills are sorted by level descending, ties keep the data order', () => {
    expect(sortedSkills().map((s) => s.name)).toEqual([
      'SAP OData (SEGW)',
      'SAP Adobe Forms',
      'ABAP',
      'HTML5',
      'ABAP Programming Model for Fiori',
      'User & Authorization Management',
      'Node.js',
      'ABAP RAP',
      'SAP UI5',
      'JavaScript',
    ])
    // Sorting must not change the source list
    expect(skills[0].name).toBe('ABAP')
  })

  it('AC-01.3 the skills KPI counts 10 skills', () => {
    expect(countSkills(skills)).toBe(10)
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
      about: 'wide',
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
    for (const list of [projects, career, contactChannels, buildCards()]) {
      expect(isUnique(ids(list))).toBe(true)
    }
  })
})
