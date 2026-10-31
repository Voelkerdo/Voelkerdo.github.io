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
    const categories = page.locator('ui5-user-settings-item')
    await expect(categories).toHaveCount(2)
    await expect(categories.nth(0)).toHaveAttribute('text', 'Appearance')
    await expect(categories.nth(1)).toHaveAttribute('text', 'System')
    await expect(page.locator('ui5-user-settings-appearance-view')).toBeVisible()
  })

  test('AC-11.2 / AC-11.3 lists the themes with their year, the default selected', async ({
    page,
  }) => {
    await page.goto('/')
    await openSettings(page)
    const groups = page.locator('ui5-user-settings-appearance-view-group')
    await expect(groups).toHaveCount(3)
    await expect(groups.nth(0)).toHaveAttribute('header-text', 'Today')
    await expect(groups.nth(1)).toHaveAttribute('header-text', 'SAP Fiori')
    await expect(groups.nth(2)).toHaveAttribute('header-text', 'SAP GUI')
    await expect(item(page, 'classic')).toHaveAttribute('text', 'SAP Classic · 1992')
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

  test.describe('system', () => {
    const openSystem = async (page: Page) => {
      await openSettings(page)
      await page.getByTestId('settings').getByRole('listitem', { name: 'System' }).click()
      await expect(page.getByTestId('system-info')).toBeVisible()
    }
    const entry = (page: Page, label: string) => page.locator(`[data-system-entry="${label}"]`)

    test('AC-12.1 / AC-12.2 System shows tech stack, hosting, build and theme', async ({
      page,
    }) => {
      await page.goto('/')
      await openSystem(page)
      const groups = page.locator('[data-system-group]')
      await expect(groups).toHaveCount(4)
      expect(
        await groups.evaluateAll((els) =>
          els.map((el) => el.getAttribute('headerText') ?? el.getAttribute('header-text')),
        ),
      ).toEqual(['Tech Stack', 'Hosting', 'Build', 'Theme'])
      await expect(entry(page, 'React')).toHaveAttribute('additional-text', /^\d+\.\d+\.\d+/)
      await expect(entry(page, 'SAP UI5 Web Components')).toHaveAttribute('additional-text', /^2\./)
      await expect(entry(page, 'Provider')).toHaveAttribute('additional-text', 'GitHub Pages')
      await expect(entry(page, 'Build date')).toHaveAttribute(
        'additional-text',
        /^\d{4}-\d{2}-\d{2}$/,
      )
      await expect(entry(page, 'Active theme')).toHaveAttribute(
        'additional-text',
        'Sunset Coral Light · sap_horizon',
      )
    })

    test('AC-12.2 the theme entry follows the theme choice', async ({ page }) => {
      await page.addInitScript(() => window.localStorage.setItem('theme', 'classic'))
      await page.goto('/')
      await openSystem(page)
      await expect(entry(page, 'Active theme')).toHaveAttribute(
        'additional-text',
        'SAP Classic · sap_fiori_3 (recreated)',
      )
    })

    test('AC-12.3 System can be reached with the keyboard', async ({ page }) => {
      await page.goto('/')
      await openSettings(page)
      // Focus starts in the category list: move to System and open it
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      await expect(page.getByTestId('system-info')).toBeVisible()
    })

    test('AC-12.3 on narrow screens System is listed among the categories first', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto('/')
      await openSettings(page)
      await expect(page.getByTestId('system-info')).toBeHidden()
      await expect(page.locator('ui5-user-settings-item[text="System"]')).toHaveCount(1)
    })
  })
})
