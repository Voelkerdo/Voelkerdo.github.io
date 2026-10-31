import { expect, test } from '@playwright/test'

type ItemProps = { title: string; subtitle: string }

test.describe('career card', () => {
  test('AC-04.1 timeline shows period, role, company and highlights, newest first', async ({
    page,
  }) => {
    await page.goto('/')
    const items = page.locator('[data-card-id="career"] ui5-timeline-item')
    await expect(items).toHaveCount(3)
    const props = await items.evaluateAll((els) =>
      els.map((el) => {
        const item = el as HTMLElement & { titleText: string; subtitleText: string }
        return { title: item.titleText, subtitle: item.subtitleText } as ItemProps
      }),
    )
    // Newest station first (D-3, T-31)
    expect(props).toEqual([
      {
        title: 'Application Expert SAP Development and SAP Authorizations',
        subtitle: 'MEYER WERFT GmbH · Jul 2025 – Present',
      },
      { title: 'Application Professional', subtitle: 'MEYER WERFT GmbH · Aug 2019 – Jun 2025' },
      {
        title: 'IT Specialist for Application Development (apprenticeship)',
        subtitle: 'MEYER WERFT GmbH · Aug 2016 – Jul 2019',
      },
    ])
    for (const item of await items.all()) {
      await expect(item.locator('.career-highlights li').first()).toBeVisible()
    }
  })
})
