import { expect, test, type Page } from '@playwright/test'

// Expected order (AC-03.8) and levels (AC-03.7)
const expected = [
  ['SAP OData (SEGW)', 'Expert'],
  ['SAP Adobe Forms', 'Expert'],
  ['ABAP', 'Advanced'],
  ['HTML5', 'Advanced'],
  ['ABAP Programming Model for Fiori', 'Advanced'],
  ['User & Authorization Management', 'Advanced'],
  ['Node.js', 'Intermediate'],
  ['ABAP RAP', 'Intermediate'],
  ['SAP UI5', 'Familiar'],
  ['JavaScript', 'Familiar'],
]
const PERCENT: Record<string, number> = {
  Expert: 100,
  Advanced: 75,
  Intermediate: 50,
  Familiar: 25,
}
const expectedPercents = expected.map(([, level]) => PERCENT[level])

const skillsCard = (page: Page) => page.locator('[data-card-id="skills"]')
const bars = (page: Page) => skillsCard(page).locator('.skill-bar')

// Width of the filled bar relative to its track, in percent
const fillPercent = (page: Page) =>
  bars(page).evaluateAll((els) =>
    els.map((el) => {
      // The filled bar lies on top of the full-width track; both share the same parent
      const bar = el.shadowRoot!.querySelector('[part="bar"]')!
      const track = bar.parentElement!.getBoundingClientRect().width
      return Math.round((bar.getBoundingClientRect().width / track) * 100)
    }),
  )

test.describe('skills card', () => {
  test('AC-03.8 skills form one list sorted by level, without categories', async ({ page }) => {
    await page.goto('/')
    await expect(skillsCard(page).locator('.skill-name')).toHaveText(expected.map(([name]) => name))
    await expect(skillsCard(page).locator('[data-skill-group], .skill-group-title')).toHaveCount(0)
  })

  test('AC-03.2 / AC-03.5 every skill shows its level in a progress bar', async ({ page }) => {
    await page.goto('/')
    const levels = await bars(page).evaluateAll((els) =>
      els.map((el) => (el as HTMLElement & { displayValue: string }).displayValue),
    )
    expect(levels).toEqual(expected.map(([, level]) => level))
  })

  test('AC-03.8 skill name and bar sit side by side', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    const first = skillsCard(page).locator('.skill').first()
    const name = (await first.locator('.skill-name').boundingBox())!
    const bar = (await first.locator('.skill-bar').boundingBox())!
    expect(bar.x).toBeGreaterThan(name.x + name.width - 1)
    // The name is vertically centered on the bar track
    const centers = await first.evaluate((row) => {
      const nameBox = row.querySelector('.skill-name')!.getBoundingClientRect()
      const track = row
        .querySelector('.skill-bar')!
        .shadowRoot!.querySelector('[part="remaining-bar"]')!
        .getBoundingClientRect()
      return [nameBox.top + nameBox.height / 2, track.top + track.height / 2]
    })
    expect(Math.abs(centers[0] - centers[1])).toBeLessThanOrEqual(2)
  })

  test('AC-03.5 / AC-03.6 bars fill to the length of their level', async ({ page }) => {
    await page.goto('/')
    await expect(bars(page)).toHaveCount(expected.length)
    await expect.poll(() => fillPercent(page), { timeout: 5000 }).toEqual(expectedPercents)
  })

  test('AC-03.6 bars animate with a staggered transition', async ({ page }) => {
    await page.goto('/')
    const timings = await bars(page).evaluateAll((els) =>
      els.map((el) => {
        const style = getComputedStyle(el.shadowRoot!.querySelector('[part="bar"]')!)
        return { duration: style.transitionDuration, delay: style.transitionDelay }
      }),
    )
    expect(timings[0]).toEqual({ duration: '0.8s', delay: '0s' })
    expect(timings[1].delay).toBe('0.06s')
  })

  test('AC-03.6 / AC-08.3 with reduced motion bars are full immediately without animation', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const durations = await bars(page).evaluateAll((els) =>
      els.map(
        (el) => getComputedStyle(el.shadowRoot!.querySelector('[part="bar"]')!).transitionDuration,
      ),
    )
    expect(new Set(durations)).toEqual(new Set(['0s']))
    expect(await fillPercent(page)).toEqual(expectedPercents)
  })
})
