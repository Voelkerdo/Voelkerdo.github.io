import { expect, test, type Page } from '@playwright/test'

// Columns of the bento grid per breakpoint (tech spec §6)
const viewports = [
  { width: 360, columns: 1 },
  { width: 800, columns: 2 },
  { width: 1280, columns: 4 },
]

// Elements wider than the viewport, including inside UI5 shadow roots
const overflowingElements = (page: Page) =>
  page.evaluate(() => {
    const limit = document.documentElement.clientWidth
    const found: string[] = []
    const visit = (root: Document | ShadowRoot) => {
      for (const el of root.querySelectorAll('*')) {
        const box = el.getBoundingClientRect()
        if (box.width > 0 && Math.round(box.right) > limit) {
          found.push(`${el.tagName.toLowerCase()}.${el.className}`.slice(0, 80))
        }
        if (el.shadowRoot) visit(el.shadowRoot)
      }
    }
    visit(document)
    return found
  })

test.describe('responsive layout', () => {
  for (const { width, columns } of viewports) {
    test(`AC-08.1 / AC-01.6 at ${width}px: ${columns} column(s), no horizontal scrolling`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const grid = page.locator('.bento-grid')
      await expect
        .poll(() =>
          grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length),
        )
        .toBe(columns)
      // Expand everything that can grow before measuring
      await page.getByTestId('skills-toggle').click()
      await expect(page.locator('[data-card-id="skills"] .skill-name:visible')).toHaveCount(7)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
      expect(await overflowingElements(page)).toEqual([])
    })
  }
})
