import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const setTheme = vi.fn()
vi.mock('@ui5/webcomponents-base/dist/config/Theme.js', () => ({
  setTheme: (theme: string) => setTheme(theme),
}))

const { ThemeModeProvider } = await import('../../src/shell/ThemeModeProvider.tsx')
const { LEGACY_STORAGE_KEY, STORAGE_KEY, useThemeMode } =
  await import('../../src/shell/useThemeMode.ts')

type Listener = (event: MediaQueryListEvent) => void
let systemDark = false
let listeners: Listener[] = []

function mockSystem(dark: boolean) {
  systemDark = dark
  listeners = []
  window.matchMedia = ((query: string) => ({
    matches: systemDark,
    media: query,
    addEventListener: (_: string, l: Listener) => listeners.push(l),
    removeEventListener: (_: string, l: Listener) => (listeners = listeners.filter((x) => x !== l)),
  })) as unknown as typeof window.matchMedia
}

function changeSystem(dark: boolean) {
  systemDark = dark
  act(() => listeners.forEach((l) => l({ matches: dark } as MediaQueryListEvent)))
}

function Probe() {
  const { theme, selectTheme, travel, arrive, endTravel } = useThemeMode()
  return (
    <>
      <output>theme:{theme}</output>
      <p data-testid="travel">
        {travel ? `${travel.fromYear}→${travel.toYear} ${travel.toName}` : 'none'}
      </p>
      <button onClick={() => selectTheme('quartz-dark')}>Quartz Dark</button>
      <button onClick={() => selectTheme('classic')}>Classic</button>
      <button onClick={() => selectTheme('sunset-coral-dark')}>Sunset Coral Dark</button>
      <button onClick={arrive}>arrive</button>
      <button onClick={endTravel}>end</button>
    </>
  )
}

const renderProbe = () =>
  render(
    <ThemeModeProvider>
      <Probe />
    </ThemeModeProvider>,
  )

const dataTheme = () => document.documentElement.dataset.theme

describe('theme choice', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setTheme.mockClear()
    mockSystem(false)
  })
  afterEach(() => vi.restoreAllMocks())

  it('AC-11.3 / AC-09.1 default "Auto" follows the system theme initially', () => {
    mockSystem(true)
    renderProbe()
    expect(screen.getByRole('status')).toHaveTextContent('theme:sunset-coral-auto')
    expect(setTheme).toHaveBeenLastCalledWith('sap_horizon_dark')
    expect(dataTheme()).toBe('sunset-coral-dark')
  })

  it('AC-09.1 "Auto" follows system changes', () => {
    renderProbe()
    expect(dataTheme()).toBe('sunset-coral-light')
    changeSystem(true)
    expect(dataTheme()).toBe('sunset-coral-dark')
    expect(setTheme).toHaveBeenLastCalledWith('sap_horizon_dark')
  })

  it('AC-11.6 a theme of another year starts a time travel and switches on arrival', async () => {
    renderProbe()
    await userEvent.click(screen.getByRole('button', { name: 'Quartz Dark' }))
    expect(screen.getByTestId('travel')).toHaveTextContent('2026→2019 SAP Quartz Dark')
    expect(dataTheme()).toBe('sunset-coral-light')
    await userEvent.click(screen.getByRole('button', { name: 'arrive' }))
    expect(screen.getByRole('status')).toHaveTextContent('theme:quartz-dark')
    expect(setTheme).toHaveBeenLastCalledWith('sap_fiori_3_dark')
    expect(dataTheme()).toBe('quartz-dark')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('quartz-dark')
    await userEvent.click(screen.getByRole('button', { name: 'end' }))
    expect(screen.getByTestId('travel')).toHaveTextContent('none')
  })

  it('AC-11.6 a selection made while travelling becomes the destination', async () => {
    renderProbe()
    await userEvent.click(screen.getByRole('button', { name: 'Quartz Dark' }))
    await userEvent.click(screen.getByRole('button', { name: 'Classic' }))
    await userEvent.click(screen.getByRole('button', { name: 'arrive' }))
    expect(dataTheme()).toBe('classic')
  })

  it('AC-11.6 the same year switches without a time travel', async () => {
    renderProbe()
    await userEvent.click(screen.getByRole('button', { name: 'Sunset Coral Dark' }))
    expect(screen.getByTestId('travel')).toHaveTextContent('none')
    expect(dataTheme()).toBe('sunset-coral-dark')
  })

  it('AC-11.4 the stored theme is restored and wins over the system theme', () => {
    window.localStorage.setItem(STORAGE_KEY, 'sunset-coral-light')
    mockSystem(true)
    renderProbe()
    expect(dataTheme()).toBe('sunset-coral-light')
    changeSystem(true)
    expect(dataTheme()).toBe('sunset-coral-light')
  })

  it('AC-11.4 an unknown stored theme falls back to the default', () => {
    window.localStorage.setItem(STORAGE_KEY, 'sap_tron')
    renderProbe()
    expect(screen.getByRole('status')).toHaveTextContent('theme:sunset-coral-auto')
  })

  it('AC-11.4 the mode stored before CR-8 is taken over once', () => {
    window.localStorage.setItem(LEGACY_STORAGE_KEY, 'dark')
    renderProbe()
    expect(dataTheme()).toBe('sunset-coral-dark')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('sunset-coral-dark')
    expect(window.localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull()
  })

  it('AC-11.4 unavailable storage does not break the selection', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    renderProbe()
    await userEvent.click(screen.getByRole('button', { name: 'Sunset Coral Dark' }))
    expect(dataTheme()).toBe('sunset-coral-dark')
  })
})
