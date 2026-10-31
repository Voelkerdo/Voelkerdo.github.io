import { expect, test, type Page } from '@playwright/test'

type ItemProps = { title: string; subtitle: string }

const items = (page: Page) => page.locator('[data-card-id="career"] ui5-timeline-item')
const station = (page: Page, id: string) => page.locator(`[data-station-id="${id}"]`)
const toggle = (page: Page) => page.getByTestId('career-toggle')
const CURRENT = 'meyer-werft-application-expert'
const OLDER = ['meyer-werft-application-professional', 'meyer-werft-apprenticeship']
const highlights = (page: Page, id: string) => station(page, id).locator('.career-highlights')

/** Whether the station lies within the clipped stations container */
const shown = (page: Page, id: string) =>
  station(page, id).evaluate((el) => {
    const container = el.closest('.career-stations')!.getBoundingClientRect()
    return el.getBoundingClientRect().top < container.bottom - 1
  })

test.describe('career card', () => {
  test('AC-04.1 timeline shows period, role, company and highlights, newest first', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(items(page)).toHaveCount(3)
    const props = await items(page).evaluateAll((els) =>
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
    await toggle(page).click()
    for (const item of await items(page).all()) {
      await expect(item.locator('.career-highlights li').first()).toBeVisible()
    }
  })

  test.describe('desktop (1280 px)', () => {
    test.use({ viewport: { width: 1280, height: 900 } })

    test('AC-04.3 initially only role, company and period of the current station are shown', async ({
      page,
    }) => {
      await page.goto('/')
      await expect(toggle(page)).toHaveText('Show all (3)')
      expect(await shown(page, CURRENT)).toBe(true)
      await expect(station(page, CURRENT)).not.toHaveAttribute('inert')
      await expect(station(page, CURRENT)).toHaveAttribute(
        'title-text',
        'Application Expert SAP Development and SAP Authorizations',
      )
      await expect(highlights(page, CURRENT)).toBeHidden()
      for (const id of OLDER) {
        await expect.poll(() => shown(page, id)).toBe(false)
        await expect(station(page, id)).toHaveAttribute('inert')
      }
    })

    test('AC-04.3 "Show all" expands, "Show less" collapses again', async ({ page }) => {
      await page.goto('/')
      await toggle(page).click()
      await expect(toggle(page)).toHaveText('Show less')
      await expect(highlights(page, CURRENT)).toBeVisible()
      for (const id of OLDER) {
        await expect.poll(() => shown(page, id)).toBe(true)
        await expect(station(page, id)).not.toHaveAttribute('inert')
      }
      // The last highlight of the oldest station is not cut off
      await expect
        .poll(() =>
          page.locator('.career-stations').evaluate((el) => el.scrollHeight - el.clientHeight),
        )
        .toBeLessThanOrEqual(1)
      await toggle(page).click()
      await expect(toggle(page)).toHaveText('Show all (3)')
      for (const id of OLDER) await expect.poll(() => shown(page, id)).toBe(false)
      await expect(highlights(page, CURRENT)).toBeHidden()
    })

    test('AC-04.3 the toggle works with the keyboard and reports aria-expanded', async ({
      page,
    }) => {
      await page.goto('/')
      const button = toggle(page).locator('button')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await toggle(page).focus()
      await page.keyboard.press('Enter')
      await expect(button).toHaveAttribute('aria-expanded', 'true')
      await expect.poll(() => shown(page, OLDER[1])).toBe(true)
      await page.keyboard.press('Space')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    test('AC-04.3 / AC-08.3 the stations animate open, without transition on reduced motion', async ({
      page,
    }) => {
      const containerTransition = () =>
        page.locator('.career-stations').evaluate((el) => getComputedStyle(el).transitionDuration)
      await page.goto('/')
      await toggle(page).click()
      expect(await containerTransition()).toBe('0.3s')

      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.reload()
      await toggle(page).click()
      expect(await containerTransition()).toBe('0s')
      await expect.poll(() => shown(page, OLDER[1])).toBe(true)
      await toggle(page).click()
      await expect(highlights(page, CURRENT)).toBeHidden()
    })
  })

  for (const width of [800, 390]) {
    test(`AC-04.3 at ${width} px all stations are shown without toggle`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expect(items(page)).toHaveCount(3)
      await expect(toggle(page)).toHaveCount(0)
      for (const id of OLDER) {
        await expect(station(page, id)).not.toHaveAttribute('inert')
        expect(await shown(page, id)).toBe(true)
      }
      await expect(highlights(page, CURRENT)).toBeVisible()
    })
  }
})
