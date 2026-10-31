import { expect, test, type Page } from '@playwright/test'

const card = (page: Page) => page.locator('[data-card-id="projects"]')
const viewButton = (page: Page, view: string) =>
  page.locator(`[data-testid="projects-views"] [data-view="${view}"]`)
const header = (page: Page) =>
  card(page)
    .locator('[slot="header"]')
    .evaluate((el) => {
      const h = el as HTMLElement & { subtitleText: string; additionalText: string }
      return { subtitle: h.subtitleText, kpi: h.additionalText }
    })
const transportItems = (page: Page) => card(page).locator('[data-transport]')
const visibleTransports = (page: Page) =>
  transportItems(page).evaluateAll((els) =>
    els
      .filter((el) => el.checkVisibility({ visibilityProperty: true }))
      .map((el) => el.getAttribute('data-transport')),
  )

const openTransportLog = async (page: Page) => {
  await viewButton(page, 'transports').click()
  await expect(page.getByTestId('build-stats')).toBeVisible()
}

test.describe('projects card views', () => {
  test('AC-02.6 "Repositories" is the default view with the project KPI', async ({ page }) => {
    await page.goto('/')
    await expect(viewButton(page, 'repositories')).toHaveAttribute('selected')
    await expect(card(page).locator('[data-project-id]').first()).toBeVisible()
    await expect.poll(() => header(page)).toEqual({ subtitle: 'Selected repositories', kpi: '5' })
  })

  test('AC-02.6 / AC-02.7 / AC-02.8 the Transport Log shows stats and transports', async ({
    page,
  }) => {
    await page.goto('/')
    await openTransportLog(page)
    const count = await transportItems(page).count()
    expect(count).toBeGreaterThanOrEqual(14)
    await expect
      .poll(() => header(page))
      .toEqual({
        subtitle: 'Built spec-driven',
        kpi: String(count),
      })
    await expect(page.locator('.build-stat-label')).toHaveText([
      'Change Requests',
      'Tasks',
      'Tests',
      'Commits',
    ])
    for (const value of await page.locator('.build-stat-value').allTextContents()) {
      expect(Number(value)).toBeGreaterThan(0)
    }
    // Newest first, the initial release last
    const first = transportItems(page).first()
    await expect(first.locator('.transport-text')).toHaveText(/^CR-\d+ /)
    const last = transportItems(page).last()
    await expect(last).toHaveAttribute('data-transport', 'DVK900001')
    await expect(last.locator('.transport-text')).toHaveText('Initial release')
    await expect(last.locator('.transport-status')).toHaveText('✓ Imported')
    await expect(card(page).locator('[data-project-id]')).toHaveCount(0)
  })

  test('AC-02.6 the views can be switched with the keyboard', async ({ page }) => {
    await page.goto('/')
    // The focusable element lives in the item's shadow root
    await viewButton(page, 'repositories').locator('li').focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Space')
    await expect(page.getByTestId('build-stats')).toBeVisible()
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('Space')
    await expect(card(page).locator('[data-project-id]').first()).toBeVisible()
  })

  test('AC-02.6 / AC-08.3 the views cross-fade, without animation on reduced motion', async ({
    page,
  }) => {
    // Lowest opacity of the new view, sampled every frame; the click waits for the card entry first
    const opacityRightAfterSwitch = async () => {
      const sampling = page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let lowest = 1
            const end = performance.now() + 2000
            const sample = () => {
              const view = document.querySelector('[data-active-view="transports"]')
              if (view) lowest = Math.min(lowest, Number(getComputedStyle(view).opacity))
              if (performance.now() < end) requestAnimationFrame(sample)
              else resolve(lowest)
            }
            requestAnimationFrame(sample)
          }),
      )
      await viewButton(page, 'transports').click()
      return sampling
    }
    await page.goto('/')
    expect(await opacityRightAfterSwitch()).toBeLessThan(1)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    expect(await opacityRightAfterSwitch()).toBe(1)
  })

  test.describe('desktop (1280 px)', () => {
    test.use({ viewport: { width: 1280, height: 900 } })

    test('AC-02.9 the Transport Log shows the 3 newest with "Show all"', async ({ page }) => {
      await page.goto('/')
      await openTransportLog(page)
      const all = await transportItems(page).count()
      await expect.poll(() => visibleTransports(page)).toHaveLength(3)
      const toggle = page.getByTestId('transports-toggle')
      await expect(toggle).toHaveText(`Show all (${all})`)
      await toggle.click()
      await expect.poll(() => visibleTransports(page)).toHaveLength(all)
      await expect(page.locator('[data-transport="DVK900001"]')).toBeVisible()
    })
  })

  test('AC-02.9 at 390 px all transports are shown without toggle', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await openTransportLog(page)
    await expect(page.getByTestId('transports-toggle')).toHaveCount(0)
    await expect
      .poll(async () => (await visibleTransports(page)).length)
      .toBe(await transportItems(page).count())
  })

  for (const width of [1280, 1440]) {
    test(`AC-01.11 at ${width} × 780 the Transport Log view fits without scrolling`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 780 })
      await page.goto('/')
      await openTransportLog(page)
      await page.waitForTimeout(1500)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
})
