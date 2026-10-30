import { expect, test, type Page } from '@playwright/test'

const cssVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name)

test.describe('theme', () => {
  test('AC-07.1 / AC-09.2 light mode uses the Sunset Coral accent', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(await cssVar(page, '--accent-1')).toBe('#e11d48')
    expect(await cssVar(page, '--sapBrandColor')).toBe('#e11d48')
  })

  test('AC-07.1 / AC-09.2 dark mode uses the Sunset Coral accent', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    expect(await cssVar(page, '--accent-1')).toBe('#fb7185')
    expect(await cssVar(page, '--sapBrandColor')).toBe('#fb7185')
  })

  test('AC-09.1 the page follows the system color scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    await page.emulateMedia({ colorScheme: 'light' })
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .not.toBe(darkBg)
  })
})
