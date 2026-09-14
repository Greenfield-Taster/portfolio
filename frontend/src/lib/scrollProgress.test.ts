import { computeScrollProgress } from './scrollProgress'

const viewportHeight = 1000

describe('computeScrollProgress', () => {
  it('reports nothing while the element is still below the middle of the screen', () => {
    expect(computeScrollProgress({ top: 900, height: 2000, viewportHeight })).toBe(0)
  })

  it('starts counting the moment the top reaches the middle', () => {
    expect(computeScrollProgress({ top: 500, height: 2000, viewportHeight })).toBe(0)
    expect(computeScrollProgress({ top: 499, height: 2000, viewportHeight })).toBeGreaterThan(0)
  })

  it('is half done when half the element has passed the middle', () => {
    expect(computeScrollProgress({ top: -500, height: 2000, viewportHeight })).toBe(0.5)
  })

  it('is finished once the bottom has risen past the middle', () => {
    expect(computeScrollProgress({ top: -1500, height: 2000, viewportHeight })).toBe(1)
  })

  it('stays within its bounds however far past the element the reader scrolls', () => {
    expect(computeScrollProgress({ top: -9000, height: 2000, viewportHeight })).toBe(1)
    expect(computeScrollProgress({ top: 9000, height: 2000, viewportHeight })).toBe(0)
  })

  it('reports nothing for an element with no height, rather than NaN', () => {
    // A section can measure zero before layout settles; dividing by that
    // would put NaN into a transform and drop the line off the page.
    expect(computeScrollProgress({ top: 0, height: 0, viewportHeight })).toBe(0)
  })

  describe('with the anchor lower on the screen', () => {
    // The timeline anchors at 80% of the viewport: the drawn line's tip sits
    // near the bottom of the screen, so a card is lit as it comes into view
    // rather than only once the reader has scrolled it halfway up.
    const anchor = 0.8

    it('starts counting when the top reaches the anchor, not the middle', () => {
      expect(computeScrollProgress({ top: 800, height: 2000, viewportHeight, anchor })).toBe(0)
      expect(computeScrollProgress({ top: 799, height: 2000, viewportHeight, anchor })).toBeGreaterThan(0)
    })

    it('is half done when half the element has passed the anchor', () => {
      expect(computeScrollProgress({ top: -200, height: 2000, viewportHeight, anchor })).toBe(0.5)
    })

    it('is finished once the bottom has risen past the anchor', () => {
      expect(computeScrollProgress({ top: -1200, height: 2000, viewportHeight, anchor })).toBe(1)
    })
  })
})
