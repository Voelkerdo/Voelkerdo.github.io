import { expect, test, type Page } from '@playwright/test'

type ItemProps = { title: string; subtitle: string }

const items = (page: Page) => page.locator('[data-card-id="career"] ui5-timeline-item')
const station = (page: Page, id: string) => page.locator(`[data-station-id="${id}"]`)
const area = (page: Page) => page.getByTestId('career-scroll-area')
const up = (page: Page) => page.getByTestId('career-up')
const down = (page: Page) => page.getByTestId('career-down')
const SECOND = 'meyer-werft-application-professional'

const scrollTop = (page: Page) => area(page).evaluate((el) => el.scrollTop)

/** Distance of a station's top from the top of the visible scroll area */
const offsetInArea = (page: Page, id: string) =>
  page.evaluate((stationId) => {
    const el = document.querySelector('[data-testid="career-scroll-area"]')!
    const item = document.querySelector(`[data-station-id="${stationId}"]`)!
    return item.getBoundingClientRect().top - el.getBoundingClientRect().top
  }, id)

test.describe('career card', () => {
  test('AC-04.1 timeline shows period, role, company and highlights, newest first', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 900 })
    await page.goto('/')
    await expect(items(page)).toHaveCount(3)
    const props = await items(page).evaluateAll((els) =>
      els.map((el) => {
        const item = el as HTMLElement & { titleText: string; subtitleText: string }
        return { title: item.titleText, subtitle: item.subtitleText } as ItemProps
      }),
    )
    // Newest station first (D-3, T-31)
    expect(props).toEqual([
      {
        title: 'Application Expert SAP Development and SAP Authorizations',
        subtitle: 'MEYER WERFT GmbH · Jul 2025 – Present',
      },
      { title: 'Application Professional', subtitle: 'MEYER WERFT GmbH · Aug 2019 – Jun 2025' },
      {
        title: 'IT Specialist for Application Development (apprenticeship)',
        subtitle: 'MEYER WERFT GmbH · Aug 2016 – Jul 2019',
      },
    ])
    for (const item of await items(page).all()) {
      await expect(item.locator('.career-highlights li').first()).toBeVisible()
    }
  })

  test.describe('desktop (1280 px)', () => {
    test.use({ viewport: { width: 1280, height: 900 } })

    test('AC-04.4 the card keeps the collapsed height of CR-10', async ({ page }) => {
      await page.goto('/')
      await expect(area(page)).toBeVisible()
      // Natural card height, independent of how far the grid row stretches it
      const height = await page.evaluate(() => {
        const card = document.querySelector('[data-card-id="career"] .overview-card')!
        const header = card.querySelector('[slot="header"]')!.getBoundingClientRect()
        const content = card.querySelector('.career-scroll')!.getBoundingClientRect()
        return content.bottom - header.top
      })
      // CR-10 collapsed: 300 px
      expect(height).toBeGreaterThan(284)
      expect(height).toBeLessThan(316)
    })

    test('AC-04.4 arrows step station by station and show only where scrolling is possible', async ({
      page,
    }) => {
      await page.goto('/')
      await expect(down(page)).toBeVisible()
      await expect(up(page)).toBeHidden()

      // The current station is taller than the area: it is paged through first, then the
      // second station lands just below the ▲ arrow, never skipped
      const seen: number[] = []
      for (let i = 0; i < 5 && (seen.at(-1) ?? Infinity) > 34; i++) {
        const before = await scrollTop(page)
        await down(page).click()
        await expect.poll(() => scrollTop(page)).toBeGreaterThan(before)
        await page.waitForTimeout(600)
        seen.push(await offsetInArea(page, SECOND))
      }
      expect(seen.at(-1)).toBeGreaterThanOrEqual(30)
      expect(seen.at(-1)).toBeLessThanOrEqual(34)
      await expect(up(page)).toBeVisible()

      for (let i = 0; i < 10 && (await down(page).isVisible()); i++) {
        const before = await scrollTop(page)
        await down(page).click()
        await expect.poll(() => scrollTop(page)).toBeGreaterThan(before)
        await page.waitForTimeout(600)
      }
      await expect(down(page)).toBeHidden()
      const atEnd = await area(page).evaluate((el) => el.scrollHeight - el.clientHeight)
      await expect.poll(() => scrollTop(page)).toBeGreaterThanOrEqual(atEnd - 1)

      for (let i = 0; i < 10 && (await up(page).isVisible()); i++) {
        const before = await scrollTop(page)
        await up(page).click()
        await expect.poll(() => scrollTop(page)).toBeLessThan(before)
        await page.waitForTimeout(600)
      }
      await expect.poll(() => scrollTop(page)).toBe(0)
      await expect(up(page)).toBeHidden()
    })

    test('AC-04.4 the scroll area grows with the card when Projects is expanded', async ({
      page,
    }) => {
      await page.goto('/')
      // Gap between the bottom of the visible area and the bottom of the career card
      const layout = () =>
        page.evaluate(() => {
          const area = document.querySelector('[data-testid="career-scroll-area"]')!
          const card = area.closest('[ui5-card]')!
          const a = area.getBoundingClientRect()
          return {
            height: Math.round(a.height),
            gap: card.getBoundingClientRect().bottom - a.bottom,
          }
        })
      const initial = await layout()
      expect(initial.height).toBe(224)

      await page.getByTestId('projects-toggle').click()
      await page.mouse.move(0, 0)
      await expect.poll(async () => (await layout()).height).toBeGreaterThan(initial.height + 50)
      await expect.poll(async () => Math.abs((await layout()).gap - initial.gap)).toBeLessThan(2)

      await page.getByTestId('projects-toggle').click()
      await page.mouse.move(0, 0)
      await expect.poll(async () => (await layout()).height).toBe(224)
    })

    test('AC-04.4 the mouse wheel scrolls the page, not the card', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 600 })
      await page.goto('/')
      await area(page).hover()
      await page.mouse.wheel(0, 200)
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
      expect(await scrollTop(page)).toBe(0)
    })

    test('AC-04.4 arrows work with the keyboard and have accessible names', async ({ page }) => {
      await page.goto('/')
      await expect(down(page)).toHaveAttribute('accessible-name', 'Next station')
      await expect(up(page)).toHaveAttribute('accessible-name', 'Previous station')
      await down(page).focus()
      await page.keyboard.press('Enter')
      await expect.poll(() => scrollTop(page)).toBeGreaterThan(0)
      // All stations stay readable for screen readers
      for (const item of await items(page).all()) await expect(item).not.toHaveAttribute('inert')
    })

    test('AC-04.4 / AC-08.3 with reduced motion the area jumps without animation', async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      // No smooth scrolling: the first step is reached right away
      await down(page).click()
      expect(await scrollTop(page)).toBeGreaterThan(0)
    })
  })

  for (const width of [800, 390]) {
    test(`AC-04.4 at ${width} px all stations are shown without arrows`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expect(items(page)).toHaveCount(3)
      await expect(area(page)).toHaveCount(0)
      await expect(down(page)).toHaveCount(0)
      await expect(station(page, 'meyer-werft-apprenticeship').locator('li').first()).toBeVisible()
    })
  }
})
