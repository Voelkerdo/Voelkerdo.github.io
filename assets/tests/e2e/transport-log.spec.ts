import { expect, test, type Page } from '@playwright/test'

const card = (page: Page) => page.locator('[data-card-id="projects"]')
const dot = (page: Page, view: string) => page.locator(`.page-dot[data-page="${view}"]`)
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
  await dot(page, 'transports').click()
  await expect(page.getByTestId('build-stats')).toBeVisible()
}

test.describe('projects card views', () => {
  test('AC-02.10 "Repositories" is the default page with the project KPI', async ({ page }) => {
    await page.goto('/')
    await expect(dot(page, 'repositories')).toHaveAttribute('aria-current', 'true')
    await expect(dot(page, 'transports')).not.toHaveAttribute('aria-current')
    await expect(dot(page, 'transports')).toHaveAttribute('aria-label', 'Transport Log')
    await expect(card(page).locator('[data-project-id]').first()).toBeVisible()
    await expect.poll(() => header(page)).toEqual({ subtitle: 'Selected repositories', kpi: '5' })
  })

  test('AC-02.10 / AC-02.7 / AC-02.8 the Transport Log shows stats and transports', async ({
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
    await expect(last.locator('.transport-status')).toHaveText('Imported')
    // A UI5 icon instead of "✓", which would load the large "72full" font (AC-08.2)
    await expect(last.locator('.transport-status ui5-icon[name="accept"]')).toHaveCount(1)
    // The repositories page is faded out and hidden
    await expect(card(page).locator('[data-project-id]').first()).toBeHidden()
  })

  test('AC-02.10 the page dots work with the keyboard', async ({ page }) => {
    await page.goto('/')
    await dot(page, 'transports').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('build-stats')).toBeVisible()
    await expect(dot(page, 'transports')).toHaveAttribute('aria-current', 'true')
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Space')
    await expect(card(page).locator('[data-project-id]').first()).toBeVisible()
  })

  test('AC-02.10 / AC-08.3 the pages cross-fade, without animation on reduced motion', async ({
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
              // Only once the page is active; before that it is hidden at opacity 0
              const view = document.querySelector(
                '[data-page-view="transports"][data-active="true"]',
              )
              if (view) lowest = Math.min(lowest, Number(getComputedStyle(view).opacity))
              if (performance.now() < end) requestAnimationFrame(sample)
              else resolve(lowest)
            }
            requestAnimationFrame(sample)
          }),
      )
      await dot(page, 'transports').click()
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

  test('AC-02.9 at 390 px the 3 newest transports are shown with "Show all"', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await openTransportLog(page)
    const all = await transportItems(page).count()
    await expect(page.getByTestId('transports-toggle')).toHaveText(`Show all (${all})`)
    await expect.poll(() => visibleTransports(page)).toHaveLength(3)
  })

  for (const width of [390, 1280]) {
    test(`AC-02.12 at ${width} px both pages have the same height`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const cardHeight = () =>
        card(page).evaluate((el) => Math.round(el.getBoundingClientRect().height))
      await page.mouse.move(0, 0)
      await expect.poll(cardHeight).toBeGreaterThan(200)
      const before = await cardHeight()
      await dot(page, 'transports').click()
      await page.mouse.move(0, 0)
      await expect(page.getByTestId('build-stats')).toBeVisible()
      expect(await cardHeight()).toBe(before)
      await dot(page, 'repositories').click()
      await page.mouse.move(0, 0)
      expect(await cardHeight()).toBe(before)
    })
  }

  test('AC-02.12 the pages cross-fade: both are partly visible during the change', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(dot(page, 'repositories')).toHaveAttribute('aria-current', 'true')
    // Frames in which the old and the new page are both partly visible
    const sampling = page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let both = 0
          const end = performance.now() + 2000
          const opacity = (view: string) =>
            Number(getComputedStyle(document.querySelector(`[data-page-view="${view}"]`)!).opacity)
          const sample = () => {
            const [a, b] = [opacity('repositories'), opacity('transports')]
            if (a > 0.05 && a < 0.95 && b > 0.05 && b < 0.95) both++
            if (performance.now() < end) requestAnimationFrame(sample)
            else resolve(both)
          }
          requestAnimationFrame(sample)
        }),
    )
    await dot(page, 'transports').click()
    expect(await sampling).toBeGreaterThan(0)
    await expect(card(page).locator('[data-page-view="repositories"]')).toHaveAttribute('inert')
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

  test('AC-02.10 arrows page back and forth and are disabled at the ends', async ({ page }) => {
    const prev = page.getByTestId('page-prev')
    const next = page.getByTestId('page-next')
    await page.goto('/')
    await expect(prev).toHaveAttribute('accessible-name', 'Previous page')
    await expect(next).toHaveAttribute('accessible-name', 'Next page')
    await expect(prev).toHaveAttribute('disabled')
    await expect(next).not.toHaveAttribute('disabled')

    await next.click()
    await expect(page.getByTestId('build-stats')).toBeVisible()
    await expect(dot(page, 'transports')).toHaveAttribute('aria-current', 'true')
    await expect(next).toHaveAttribute('disabled')
    await expect(prev).not.toHaveAttribute('disabled')

    await prev.click()
    await expect(card(page).locator('[data-project-id]').first()).toBeVisible()
    await expect(prev).toHaveAttribute('disabled')
  })

  test('AC-02.10 with the keyboard the focus moves to the other arrow at the end', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByTestId('page-next').focus()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('build-stats')).toBeVisible()
    // The disabled › handed the focus to ‹
    await expect(page.getByTestId('page-prev')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(card(page).locator('[data-project-id]').first()).toBeVisible()
    await expect(page.getByTestId('page-next')).toBeFocused()
  })

  test.describe('automatic page change', () => {
    const activePage = (page: Page) =>
      card(page).locator('[data-active-view]').getAttribute('data-active-view')
    const ready = async (page: Page) => {
      // Paused clock: only runFor() moves time, so a busy machine cannot change the page early
      await page.clock.install({ time: new Date('2026-10-31T12:00:00') })
      await page.clock.pauseAt(new Date('2026-10-31T12:00:01'))
      await page.goto('/')
      // UI5 schedules its (re-)rendering with timers: let it render and the cards enter
      await page.clock.runFor(1_000)
      await expect(dot(page, 'repositories')).toHaveAttribute('aria-current', 'true')
      await expect(card(page).locator('[data-project-id]').first()).toBeVisible()
      // A short hover restarts the 8 seconds (AC-02.11), so every test starts from here
      await card(page).hover()
      await page.mouse.move(0, 0)
    }

    test('AC-02.11 the card turns the page every 8 seconds', async ({ page }) => {
      await ready(page)
      await page.clock.runFor(7_000)
      expect(await activePage(page)).toBe('repositories')
      await page.clock.runFor(1_500)
      await expect.poll(() => activePage(page)).toBe('transports')
      await expect(dot(page, 'transports')).toHaveAttribute('aria-current', 'true')
      await page.clock.runFor(8_500)
      await expect.poll(() => activePage(page)).toBe('repositories')
    })

    test('AC-02.11 hovering pauses, afterwards the 8 seconds start again', async ({ page }) => {
      await ready(page)
      await card(page).hover()
      await page.clock.runFor(20_000)
      expect(await activePage(page)).toBe('repositories')
      await page.mouse.move(0, 0)
      await page.clock.runFor(7_000)
      expect(await activePage(page)).toBe('repositories')
      await page.clock.runFor(1_500)
      await expect.poll(() => activePage(page)).toBe('transports')
    })

    test('AC-02.11 keyboard focus in the card pauses', async ({ page }) => {
      await ready(page)
      await dot(page, 'repositories').focus()
      await page.clock.runFor(20_000)
      expect(await activePage(page)).toBe('repositories')
    })

    test('AC-02.11 choosing a page stops the rotation', async ({ page }) => {
      await ready(page)
      await dot(page, 'transports').click()
      await page.mouse.move(0, 0)
      // Clicking focuses the dot; move the focus out of the card
      await page.locator('body').click({ position: { x: 5, y: 5 } })
      await page.clock.runFor(30_000)
      expect(await activePage(page)).toBe('transports')
    })

    test('AC-02.11 an arrow click stops the rotation', async ({ page }) => {
      await ready(page)
      await page.getByTestId('page-next').click()
      await page.locator('body').click({ position: { x: 5, y: 5 } })
      await page.clock.runFor(30_000)
      expect(await activePage(page)).toBe('transports')
    })

    test('AC-02.11 "Show all" stops the rotation', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 })
      await ready(page)
      await page.getByTestId('projects-toggle').click()
      await page.locator('body').click({ position: { x: 5, y: 5 } })
      await page.clock.runFor(30_000)
      expect(await activePage(page)).toBe('repositories')
    })

    test('AC-02.11 / AC-08.3 no automatic change with reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await ready(page)
      await page.clock.runFor(30_000)
      expect(await activePage(page)).toBe('repositories')
    })
  })
})
