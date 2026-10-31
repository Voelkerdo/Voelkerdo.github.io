import { expect, test, type Page } from '@playwright/test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CONTENT_SECURITY_POLICY } from '../../vite.config.ts'

// Runs against the production build served by `vite preview` (TD-18)
const DIST = 'node_modules/.security-dist'

/** Collects CSP violations from the start of the page */
const watchViolations = (page: Page) =>
  page.addInitScript(() => {
    const violations: string[] = []
    ;(window as unknown as { violations: string[] }).violations = violations
    document.addEventListener('securitypolicyviolation', (event) =>
      violations.push(`${event.effectiveDirective} ${event.blockedURI}`),
    )
  })

/** A visit through the page: settings, theme time travel, notifications, about */
async function tour(page: Page) {
  await page.goto('/')
  await expect(page.locator('.bento-cell')).toHaveCount(5)
  await page.getByTestId('shell-avatar').click()
  await page.locator('ui5-user-menu-item[data-action="settings"]').click()
  for (const theme of ['classic', 'quartz-dark', 'sunset-coral-auto']) {
    await page.locator(`[data-theme-id="${theme}"]`).click()
    await expect(page.locator('html')).toHaveAttribute(
      'data-theme',
      theme === 'sunset-coral-auto' ? /^sunset-coral/ : theme,
    )
  }
  await page.keyboard.press('Escape')
  await page.locator('.page-dot[data-page="transports"]').click()
  await page.evaluate(() => document.fonts.ready)
}

test.describe('security (production build)', () => {
  test('AC-13.1 a visit sends no request to another host', async ({ page, baseURL }) => {
    const ownHost = new URL(baseURL!).host
    const foreign = new Set<string>()
    page.on('request', (request) => {
      const url = new URL(request.url())
      if (url.protocol.startsWith('http') && url.host !== ownHost) foreign.add(url.host)
    })
    await tour(page)
    expect([...foreign]).toEqual([])
  })

  test('AC-13.2 the build has the CSP meta tag and the site runs without violations', async ({
    page,
  }) => {
    await watchViolations(page)
    await tour(page)
    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute(
      'content',
      CONTENT_SECURITY_POLICY,
    )
    expect(
      await page.evaluate(() => (window as unknown as { violations: string[] }).violations),
    ).toEqual([])
  })

  test('AC-13.3 the build sets the referrer policy', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[name="referrer"]')).toHaveAttribute(
      'content',
      'strict-origin-when-cross-origin',
    )
  })

  test('AC-13.4 values from storage, query and hash are never executed', async ({ page }) => {
    const payload = '"><img src=x onerror="window.pwned=true"><script>window.pwned=true</script>'
    await page.addInitScript((value) => {
      window.localStorage.setItem('theme', value)
      window.localStorage.setItem('theme-mode', value)
    }, payload)
    await page.goto(`/?q=${encodeURIComponent(payload)}#${encodeURIComponent(payload)}`)
    await expect(page.locator('.bento-cell')).toHaveCount(5)
    expect(
      await page.evaluate(() => (window as unknown as { pwned?: boolean }).pwned),
    ).toBeUndefined()
    await expect(page.locator('img[src="x"]')).toHaveCount(0)
    await expect(page.locator('html')).toHaveAttribute('data-theme', /^sunset-coral/)
  })

  test('AC-13.5 new tabs cannot reach back to the site', async ({ page }) => {
    await page.goto('/')
    // Links rendered by UI5 carry noopener and noreferrer
    const rels = await page
      .locator('ui5-link[target="_blank"]')
      .evaluateAll((links) =>
        links.map((l) => l.shadowRoot?.querySelector('a')?.getAttribute('rel')),
      )
    expect(rels.length).toBeGreaterThan(0)
    for (const rel of rels) expect(rel).toMatch(/noopener/)
    // Buttons that open a tab via window.open
    const popupPromise = page.waitForEvent('popup')
    await page.locator('[data-channel-id="github"]').click()
    const popup = await popupPromise
    expect(await popup.evaluate(() => window.opener).catch(() => null)).toBeNull()
  })

  test('AC-13.7 the build contains no source maps and no secrets', () => {
    const files = readdirSync(DIST, { recursive: true, encoding: 'utf8' })
    expect(files.filter((file) => file.endsWith('.map'))).toEqual([])
    const secrets =
      /(AKIA[0-9A-Z]{16}|ghp_[0-9A-Za-z]{36}|github_pat_\w{20,}|-----BEGIN [A-Z ]*PRIVATE KEY|sk-[A-Za-z0-9]{32,}|xox[baprs]-[0-9A-Za-z-]+)/
    for (const file of files.filter((f) => /\.(js|html|css|json)$/.test(f))) {
      expect(readFileSync(join(DIST, file), 'utf8'), file).not.toMatch(secrets)
    }
  })
})
