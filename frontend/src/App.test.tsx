import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the site owner name as the page heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: /anastasiia horbachova/i })
    ).toBeInTheDocument()
  })
})
