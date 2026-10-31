import { expect, test } from '@playwright/test'

test.describe('fiori shell', () => {
  test('AC-06.2 header shows branding, "Overview" title and avatar; no back button', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('ui5-shellbar-branding')).toContainText('Dominik Völker')
    await expect(page.getByTestId('page-title')).toHaveText('Overview')
    await expect(page.getByTestId('shell-avatar')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Back' })).toHaveCount(0)
  })

  test('AC-06.11 clicking the branding scrolls to the top', async ({ page }) => {
    await page.goto('/')
    // Make the page scrollable independent of its content
    await page.evaluate(() => {
      document.body.style.minHeight = '3000px'
      window.scrollTo(0, 1500)
    })
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    await page.locator('ui5-shellbar-branding').click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('AC-06.9 / AC-07.4 avatar menu opens About with the built-with hint', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('shell-avatar').click()
    await page.locator('ui5-user-menu-item[data-action="about"]').click()
    const dialog = page.locator('ui5-dialog[header-text="About this site"]')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Built with React & SAP UI5 Web Components')
    await expect(dialog.locator('ui5-link')).toHaveAttribute(
      'href',
      'https://github.com/Voelkerdo/Voelkerdo.github.io',
    )
  })

  test('AC-06.10 avatar menu offers "Visit GitHub" instead of "Sign Out"', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('shell-avatar').click()
    const menu = page.locator('ui5-user-menu')
    await expect(menu.getByText('Sign Out')).toHaveCount(0)
    const popupPromise = page.waitForEvent('popup')
    await menu.getByText('Visit GitHub').click()
    const popup = await popupPromise
    expect(popup.url()).toContain('github.com/Voelkerdo')
  })

  test('AC-06.9 avatar menu offers Settings and About, but no theme toggle', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('shell-avatar').click()
    const items = page.locator('ui5-user-menu-item')
    await expect(items).toHaveCount(2)
    await expect(items.nth(0)).toHaveAttribute('text', 'Settings')
    await expect(items.nth(1)).toHaveAttribute('text', 'About')
  })
})
