import { shouldReveal } from './reveal'

const VH = 800

describe('shouldReveal', () => {
  it('never reveals when the visitor asked for reduced motion', () => {
    expect(shouldReveal({ top: 2000 }, VH, true)).toBe(false)
  })

  it('leaves an element already on screen alone', () => {
    expect(shouldReveal({ top: 200 }, VH, false)).toBe(false)
  })

  it('leaves an element exactly at the fold alone', () => {
    expect(shouldReveal({ top: VH }, VH, false)).toBe(false)
  })

  it('reveals an element below the fold', () => {
    expect(shouldReveal({ top: VH + 1 }, VH, false)).toBe(true)
  })

  it('leaves an element scrolled above the viewport alone', () => {
    expect(shouldReveal({ top: -400 }, VH, false)).toBe(false)
  })
})
