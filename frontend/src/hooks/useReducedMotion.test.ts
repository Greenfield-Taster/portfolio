import { renderHook } from '@testing-library/react'
import { useReducedMotion } from './useReducedMotion'

function mockReduced(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('reduced-motion') ? matches : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

describe('useReducedMotion', () => {
  it('is true when the visitor asked to reduce motion', () => {
    mockReduced(true)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(true)
  })

  it('is false otherwise', () => {
    mockReduced(false)
    expect(renderHook(() => useReducedMotion()).result.current).toBe(false)
  })
})
