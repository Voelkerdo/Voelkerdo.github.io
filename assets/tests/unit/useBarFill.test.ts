import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useBarFill } from '../../src/motion/useBarFill.ts'

describe('useBarFill', () => {
  afterEach(() => vi.useRealTimers())

  it('AC-03.6 bars stay empty until started, then fill on the next frame', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
    const { result, rerender } = renderHook(({ start }) => useBarFill(false, start), {
      initialProps: { start: false },
    })
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toBe(false)
    rerender({ start: true })
    expect(result.current).toBe(false)
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toBe(true)
  })

  it('AC-03.6 / AC-08.3 with reduced motion bars are filled immediately', () => {
    const { result } = renderHook(() => useBarFill(true, false))
    expect(result.current).toBe(true)
  })
})
