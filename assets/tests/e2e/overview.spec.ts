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
  test('AC-01.1 hero shows name, tagline and a GitHub CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1, name: 'Dominik Völker' })).toBeVisible()
    await expect(
      page.locator('.hero').getByText('Fullstack Developer – from ABAP to UI5'),
    ).toBeVisible()
    const popupPromise = page.waitForEvent('popup')
    await page.getByTestId('hero-cta').click()
    expect((await popupPromise).url()).toContain('github.com/Voelkerdo')
  })

  test('AC-01.2 / AC-01.3 five cards with title and KPI in the header', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.bento-cell')).toHaveCount(5)
    expect(await headerProps(page, 'projects')).toEqual({ title: 'Projects', kpi: '3' })
    expect(await headerProps(page, 'skills')).toEqual({ title: 'Skills', kpi: '10' })
    expect((await headerProps(page, 'career')).title).toBe('Career')
    expect(await headerProps(page, 'contact')).toEqual({ title: 'Contact', kpi: '3' })
    expect((await headerProps(page, 'github')).title).toBe('GitHub')
  })

  test('AC-01.4 cards fade in and end fully visible', async ({ page }) => {
    await page.goto('/')
    await waitForCards(page)
  })

  test('AC-01.6 / AC-07.2 desktop bento layout with different card sizes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    await waitForCards(page)
    const [projects, career, contact, github, skills] = await Promise.all(
      ['projects', 'career', 'contact', 'github', 'skills'].map((id) => box(page, id)),
    )
    // large: two columns and two rows
    expect(projects.width).toBeGreaterThan(career.width * 1.8)
    expect(projects.height).toBeGreaterThan(contact.height * 1.8)
    // tall: one column, two rows
    expect(career.height).toBeGreaterThan(contact.height * 1.8)
    // small: contact and github share one column
    expect(Math.round(contact.x)).toBe(Math.round(github.x))
    // wide: skills spans the full row below
    expect(skills.width).toBeGreaterThan(projects.width * 1.8)
    expect(skills.y).toBeGreaterThan(projects.y + projects.height - 1)
  })

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
