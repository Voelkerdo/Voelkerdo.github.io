import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const setTheme = vi.fn()
vi.mock('@ui5/webcomponents-base/dist/config/Theme.js', () => ({
  setTheme: (theme: string) => setTheme(theme),
}))

const { ThemeModeProvider } = await import('../../src/shell/ThemeModeProvider.tsx')
const { STORAGE_KEY, useThemeMode } = await import('../../src/shell/useThemeMode.ts')

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
  const { mode, toggleMode } = useThemeMode()
  return <button onClick={toggleMode}>mode:{mode}</button>
}

const renderProbe = () =>
  render(
    <ThemeModeProvider>
      <Probe />
    </ThemeModeProvider>,
  )

describe('theme mode', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setTheme.mockClear()
    mockSystem(false)
  })
  afterEach(() => vi.restoreAllMocks())

  it('AC-09.1 follows the system theme initially', () => {
    mockSystem(true)
    renderProbe()
    expect(screen.getByRole('button')).toHaveTextContent('mode:dark')
    expect(setTheme).toHaveBeenLastCalledWith('sap_horizon_dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('AC-09.1 follows system changes while no mode was chosen manually', () => {
    renderProbe()
    changeSystem(true)
    expect(screen.getByRole('button')).toHaveTextContent('mode:dark')
  })

  it('AC-09.1 manual toggle switches the UI5 theme and is remembered', async () => {
    renderProbe()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('mode:dark')
    expect(setTheme).toHaveBeenLastCalledWith('sap_horizon_dark')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })

  it('AC-09.1 manual choice wins over the system theme', () => {
    window.localStorage.setItem(STORAGE_KEY, 'light')
    mockSystem(true)
    renderProbe()
    expect(screen.getByRole('button')).toHaveTextContent('mode:light')
    changeSystem(true)
    expect(screen.getByRole('button')).toHaveTextContent('mode:light')
  })

  it('AC-09.1 unavailable storage does not break the toggle', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    renderProbe()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toHaveTextContent('mode:dark')
  })
})
