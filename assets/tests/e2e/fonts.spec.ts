import { expect, test } from '@playwright/test'

test.describe('self-hosted font', () => {
  test('AC-13.1 the SAP font "72" comes from this site, not from a CDN', async ({ page }) => {
    const fontHosts = new Set<string>()
    page.on('request', (request) => {
      if (request.resourceType() === 'font') fontHosts.add(new URL(request.url()).host)
    })
    await page.goto('/')
    await expect.poll(() => page.evaluate(() => document.fonts.check('16px "72"'))).toBe(true)
    await page.evaluate(() => document.fonts.ready)
    expect([...fontHosts]).toEqual([new URL(page.url()).host])
    const loaded = await page.evaluate(() =>
      [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
    )
    expect(loaded).toContain('72')
  })
})
