import { pickActiveSection } from './activeSection'

const sections = [
  { id: 'about', top: 0 },
  { id: 'experience', top: 900 },
  { id: 'work', top: 1800 },
]

describe('pickActiveSection', () => {
  it('marks the first section while every section still sits below the probe', () => {
    const below = sections.map((s) => ({ ...s, top: s.top + 400 }))

    expect(pickActiveSection({ sections: below, probeY: 240, atBottom: false })).toBe('about')
  })

  it('marks the last section whose top has crossed the probe', () => {
    const scrolled = sections.map((s) => ({ ...s, top: s.top - 1000 }))

    expect(pickActiveSection({ sections: scrolled, probeY: 240, atBottom: false })).toBe(
      'experience'
    )
  })

  it('marks the last section once the page is scrolled to the bottom', () => {
    const nearEnd = [
      { id: 'about', top: -2000 },
      { id: 'experience', top: -1100 },
      { id: 'work', top: 600 },
    ]

    expect(pickActiveSection({ sections: nearEnd, probeY: 240, atBottom: true })).toBe('work')
  })

  it('reports no active section when there are no sections', () => {
    expect(pickActiveSection({ sections: [], probeY: 240, atBottom: false })).toBeNull()
  })
})
