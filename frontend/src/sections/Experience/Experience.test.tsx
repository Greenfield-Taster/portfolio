import { render, screen, within } from '@testing-library/react'
import { Experience } from './Experience'
import { roles } from '../../data/experience'
import { rolesNewestFirst } from '../../data/select'

describe('Experience', () => {
  it('lists every role', () => {
    render(<Experience />)
    for (const role of roles) {
      expect(screen.getByText(new RegExp(role.company))).toBeInTheDocument()
    }
  })

  it('puts the current role first', () => {
    render(<Experience />)
    const items = screen.getAllByTestId('role-row')
    expect(items[0]).toHaveTextContent('Kryla Nadii')
  })

  it('runs newest to oldest', () => {
    render(<Experience />)
    const rendered = screen.getAllByTestId('role-row')
    const expected = rolesNewestFirst()

    expect(rendered).toHaveLength(expected.length)
    rendered.forEach((row, index) => {
      expect(row).toHaveTextContent(expected[index].company)
    })
  })

  it('marks an ongoing role as Present', () => {
    render(<Experience />)
    expect(screen.getByText(/Jul 2026 — Present/)).toBeInTheDocument()
  })

  it('shows every highlight of every role without asking the reader to open anything', () => {
    render(<Experience />)

    // The section used to hide the detail behind a toggle. Nothing may be
    // collapsed now, so a reader — or a search engine — gets all of it.
    const rows = screen.getAllByTestId('role-row')
    rolesNewestFirst().forEach((role, index) => {
      const row = rows[index]
      expect(within(row).getByText(role.summary)).toBeVisible()
      for (const highlight of role.highlights) {
        expect(within(row).getByText(highlight)).toBeVisible()
      }
    })
  })

  it('names the stack each role was built with', () => {
    render(<Experience />)
    const rows = screen.getAllByTestId('role-row')

    rolesNewestFirst().forEach((role, index) => {
      for (const item of role.stack) {
        expect(within(rows[index]).getByText(item)).toBeInTheDocument()
      }
    })
  })

  it('heads each card with the job title, not the company', () => {
    render(<Experience />)
    const rows = screen.getAllByTestId('role-row')

    // Scoped per row on purpose: two roles share the title 'Frontend
    // Developer', so a page-wide query would match both.
    rolesNewestFirst().forEach((role, index) => {
      expect(
        within(rows[index]).getByRole('heading', { level: 3, name: role.title })
      ).toBeInTheDocument()
    })
  })
})
