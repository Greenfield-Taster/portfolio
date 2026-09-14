import { findToolIcon } from './tools'

describe('findToolIcon', () => {
  it('finds a logo by the name the stack data uses', () => {
    expect(findToolIcon('React 19')?.name).toBe('React')
    expect(findToolIcon('Redux Toolkit')?.name).toBe('Redux')
    expect(findToolIcon('Express.js')?.name).toBe('Express')
    expect(findToolIcon('SCSS/BEM')?.name).toBe('Sass')
  })

  it('is not fooled by case', () => {
    expect(findToolIcon('postgresql')?.name).toBe('PostgreSQL')
  })

  it('never hands one tool another tool logo on a prefix', () => {
    // 'GitHub Actions' starts with 'Git'. A loose match would badge it with
    // the Git logo and quietly tell the reader something untrue.
    expect(findToolIcon('GitHub Actions')?.name).toBe('GitHub Actions')
  })

  it('has nothing to show for a tool the icon set does not draw', () => {
    expect(findToolIcon('Azure')).toBeUndefined()
    expect(findToolIcon('REST API')).toBeUndefined()
    expect(findToolIcon('Agile/Scrum')).toBeUndefined()
  })

  it('carries the brand colour', () => {
    expect(findToolIcon('React 19')?.color).toBe('#61DAFB')
  })

  it('drops a black brand colour so the logo survives the dark theme', () => {
    expect(findToolIcon('Three.js')?.color).toBeNull()
    expect(findToolIcon('Express.js')?.color).toBeNull()
  })
})
