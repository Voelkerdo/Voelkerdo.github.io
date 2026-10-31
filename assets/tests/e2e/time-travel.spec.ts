import { expect, test, type Page } from '@playwright/test'

const openSettings = async (page: Page) => {
  await page.getByTestId('shell-avatar').click()
  await page.locator('ui5-user-menu-item[data-action="settings"]').click()
  await expect(page.getByTestId('settings')).toHaveAttribute('open')
}

/** Records every year the overlay shows, from now on */
const recordYears = (page: Page) =>
  page.evaluate(() => {
    const seen: string[] = []
    ;(window as unknown as { seenYears: string[] }).seenYears = seen
    new MutationObserver(() => {
      const year = document.querySelector('[data-testid="time-travel-year"]')?.textContent
      if (year && seen.at(-1) !== year) seen.push(year)
    }).observe(document.body, { subtree: true, childList: true, characterData: true })
  })

const seenYears = (page: Page) =>
  page.evaluate(() => (window as unknown as { seenYears: string[] }).seenYears)

const overlay = (page: Page) => page.getByTestId('time-travel')

test.describe('time travel', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
  })

  test('AC-11.6 travelling to SAP Classic counts down from 2026 to 1992', async ({ page }) => {
    await page.goto('/')
    await openSettings(page)
    await recordYears(page)
    await page.locator('[data-theme-id="classic"]').click()

    await expect(overlay(page)).toBeVisible()
    await expect(overlay(page)).toContainText('SAP Classic')
    // The theme switches only once the counter has arrived
    await expect(page.getByTestId('time-travel-year')).toHaveText('1992')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'classic')
    await expect(overlay(page)).toBeHidden()

    const years = (await seenYears(page)).map(Number)
    expect(years[0]).toBe(2026)
    expect(years.at(-1)).toBe(1992)
    expect(years.length).toBeGreaterThan(5)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })

  test('AC-11.6 travelling from SAP Classic to Horizon counts up from 1992 to 2022', async ({
    page,
  }) => {
    await page.addInitScript(() => window.localStorage.setItem('theme', 'classic'))
    await page.goto('/')
    await openSettings(page)
    await recordYears(page)
    await page.locator('[data-theme-id="horizon-morning"]').click()

    await expect(page.getByTestId('time-travel-year')).toHaveText('2022')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'horizon-morning')
    await expect(overlay(page)).toBeHidden()

    const years = (await seenYears(page)).map(Number)
    expect(years[0]).toBe(1992)
    expect(years.at(-1)).toBe(2022)
    expect(years.length).toBeGreaterThan(5)
    expect(years).toEqual([...years].sort((a, b) => a - b))
  })

  test('AC-11.6 the overlay lies above the settings dialog', async ({ page }) => {
    await page.goto('/')
    await openSettings(page)
    await page.locator('[data-theme-id="enjoy"]').click()
    await expect(page.getByTestId('time-travel-year')).toBeVisible()
    const topmost = await page.evaluate(() => {
      const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
      return el?.closest('[data-testid="time-travel"]') !== null
    })
    expect(topmost).toBe(true)
  })

  test('AC-11.6 light ↔ dark of the same year switches without overlay', async ({ page }) => {
    await page.goto('/')
    await openSettings(page)
    await recordYears(page)
    await page.locator('[data-theme-id="sunset-coral-dark"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset-coral-dark')
    await expect(overlay(page)).toBeHidden()
    expect(await seenYears(page)).toEqual([])
  })

  test('AC-11.7 with reduced motion the overlay shows the target year without counting', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await page.goto('/')
    await openSettings(page)
    await recordYears(page)
    await page.locator('[data-theme-id="classic"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'classic')
    await expect(overlay(page)).toBeHidden()
    expect(await seenYears(page)).toEqual(['1992'])
  })

  test('AC-11.8 screen readers hear where the journey goes', async ({ page }) => {
    await page.goto('/')
    await openSettings(page)
    await page.locator('[data-theme-id="classic"]').click()
    await expect(overlay(page).getByRole('status')).toHaveText('Travelling to 1992 – SAP Classic')
  })
})
