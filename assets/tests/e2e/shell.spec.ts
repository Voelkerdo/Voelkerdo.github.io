import { expect, test } from '@playwright/test'

const appTitle = (page: import('@playwright/test').Page) => page.getByTestId('app-title')

test.describe('launchpad shell', () => {
  test('AC-06.2 header shows branding, "Home" title and avatar; no back button on home', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByText('Dominik Völker').first()).toBeVisible()
    await expect(appTitle(page)).toHaveText('Home')
    await expect(page.getByTestId('shell-avatar')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Back' })).toHaveCount(0)
  })

  test('AC-06.3 direct link opens the app with its title', async ({ page }) => {
    await page.goto('/#/skills')
    await expect(appTitle(page)).toHaveText('Skills')
    await expect(page.getByRole('heading', { name: 'Skills' })).toBeVisible()
  })

  test('AC-06.3 unknown routes redirect to the launchpad', async ({ page }) => {
    await page.goto('/#/does-not-exist')
    await expect(page).toHaveURL(/#\/$/)
    await expect(appTitle(page)).toHaveText('Home')
  })

  test('AC-06.7 back button returns to the launchpad, even after a direct link', async ({
    page,
  }) => {
    await page.goto('/#/career')
    await page.getByRole('button', { name: 'Back' }).click()
    await expect(page).toHaveURL(/#\/$/)
    await expect(appTitle(page)).toHaveText('Home')
  })

  test('AC-06.7 clicking the branding returns to the launchpad', async ({ page }) => {
    await page.goto('/#/projects')
    await page.locator('ui5-shellbar-branding').click()
    await expect(appTitle(page)).toHaveText('Home')
  })

  test('AC-06.3 browser back works between launchpad and app', async ({ page }) => {
    await page.goto('/')
    await page.goto('/#/contact')
    await expect(appTitle(page)).toHaveText('Contact')
    await page.goBack()
    await expect(appTitle(page)).toHaveText('Home')
  })

  test('AC-06.9 / AC-07.4 avatar menu opens About with the built-with hint', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('shell-avatar').click()
    await page.locator('ui5-user-menu-item[data-action="about"]').click()
    const dialog = page.locator('ui5-dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Built with React & SAP UI5 Web Components')
    await expect(dialog.locator('ui5-link')).toHaveAttribute(
      'href',
      'https://github.com/Voelkerdo/portfolio-website',
    )
  })

  test('AC-09.1 theme toggle in the avatar menu switches the mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.getByTestId('shell-avatar').click()
    await page.locator('ui5-user-menu-item[data-action="toggle-theme"]').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})
