import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// The README lives in the repo root, one level above assets/
const ROOT = '..'
const readme = readFileSync(join(ROOT, 'README.md'), 'utf8')

/** Local targets of images (src, srcset) and Markdown links */
const localTargets = [
  ...readme.matchAll(/(?:src|srcset)="([^"]+)"/g),
  ...readme.matchAll(/\]\(([^)]+)\)/g),
]
  .map((match) => match[1])
  .filter((target) => !/^(https?:|#|mailto:)/.test(target))

describe('repository README', () => {
  it('AC-15.1 is English and links the live site', () => {
    expect(readme).toContain('https://voelkerdo.github.io/')
    expect(readme).toContain('## ✨ Highlights')
  })

  it('AC-15.5 every local image and link in the README exists', () => {
    expect(localTargets.length).toBeGreaterThan(5)
    for (const target of localTargets) expect(existsSync(join(ROOT, target)), target).toBe(true)
  })

  it('AC-15.5 the time travel GIF is at most 3 MB', () => {
    expect(statSync(join(ROOT, '.github/readme/time-travel.gif')).size).toBeLessThanOrEqual(
      3 * 1024 * 1024,
    )
  })

  it('AC-15.6 code is MIT licensed, personal content is excluded', () => {
    const license = readFileSync(join(ROOT, 'LICENSE'), 'utf8')
    expect(license).toMatch(/^MIT License/)
    expect(license).toContain('Personal content is not covered by this license')
  })
})
