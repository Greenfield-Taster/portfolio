import { findToolIcon, tools } from './tools'

describe('findToolIcon', () => {
  it('finds a logo by the name the icon set uses', () => {
    expect(findToolIcon('React')?.name).toBe('React')
  })

  it('is not fooled by case', () => {
    expect(findToolIcon('postgresql')?.name).toBe('PostgreSQL')
  })

  it('follows the aliases the stack data actually uses', () => {
    expect(findToolIcon('React 19')?.name).toBe('React')
    expect(findToolIcon('Redux Toolkit')?.name).toBe('Redux')
    expect(findToolIcon('Express.js')?.name).toBe('Express')
    expect(findToolIcon('SCSS/BEM')?.name).toBe('Sass')
  })

  it('never hands one tool another tool logo on a prefix', () => {
    // 'GitHub Actions' starts with 'Git'. A loose match would badge it with
    // the Git logo and quietly tell the reader something untrue.
    expect(findToolIcon('GitHub Actions')).toBeUndefined()
  })

  it('has nothing to show for a tool the icon set does not draw', () => {
    expect(findToolIcon('MedusaJS')).toBeUndefined()
    expect(findToolIcon('Agile/Scrum')).toBeUndefined()
  })

  it('gives every icon a drawable path', () => {
    for (const tool of tools) {
      expect(tool.path.length).toBeGreaterThan(0)
      expect(tool.name).not.toBe('')
    }
  })
})
