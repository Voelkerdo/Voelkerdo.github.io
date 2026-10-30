import { expect, test } from '@playwright/test'

test('TD-2 smoke: start page loads without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')
  await expect(page.getByText('Dominik Völker')).toBeVisible()
  expect(errors).toEqual([])
})
