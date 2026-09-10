import { renderHook, act } from '@testing-library/react'
import { useHashPanel } from './useHashPanel'

describe('useHashPanel', () => {
  beforeEach(() => {
    window.location.hash = ''
  })

  it('starts closed when the address has no panel', () => {
    const { result } = renderHook(() => useHashPanel('work'))
    expect(result.current.openId).toBeNull()
  })

  it('opens the panel named in the address on load', () => {
    window.location.hash = '#work/woodtrick'
    const { result } = renderHook(() => useHashPanel('work'))
    expect(result.current.openId).toBe('woodtrick')
  })

  it('ignores a hash for a different section', () => {
    window.location.hash = '#stack/react'
    const { result } = renderHook(() => useHashPanel('work'))
    expect(result.current.openId).toBeNull()
  })

  it('writes the open project into the address so the link can be shared', () => {
    const { result } = renderHook(() => useHashPanel('work'))
    act(() => result.current.open('contrlve'))
    expect(window.location.hash).toBe('#work/contrlve')
  })

  it('clears the address when closed', () => {
    window.location.hash = '#work/contrlve'
    const { result } = renderHook(() => useHashPanel('work'))
    act(() => result.current.close())
    expect(result.current.openId).toBeNull()
  })
})
