import { SECTIONS, sectionNumber } from './sections'

describe('sectionNumber', () => {
  it('counts the sections in the order the page lists them', () => {
    expect(sectionNumber('about')).toBe('01')
    expect(sectionNumber('experience')).toBe('02')
    expect(sectionNumber('contact')).toBe('05')
  })

  it('pads to two digits so the marks line up down the page', () => {
    expect(sectionNumber('about')).toHaveLength(2)
  })

  it('leaves the hero out of the count', () => {
    expect(sectionNumber('top')).toBeNull()
  })

  it('has nothing to say about a section that is not on the page', () => {
    expect(sectionNumber('nowhere')).toBeNull()
  })

  it('gives each section on the page its own number', () => {
    const numbers = SECTIONS.map((section) => sectionNumber(section.id)).filter(Boolean)

    expect(new Set(numbers).size).toBe(numbers.length)
    expect(numbers.length).toBe(SECTIONS.length - 1)
  })
})
