import { render, screen } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('marks the head with the section place in the page order', () => {
    render(<Section id="experience" eyebrow="Experience" title="Where I have worked" />)

    // The number is what tells a reader scrolling past that a new section has
    // started, so it comes from the page order rather than from a prop a call
    // site could get wrong.
    expect(screen.getByText('02', { selector: '.section__number' })).toBeInTheDocument()
  })

  it('says the number once, however many times it is drawn', () => {
    render(<Section id="experience" eyebrow="Experience" title="Where I have worked" />)

    // The watermark repeats the number as decoration. Read out, it would be
    // the section announcing itself twice.
    expect(screen.getByText('02', { selector: '.section__ghost' })).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })

  it('leaves the number off a section outside the running order', () => {
    render(<Section id="nowhere" eyebrow="Nowhere" title="No number here" />)

    expect(screen.queryByText(/^\d\d$/)).not.toBeInTheDocument()
  })

  it('names the section by its own heading', () => {
    render(<Section id="work" eyebrow="Work" title="Selected work" />)

    expect(screen.getByRole('region', { name: 'Selected work' })).toBeInTheDocument()
  })
})
