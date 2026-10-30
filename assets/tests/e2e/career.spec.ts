import { expect, test } from '@playwright/test'

type ItemProps = { title: string; subtitle: string }

test.describe('career card', () => {
  test('AC-04.1 timeline shows period, role, company and highlights, newest first', async ({
    page,
  }) => {
    await page.goto('/')
    const items = page.locator('[data-card-id="career"] ui5-timeline-item')
    await expect(items).toHaveCount(2)
    const props = await items.evaluateAll((els) =>
      els.map((el) => {
        const item = el as HTMLElement & { titleText: string; subtitleText: string }
        return { title: item.titleText, subtitle: item.subtitleText } as ItemProps
      }),
    )
    // Placeholder data (D-3), newest station first
    expect(props).toEqual([
      { title: 'Fullstack Developer', subtitle: 'Company A · Jan 2022 – Present' },
      { title: 'SAP Developer', subtitle: 'Company B · Aug 2019 – Dec 2021' },
    ])
    for (const item of await items.all()) {
      await expect(item.locator('.career-highlights li').first()).toBeVisible()
    }
  })
})
