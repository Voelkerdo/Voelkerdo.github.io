import { devices, expect, test, type Page } from '@playwright/test'

const bell = (page: Page) => page.locator('ui5-shellbar ui5-button[icon="bell"]').first()
const badge = (page: Page) =>
  page
    .locator('ui5-shellbar')
    .evaluate(
      (el) => (el as HTMLElement & { notificationsCount?: string }).notificationsCount ?? '',
    )
const items = (page: Page) => page.locator('ui5-li-notification')
// The list items are always in the DOM; the popover's open state tells whether it is shown
const isOpen = (page: Page) =>
  page.getByTestId('notifications').evaluate((el) => (el as HTMLElement & { open: boolean }).open)

test.describe('notifications', () => {
  test('AC-10.1 the bell shows a badge with 3 unread notifications', async ({ page }) => {
    await page.goto('/')
    await expect(bell(page)).toBeVisible()
    expect(await badge(page)).toBe('3')
  })

  test('AC-10.2 the bell opens a Fiori notification list with three entries', async ({ page }) => {
    await page.goto('/')
    await bell(page).click()
    await expect.poll(() => isOpen(page)).toBe(true)
    await expect(items(page)).toHaveCount(3)
    const props = await items(page).evaluateAll((els) =>
      els.map((el) => ({
        title: (el as HTMLElement & { titleText: string }).titleText,
        text: el.textContent?.trim().replace(/\s+/g, ' '),
      })),
    )
    expect(props.map((p) => p.title)).toEqual([
      'Transport imported',
      'Quality gate passed',
      'New follower request',
    ])
    expect(props[0].text).toContain('Transport DVK900001 "Portfolio Website" was imported')
    expect(props[0].text).toContain('Just now')
    expect(props[2].text).toContain("You're not following Voelkerdo on GitHub yet. Fix that?")
  })

  test('AC-10.3 opening the list clears the badge, closing marks the items read', async ({
    page,
  }) => {
    await page.goto('/')
    await bell(page).click()
    await expect.poll(() => isOpen(page)).toBe(true)
    expect(await badge(page)).toBe('')
    const readState = () =>
      items(page).evaluateAll((els) =>
        els.map((el) => (el as HTMLElement & { read: boolean }).read),
      )
    expect(new Set(await readState())).toEqual(new Set([false]))
    await page.keyboard.press('Escape')
    await expect.poll(() => isOpen(page)).toBe(false)
    expect(new Set(await readState())).toEqual(new Set([true]))
  })

  test('AC-10.4 the follower request opens the GitHub profile', async ({ page }) => {
    await page.goto('/')
    await bell(page).click()
    await expect.poll(() => isOpen(page)).toBe(true)
    const popupPromise = page.waitForEvent('popup')
    await page.locator('[data-notification-id="follower"]').click()
    expect((await popupPromise).url()).toContain('github.com/Voelkerdo')
  })

  test('AC-10.5 the bell works with the keyboard', async ({ page }) => {
    await page.goto('/')
    await bell(page).focus()
    await page.keyboard.press('Enter')
    await expect.poll(() => isOpen(page)).toBe(true)
    await page.keyboard.press('Escape')
    await expect.poll(() => isOpen(page)).toBe(false)
  })

  test.describe('on phones', () => {
    // Full iPhone profile (UI5 detects phones by user agent and screen), keeping the project's engine
    const { defaultBrowserType: _engine, ...iPhone } = devices['iPhone 13']
    test.use(iPhone)

    test('AC-10.5 the list opens as a full-screen dialog', async ({ page }) => {
      await page.goto('/')
      await bell(page).tap()
      // On phones the responsive popover renders a dialog inside its shadow root
      const size = () =>
        page.evaluate(() => {
          const dialog = document
            .querySelector('ui5-responsive-popover')
            ?.shadowRoot?.querySelector('ui5-dialog') as (HTMLElement & { open: boolean }) | null
          if (!dialog?.open) return null
          const box = dialog.getBoundingClientRect()
          return { width: box.width, height: box.height }
        })
      await expect.poll(size).toEqual({ width: 390, height: 664 })
    })
  })
})
