import { expect, test } from '@playwright/test'

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
})
