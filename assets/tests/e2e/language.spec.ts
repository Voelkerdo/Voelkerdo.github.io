import { expect, test } from '@playwright/test'

test.describe('language', () => {
  test.use({ locale: 'de-DE' })

  test('TD-21 UI5 texts stay English in a German browser', async ({ page }) => {
    const germanBundles: string[] = []
    page.on('request', (request) => {
      if (/messagebundle_de/.test(request.url())) germanBundles.push(request.url())
    })
    await page.goto('/')
    await page.getByTestId('shell-avatar').click()
    await page.locator('ui5-user-menu-item[data-action="settings"]').click()
    await expect(page.getByTestId('settings')).toHaveAttribute('open')
    // Built-in footer button of the UI5 settings dialog
    await expect(page.getByTestId('settings').getByRole('button', { name: 'Close' })).toBeVisible()
    expect(germanBundles).toEqual([])
  })
})
