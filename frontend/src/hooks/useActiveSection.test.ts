import { renderHook, act } from '@testing-library/react'
import { useActiveSection } from './useActiveSection'

const IDS = ['about', 'experience', 'work'] as const

/** Puts real elements in the document and pins where they sit in the viewport. */
function placeSections(tops: Record<string, number>) {
  for (const [id, top] of Object.entries(tops)) {
    const el = document.createElement('section')
    el.id = id
    el.getBoundingClientRect = () => ({ top }) as DOMRect
    document.body.append(el)
  }
}

function movePage(tops: Record<string, number>) {
  for (const [id, top] of Object.entries(tops)) {
    const el = document.getElementById(id)!
    el.getBoundingClientRect = () => ({ top }) as DOMRect
  }
}

beforeEach(() => {
  document.body.innerHTML = ''
  // jsdom reports a zero-height document, which would read as "scrolled to the
  // bottom" on every test. Give the page a real height instead.
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 5000,
    configurable: true,
  })
  window.scrollY = 0
})

describe('useActiveSection', () => {
  it('reports the first section while the page sits at the top', () => {
    placeSections({ about: 400, experience: 1300, work: 2200 })

    const { result } = renderHook(() => useActiveSection(IDS))

    expect(result.current).toBe('about')
  })

  it('follows the page as it scrolls past a section', () => {
    placeSections({ about: 400, experience: 1300, work: 2200 })
    const { result } = renderHook(() => useActiveSection(IDS))

    act(() => {
      movePage({ about: -1000, experience: -100, work: 800 })
      window.dispatchEvent(new Event('scroll'))
    })

    expect(result.current).toBe('experience')
  })

  it('ignores ids that are not on the page', () => {
    placeSections({ about: 400 })

    const { result } = renderHook(() => useActiveSection(IDS))

    expect(result.current).toBe('about')
  })
})
