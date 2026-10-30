import { expect, test, type Page } from '@playwright/test'

const items = (page: Page) => page.locator('[data-card-id="contact"] ui5-li')

test.describe('contact and GitHub cards', () => {
  test('AC-05.1 contact card lists the channels with GitHub first and highlighted', async ({
    page,
  }) => {
    await page.goto('/')
    const props = await items(page).evaluateAll((els) =>
      els.map((el) => {
        const item = el as HTMLElement & {
          text: string
          description: string
          additionalText?: string
        }
        return {
          id: el.getAttribute('data-channel-id'),
          text: item.text,
          description: item.description,
          primary: el.classList.contains('contact-primary'),
          badge: item.additionalText ?? null,
        }
      }),
    )
    // LinkedIn and e-mail are placeholders (D-4)
    expect(props).toEqual([
      {
        id: 'github',
        text: 'GitHub',
        description: 'github.com/Voelkerdo',
        primary: true,
        badge: 'Follow me',
      },
      {
        id: 'linkedin',
        text: 'LinkedIn',
        description: 'linkedin.com',
        primary: false,
        badge: null,
      },
      {
        id: 'email',
        text: 'E-Mail',
        description: 'hello@example.com',
        primary: false,
        badge: null,
      },
    ])
  })

  test('AC-05.1 the GitHub channel opens the profile in a new tab', async ({ page }) => {
    await page.goto('/')
    const popupPromise = page.waitForEvent('popup')
    await page.locator('[data-channel-id="github"]').click()
    expect((await popupPromise).url()).toContain('github.com/Voelkerdo')
  })

  test('AC-05.2 there is no contact form', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('form, ui5-input, ui5-textarea, input, textarea')).toHaveCount(0)
  })

  test('AC-01.2 the GitHub card invites to follow and opens the profile', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('[data-card-id="github"]')
    await expect(card.getByText('Explore my repositories')).toBeVisible()
    const popupPromise = page.waitForEvent('popup')
    await card.getByTestId('github-follow').click()
    expect((await popupPromise).url()).toContain('github.com/Voelkerdo')
  })
})
