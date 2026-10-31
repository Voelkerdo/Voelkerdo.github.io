import { expect, test, type Page } from '@playwright/test'

const openSettings = async (page: Page) => {
  await page.getByTestId('shell-avatar').click()
  await page.locator('ui5-user-menu-item[data-action="settings"]').click()
  await expect(page.getByTestId('settings')).toHaveAttribute('open')
}

const item = (page: Page, id: string) => page.locator(`[data-theme-id="${id}"]`)

test.describe('settings › appearance', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
  })

  test('AC-11.1 Settings opens the Fiori settings dialog with Appearance', async ({ page }) => {
    await page.goto('/')
    await openSettings(page)
    const appearance = page.locator('ui5-user-settings-item')
    await expect(appearance).toHaveAttribute('text', 'Appearance')
    await expect(page.locator('ui5-user-settings-appearance-view')).toBeVisible()
  })

  test('AC-11.2 / AC-11.3 lists the themes with their year, the default selected', async ({
    page,
  }) => {
    await page.goto('/')
    await openSettings(page)
    const groups = page.locator('ui5-user-settings-appearance-view-group')
    await expect(groups).toHaveCount(2)
    await expect(groups.nth(0)).toHaveAttribute('header-text', 'Today')
    await expect(groups.nth(1)).toHaveAttribute('header-text', 'SAP Fiori')
    await expect(item(page, 'quartz-light')).toHaveAttribute('text', 'SAP Quartz Light · 2019')
    await expect(item(page, 'sunset-coral-auto')).toHaveAttribute('selected')
    await expect(item(page, 'quartz-light')).not.toHaveAttribute('selected')
  })

  test('AC-11.4 a click applies the theme right away and it survives a reload', async ({
    page,
  }) => {
    await page.goto('/')
    await openSettings(page)
    await item(page, 'quartz-dark').click()
    const html = page.locator('html')
    await expect(html).toHaveAttribute('data-theme', 'quartz-dark')
    await expect(item(page, 'quartz-dark')).toHaveAttribute('selected')
    await expect(page.getByTestId('settings')).toHaveAttribute('open')

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'quartz-dark')
    // Plain SAP Quartz Dark, without the Sunset Coral accent
    await expect
      .poll(() =>
        page.evaluate(() =>
          getComputedStyle(document.documentElement).getPropertyValue('--sapBrandColor').trim(),
        ),
      )
      .toBe('#91c8f6')
  })

  test('AC-09.1 / AC-11.3 choosing the light variant overrides a dark system', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset-coral-dark')
    await openSettings(page)
    await item(page, 'sunset-coral-light').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sunset-coral-light')
  })

  test('AC-11.8 the theme list can be operated with the keyboard', async ({ page }) => {
    await page.goto('/')
    await openSettings(page)
    // Tab leads from the dialog into the theme list ("Today" header); group headers are list
    // stops too: Auto, Light, Dark, "SAP Fiori", Morning Horizon
    await page.keyboard.press('Tab')
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Space')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'horizon-morning')
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('settings')).not.toHaveAttribute('open')
  })

  test('AC-11.1 opens full screen on narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await openSettings(page)
    const box = await page.locator('ui5-user-settings-dialog').evaluate((el) => {
      const dialog = el.shadowRoot!.querySelector('[ui5-dialog]')!
      const r = dialog.shadowRoot!.querySelector('.ui5-popup-root')!.getBoundingClientRect()
      return { width: r.width, height: r.height }
    })
    expect(box.width).toBeGreaterThanOrEqual(388)
    expect(box.height).toBeGreaterThanOrEqual(840)
  })
})
