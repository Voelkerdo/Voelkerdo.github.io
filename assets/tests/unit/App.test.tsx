import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.tsx'

describe('App', () => {
  it('TD-2 smoke: renders the app', () => {
    render(<App />)
    expect(screen.getAllByText('Dominik Völker').length).toBeGreaterThan(0)
  })
})
