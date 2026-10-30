import { expect, test, type Page } from '@playwright/test'

// Expected content from specs/00-intent.md (AC-03.2) and levels from AC-03.7
const expectedGroups = [
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      ['ABAP', 'Advanced'],
      ['Node.js', 'Intermediate'],
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: [
      ['SAP UI5', 'Familiar'],
      ['JavaScript', 'Familiar'],
      ['HTML5', 'Advanced'],
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks',
    skills: [
      ['SAP UI5', 'Familiar'],
      ['ABAP RAP', 'Intermediate'],
      ['ABAP Programming Model for Fiori', 'Advanced'],
      ['SAP OData (SEGW)', 'Expert'],
      ['SAP Adobe Forms', 'Expert'],
    ],
  },
  {
    id: 'sap',
    title: 'Further SAP Experience',
    skills: [['User & Authorization Management', 'Advanced']],
  },
]
const PERCENT: Record<string, number> = {
  Expert: 100,
  Advanced: 75,
  Intermediate: 50,
  Familiar: 25,
}

const bars = (page: Page) => page.locator('[data-card-id="skills"] .skill-bar')

// Width of the filled part relative to the whole bar, in percent
const fillPercent = (page: Page) =>
  bars(page).evaluateAll((els) =>
    els.map((el) => {
      // The filled bar lies on top of the full-width track; both share the same parent
      const bar = el.shadowRoot!.querySelector('[part="bar"]')!
      const track = bar.parentElement!.getBoundingClientRect().width
      return Math.round((bar.getBoundingClientRect().width / track) * 100)
    }),
  )

const expectedPercents = expectedGroups.flatMap((g) => g.skills.map(([, level]) => PERCENT[level]))

test.describe('skills card', () => {
  test('AC-03.1 skill groups are shown in the specified order', async ({ page }) => {
    await page.goto('/')
    const groups = page.locator('[data-card-id="skills"] [data-skill-group]')
    await expect(groups).toHaveCount(4)
    const ids = await groups.evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-skill-group')),
    )
    expect(ids).toEqual(expectedGroups.map((g) => g.id))
  })

  test('AC-03.2 / AC-03.5 every skill shows its name and level in a progress bar', async ({
    page,
  }) => {
    await page.goto('/')
    for (const group of expectedGroups) {
      const section = page.locator(`[data-skill-group="${group.id}"]`)
      await expect(section.locator('.skill-group-title')).toHaveText(group.title)
      await expect(section.locator('.skill-name')).toHaveText(group.skills.map(([name]) => name))
      const levels = await section
        .locator('ui5-progress-indicator')
        .evaluateAll((els) =>
          els.map((el) => (el as HTMLElement & { displayValue: string }).displayValue),
        )
      expect(levels).toEqual(group.skills.map(([, level]) => level))
    }
  })

  test('AC-03.5 / AC-03.6 bars fill to the length of their level', async ({ page }) => {
    await page.goto('/')
    await expect(bars(page)).toHaveCount(expectedPercents.length)
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
