import { expect, test, type Page } from '@playwright/test'

// Recreated SAP themes on top of SAP Quartz Light (AC-11.5, tech spec §7)
const ERAS = [
  { id: 'belize', font: '"72"', brand: '#427cac', background: '#eff4f9' },
  { id: 'blue-crystal', font: 'Arial', brand: '#009de0', background: '#f7f7f7' },
  { id: 'corbu', font: 'Arial', brand: '#346187', background: '#f2f2f2' },
  { id: 'signature', font: 'Arial', brand: '#f0ab00', background: '#dce8f4' },
  { id: 'enjoy', font: 'Tahoma', brand: '#3a6ea5', background: '#e8e4d8' },
  { id: 'classic', font: 'Tahoma', brand: '#000080', background: '#d4d0c8' },
]

const openWithTheme = async (page: Page, id: string) => {
  await page.addInitScript((theme) => window.localStorage.setItem('theme', theme), id)
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', id)
  await expect(page.locator('html')).toHaveAttribute('data-sap-theme', 'sap_fiori_3')
}

const cssVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name)

/** WCAG contrast ratio of two CSS variables, resolved by the browser */
const contrast = (page: Page, foreground: string, background: string) =>
  page.evaluate(
    ([fg, bg]) => {
      const probe = document.createElement('div')
      document.body.append(probe)
      const luminance = (color: string) => {
        probe.style.color = color
        const [r, g, b] = getComputedStyle(probe)
          .color.match(/[\d.]+/g)!
          .slice(0, 3)
          .map((c) => {
            const v = Number(c) / 255
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
          })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const [l1, l2] = [luminance(`var(${fg})`), luminance(`var(${bg})`)].sort((a, b) => b - a)
      probe.remove()
      return (l1 + 0.05) / (l2 + 0.05)
    },
    [foreground, background],
  )

test.describe('recreated SAP themes', () => {
  for (const era of ERAS) {
    test(`AC-11.5 ${era.id} sets its brand and background colors and font`, async ({ page }) => {
      await openWithTheme(page, era.id)
      expect(await cssVar(page, '--sapBrandColor')).toBe(era.brand)
      expect(await cssVar(page, '--sapBackgroundColor')).toBe(era.background)
      const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily)
      expect(fontFamily.startsWith(era.font)).toBe(true)
    })

    test(`AC-11.5 ${era.id} keeps text readable (WCAG AA)`, async ({ page }) => {
      await openWithTheme(page, era.id)
      const pairs: [string, string][] = [
        ['--sapTextColor', '--sapBackgroundColor'],
        ['--sapTextColor', '--sapTile_Background'],
        ['--sapContent_LabelColor', '--sapTile_Background'],
        ['--sapLinkColor', '--sapTile_Background'],
        ['--accent-1', '--sapTile_Background'],
        ['--sapShell_TextColor', '--sapShellColor'],
      ]
      for (const [fg, bg] of pairs) {
        expect(await contrast(page, fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5)
      }
    })
  }

  test('AC-11.5 / AC-08.1 recreated themes fit 360 px without horizontal scrolling', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    for (const era of ERAS) {
      await openWithTheme(page, era.id)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, era.id).toBeLessThanOrEqual(0)
    }
  })
})
