import { expect, test } from '@playwright/test'

// Expected content from specs/00-intent.md (AC-03.2)
const expectedGroups = [
  { id: 'backend', title: 'Backend', skills: ['ABAP', 'Node.js'] },
  { id: 'frontend', title: 'Frontend', skills: ['SAP UI5', 'JavaScript', 'HTML5'] },
  {
    id: 'frameworks',
    title: 'Frameworks',
    skills: [
      'SAP UI5',
      'ABAP RAP',
      'ABAP Programming Model for Fiori',
      'SAP OData (SEGW)',
      'SAP Adobe Forms',
    ],
  },
  { id: 'sap', title: 'Further SAP Experience', skills: ['User & Authorization Management'] },
]

test.describe('skills card', () => {
  test('AC-03.1 skill groups are shown in the specified order', async ({ page }) => {
    await page.goto('/')
    const groups = page.locator('[data-card-id="skills"] [data-skill-group]')
    await expect(groups).toHaveCount(4)
    const ids = await groups.evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-skill-group')),
    )
    expect(ids).toEqual(expectedGroups.map((g) => g.id))
  })

  test('AC-03.2 every skill from the intent is visible in its group', async ({ page }) => {
    await page.goto('/')
    for (const group of expectedGroups) {
      const section = page.locator(`[data-skill-group="${group.id}"]`)
      await expect(section.locator('.skill-group-title')).toHaveText(group.title)
      // Light DOM text only; UI5 adds a hidden "Tag" label for screen readers
      const skills = await section
        .locator('ui5-tag')
        .evaluateAll((els) => els.map((el) => el.textContent))
      expect(skills).toEqual(group.skills)
      for (const tag of await section.locator('ui5-tag').all()) await expect(tag).toBeVisible()
    }
  })
})
