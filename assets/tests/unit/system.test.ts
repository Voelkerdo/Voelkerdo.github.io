import { describe, expect, it } from 'vitest'
import { build, hosting, techStack } from '../../src/data/system.ts'

describe('system information', () => {
  it('AC-12.2 the tech stack lists the five packages with a version from the build', () => {
    expect(techStack.map((entry) => entry.label)).toEqual([
      'React',
      'TypeScript',
      'Vite',
      'SAP UI5 Web Components',
      'Motion',
    ])
    for (const entry of techStack) expect(entry.value).toMatch(/^\d+\.\d+\.\d+/)
  })

  it('AC-12.2 hosting is GitHub Pages, a static site', () => {
    expect(hosting).toEqual([
      { label: 'Provider', value: 'GitHub Pages' },
      { label: 'Type', value: 'Static site, no backend' },
    ])
  })

  it('AC-12.2 build infos have a date and a commit', () => {
    const [date, commit] = build
    expect(date).toEqual({
      label: 'Build date',
      value: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    })
    expect(commit.label).toBe('Commit')
    expect(commit.value).toMatch(/^([0-9a-f]{7,}|unknown)$/)
  })
})
