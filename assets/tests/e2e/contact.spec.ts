import { expect, test, type Page } from '@playwright/test'

const items = (page: Page) => page.locator('[data-card-id="contact"] ui5-li')

test.describe('contact card', () => {
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
    // No e-mail on purpose (D-4, T-31)
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
        description: 'linkedin.com/in/dominik-völker-01714422b',
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

  test('AC-05.1 the LinkedIn channel opens the profile in a new tab', async ({ page }) => {
    await page.goto('/')
    const popupPromise = page.waitForEvent('popup')
    await page.locator('[data-channel-id="linkedin"]').click()
    const popup = await popupPromise
    // Only the requested URL matters; LinkedIn itself may redirect to its login page
    expect(decodeURI(popup.url())).toContain('linkedin.com/in/dominik-völker-01714422b')
  })

  test('AC-05.2 there is no contact form', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('form, ui5-input, ui5-textarea, input, textarea')).toHaveCount(0)
  })

  test('AC-01.2 without a GitHub card, GitHub stays reachable via contact card and avatar menu', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('[data-card-id="github"]')).toHaveCount(0)
    await expect(page.locator('[data-card-id="contact"] [data-channel-id="github"]')).toBeVisible()
    await page.getByTestId('shell-avatar').click()
    await expect(page.locator('ui5-user-menu').getByText('Visit GitHub')).toBeVisible()
  })
})
