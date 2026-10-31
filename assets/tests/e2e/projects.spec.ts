import { expect, test, type Page } from '@playwright/test'

// Expected content mirrors src/data/projects.ts (curated list, D-1)
const projects = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    repoUrl: 'https://github.com/Voelkerdo/Voelkerdo.github.io',
    technologies: ['React', 'TypeScript', 'SAP UI5 Web Components', 'Motion'],
  },
  {
    id: 'abap-programming-model-fiori',
    name: 'ABAP Programming Model for SAP Fiori',
    technologies: ['ABAP', 'CDS', 'SAP Fiori'],
  },
  {
    id: 'simple-odata-service',
    name: 'Simple OData Service',
    technologies: ['ABAP', 'OData', 'SEGW'],
  },
  { id: 'quote-api', name: 'Quote API', technologies: ['Node.js', 'Express', 'JavaScript'] },
  { id: 'message-mixer', name: 'Message Mixer', technologies: ['Node.js', 'JavaScript'] },
]

test.describe('projects card', () => {
  test('AC-02.1 lists every project with name, description and technologies', async ({ page }) => {
    await page.goto('/')
    const items = page.locator('[data-card-id="projects"] [data-project-id]')
    await expect(items).toHaveCount(projects.length)
    for (const project of projects) {
      const item = page.locator(`[data-project-id="${project.id}"]`)
      await expect(item.locator('.project-name')).toHaveText(project.name)
      await expect(item.locator('.project-description')).not.toBeEmpty()
      // Compare the light DOM text only; UI5 adds a hidden "Tag" label for screen readers
      const tags = await item
        .locator('ui5-tag')
        .evaluateAll((els) => els.map((el) => el.textContent))
      expect(tags).toEqual(project.technologies)
    }
  })

  test('AC-02.2 project links open the repository in a new tab', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('[data-project-id="portfolio-website"] ui5-link')
    await expect(link).toHaveAttribute('href', projects[0].repoUrl!)
    await expect(link).toHaveAttribute('target', '_blank')
    // The rendered anchor inside the UI5 link carries the safe rel attribute
    const anchor = link.locator('a')
    await expect(anchor).toHaveAttribute('target', '_blank')
    await expect(anchor).toHaveAttribute('rel', /noopener/)
    const popupPromise = page.waitForEvent('popup')
    await link.click()
    expect((await popupPromise).url()).toContain('github.com/Voelkerdo/Voelkerdo.github.io')
  })

  test.describe('desktop (1280 px)', () => {
    test.use({ viewport: { width: 1280, height: 900 } })

    const toggle = (page: Page) => page.getByTestId('projects-toggle')
    const visibleIds = (page: Page) =>
      page
        .locator('[data-card-id="projects"] [data-project-id]')
        .evaluateAll((els) =>
          els
            .filter((el) => el.checkVisibility({ visibilityProperty: true }))
            .map((el) => el.getAttribute('data-project-id')),
        )

    test('AC-02.5 initially the first 3 projects are shown, the others are inert', async ({
      page,
    }) => {
      await page.goto('/')
      await expect(toggle(page)).toHaveText('Show all (5)')
      await expect.poll(() => visibleIds(page)).toEqual(projects.slice(0, 3).map((p) => p.id))
      await expect(page.locator('#projects-more')).toHaveAttribute('inert')
    })

    test('AC-02.5 "Show all" expands, "Show less" collapses again', async ({ page }) => {
      await page.goto('/')
      await toggle(page).click()
      await expect(toggle(page)).toHaveText('Show less')
      await expect.poll(() => visibleIds(page)).toEqual(projects.map((p) => p.id))
      await expect(page.locator('#projects-more')).not.toHaveAttribute('inert')
      await toggle(page).click()
      await expect.poll(() => visibleIds(page)).toHaveLength(3)
    })

    test('AC-02.5 the toggle works with the keyboard and reports aria-expanded', async ({
      page,
    }) => {
      await page.goto('/')
      const button = toggle(page).locator('button')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await toggle(page).focus()
      await page.keyboard.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await page.keyboard.press('Space')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    test('AC-02.5 / AC-08.3 the list animates open, without transition on reduced motion', async ({
      page,
    }) => {
      const duration = () =>
        page.locator('#projects-more').evaluate((el) => getComputedStyle(el).transitionDuration)
      await page.goto('/')
      expect(await duration()).toBe('0.3s')
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.reload()
      expect(await duration()).toBe('0s')
    })
  })

  for (const width of [800, 390]) {
    test(`AC-02.5 at ${width} px the first 3 projects are shown with "Show all"`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expect(page.getByTestId('projects-toggle')).toHaveText('Show all (5)')
      for (const [index, project] of projects.entries()) {
        const item = page.locator(`[data-project-id="${project.id}"]`)
        if (index < 3) await expect(item).toBeVisible()
        else await expect(item).toBeHidden()
      }
    })
  }

  for (const width of [1280, 1440]) {
    test(`AC-01.11 at ${width} × 780 the overview page fits without vertical scrolling`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 780 })
      await page.goto('/')
      // Wait until every card has entered
      await expect(page.locator('.bento-cell')).toHaveCount(5)
      await page.waitForTimeout(1500)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
})
