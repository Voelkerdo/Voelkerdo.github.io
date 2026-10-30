import { expect, test, type Page } from '@playwright/test'

const card = (page: Page, id: string) => page.locator(`[data-card-id="${id}"]`)
const box = async (page: Page, id: string) => (await card(page, id).boundingBox())!

const headerProps = (page: Page, id: string) =>
  card(page, id)
    .locator('ui5-card-header')
    .evaluate((el) => {
      const header = el as HTMLElement & { titleText: string; additionalText?: string }
      return { title: header.titleText, kpi: header.additionalText }
    })

// Waits until the entry animation of all cards has finished
const waitForCards = (page: Page) =>
  expect
    .poll(() =>
      page
        .locator('.bento-cell')
        .evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === '1')),
    )
    .toBe(true)

test.describe('overview page', () => {
  test('AC-01.7 there is no content outside of cards', async ({ page }) => {
    await page.goto('/')
    const outside = await page.locator('main').evaluate((main) => {
      // Every text node in <main> must belong to a card
      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT)
      const texts: string[] = []
      while (walker.nextNode()) {
        const node = walker.currentNode
        if (node.textContent?.trim() && !node.parentElement?.closest('.bento-cell')) {
          texts.push(node.textContent.trim())
        }
      }
      return texts
    })
    expect(outside).toEqual([])
    await expect(page.locator('.hero, [data-testid="hero-cta"]')).toHaveCount(0)
  })

  test('AC-01.8 profile card shows avatar, name and positioning', async ({ page }) => {
    await page.goto('/')
    const about = card(page, 'about')
    expect((await headerProps(page, 'about')).title).toBe('About me')
    await expect(about.locator('ui5-avatar')).toBeVisible()
    await expect(about.getByRole('heading', { level: 1, name: 'Dominik Völker' })).toBeVisible()
    await expect(about.getByText('Fullstack Developer – from ABAP to UI5')).toBeVisible()
  })

  test('AC-01.2 / AC-01.3 cards with title and KPI in the header', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.bento-cell')).toHaveCount(6)
    expect(await headerProps(page, 'projects')).toEqual({ title: 'Projects', kpi: '3' })
    expect(await headerProps(page, 'skills')).toEqual({ title: 'Skills', kpi: '7' })
    expect((await headerProps(page, 'career')).title).toBe('Career')
    expect(await headerProps(page, 'contact')).toEqual({ title: 'Contact', kpi: '3' })
    expect(await headerProps(page, 'github')).toEqual({ title: 'GitHub', kpi: undefined })
  })

  test('AC-01.4 cards fade in and end fully visible', async ({ page }) => {
    await page.goto('/')
    await waitForCards(page)
  })

  test('AC-01.6 / AC-07.2 desktop bento layout with different card sizes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    await waitForCards(page)
    const [about, projects, career, contact, github, skills] = await Promise.all(
      ['about', 'projects', 'career', 'contact', 'github', 'skills'].map((id) => box(page, id)),
    )
    const near = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThanOrEqual(2)
    const bottom = (b: { y: number; height: number }) => b.y + b.height
    const right = (b: { x: number; width: number }) => b.x + b.width
    // Row 1: about (wide) | career (tall) | contact (small)
    near(about.y, career.y)
    near(about.y, contact.y)
    expect(about.width).toBeGreaterThan(contact.width * 1.8)
    expect(career.x).toBeGreaterThan(right(about) - 1)
    expect(contact.x).toBeGreaterThan(right(career) - 1)
    // Row 2: projects (large) starts below about; career spans down to the bottom of github
    near(projects.x, about.x)
    near(projects.width, about.width)
    expect(projects.y).toBeGreaterThan(bottom(about) - 1)
    near(github.x, contact.x)
    near(github.y, projects.y)
    near(bottom(career), bottom(github))
    // Row 3: skills (wide) sits below career/github, next to projects, which spans rows 2 and 3
    expect(skills.y).toBeGreaterThan(bottom(github) - 1)
    near(skills.x, career.x)
    near(right(skills), right(contact))
    near(bottom(projects), bottom(skills))
  })

  for (const { width, padding } of [
    { width: 375, padding: 16 },
    { width: 800, padding: 32 },
    { width: 1280, padding: 32 },
    { width: 1600, padding: 48 },
  ]) {
    test(`AC-01.9 Fiori spacing at ${width}px: ${padding}px page padding, 16px card gap`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await waitForCards(page)
      const grid = (await page.locator('.bento-grid').boundingBox())!
      const shellBottom = (await page.locator('ui5-shellbar').boundingBox())!
      expect(Math.round(grid.x)).toBe(padding)
      expect(Math.round(width - (grid.x + grid.width))).toBe(padding)
      expect(Math.round(grid.y - (shellBottom.y + shellBottom.height))).toBe(16)
      const gap = await page
        .locator('.bento-grid')
        .evaluate((el) => [getComputedStyle(el).rowGap, getComputedStyle(el).columnGap])
      expect(gap).toEqual(['16px', '16px'])
    })
  }

  test('AC-07.3 hovering a card lifts it and adds the glow', async ({ page }) => {
    await page.goto('/')
    await waitForCards(page)
    const inner = card(page, 'projects').locator('.bento-card')
    await inner.hover()
    await expect(inner).toHaveAttribute('data-active', 'true')
    await expect.poll(() => inner.evaluate((el) => getComputedStyle(el).transform)).not.toBe('none')
    await page.mouse.move(0, 0)
    await expect(inner).toHaveAttribute('data-active', 'false')
  })

  test('AC-06.5 keyboard focus inside a card activates it', async ({ page }) => {
    await page.goto('/')
    await waitForCards(page)
    const githubHeaderFocused = () =>
      card(page, 'github')
        .locator('ui5-card-header')
        .evaluate((el) => document.activeElement === el)
    // Tab through the page like a keyboard user until the interactive GitHub card is reached
    for (let i = 0; i < 30 && !(await githubHeaderFocused()); i++) {
      await page.keyboard.press('Tab')
    }
    expect(await githubHeaderFocused()).toBe(true)
    await expect(card(page, 'github').locator('.bento-card')).toHaveAttribute('data-active', 'true')
  })

  test('AC-08.3 with reduced motion cards only fade and do not move on hover', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await waitForCards(page)
    const inner = card(page, 'projects').locator('.bento-card')
    await inner.hover()
    await expect(inner).toHaveAttribute('data-active', 'true')
    // Give a potential animation time to run, then make sure nothing moved
    await page.waitForTimeout(400)
    const transform = await inner.evaluate((el) => getComputedStyle(el).transform)
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform)
  })
})
