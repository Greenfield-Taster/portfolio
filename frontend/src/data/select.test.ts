import {
  featuredProjects,
  compactProjects,
  projectCount,
  formatPeriod,
  rolesNewestFirst,
  findProject,
} from './select'
import { projects } from './projects'
import { roles } from './experience'
import type { Project } from './types'

describe('featuredProjects', () => {
  it('returns exactly the projects marked featured', () => {
    const expected = projects.filter((p) => p.featured)
    expect(expected.length).toBeGreaterThan(0)
    expect(featuredProjects()).toHaveLength(expected.length)
    expect(featuredProjects().map((p) => p.id).sort()).toEqual(
      expected.map((p) => p.id).sort()
    )
  })

  it('puts every CV project before every GitHub project, even from reversed input', () => {
    const sources = featuredProjects([...projects].reverse()).map((p) => p.source)
    const firstGithub = sources.indexOf('github')
    const lastCv = sources.lastIndexOf('cv')
    expect(lastCv).toBeLessThan(firstGithub)
  })

  it('orders by the explicit order field, even from reversed input', () => {
    const orders = featuredProjects([...projects].reverse()).map((p) => p.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })

  it('does not mutate the source array', () => {
    const before = projects.map((p) => p.id)
    featuredProjects()
    expect(projects.map((p) => p.id)).toEqual(before)
  })
})

describe('compactProjects', () => {
  it('returns exactly the projects not marked featured', () => {
    const expected = projects.filter((p) => !p.featured)
    expect(expected.length).toBeGreaterThan(0)
    expect(compactProjects()).toHaveLength(expected.length)
    expect(compactProjects().map((p) => p.id).sort()).toEqual(
      expected.map((p) => p.id).sort()
    )
  })

  it('together with the featured list accounts for every project', () => {
    expect(featuredProjects().length + compactProjects().length).toBe(projects.length)
  })

  it('shares no project with the featured list', () => {
    const featured = new Set(featuredProjects().map((p) => p.id))
    expect(compactProjects().some((p) => featured.has(p.id))).toBe(false)
  })

  it('orders by the explicit order field, even from reversed input', () => {
    const orders = compactProjects([...projects].reverse()).map((p) => p.order)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
  })
})

describe('projectCount', () => {
  it('counts every project, featured and compact together', () => {
    expect(projectCount()).toBe(projects.length)
  })

  // CONTENT-CHANGE TRIPWIRE — the one deliberately hard-coded count in this
  // file. The Hero renders projectCount() as a headline stat, so this number
  // is copy the visitor reads. If you added or removed a project, this failure
  // is expected: update the literal here and re-check the Hero stats. Every
  // other count in this file is derived from the data on purpose.
  it('still shows eleven projects in the hero stat', () => {
    expect(projectCount()).toBe(11)
  })

  it('tracks the data rather than a hard-coded number', () => {
    const extra: Project = { ...projects[0], id: 'extra', order: 99 }
    expect(projectCount([...projects, extra])).toBe(projects.length + 1)
  })
})

describe('formatPeriod', () => {
  it('formats a closed period', () => {
    expect(formatPeriod('2025-09', '2026-07')).toBe('Sep 2025 — Jul 2026')
  })

  it('renders an open period as Present', () => {
    expect(formatPeriod('2026-07', null)).toBe('Jul 2026 — Present')
  })

  it('handles a single-month period', () => {
    expect(formatPeriod('2025-01', '2025-01')).toBe('Jan 2025 — Jan 2025')
  })
})

describe('rolesNewestFirst', () => {
  it('returns every role', () => {
    expect(roles.length).toBeGreaterThan(0)
    expect(rolesNewestFirst()).toHaveLength(roles.length)
  })

  it('puts the current role first, even from reversed input', () => {
    expect(rolesNewestFirst([...roles].reverse())[0].end).toBeNull()
  })

  it('sorts by start date descending, even from reversed input', () => {
    const starts = rolesNewestFirst([...roles].reverse()).map((r) => r.start)
    expect(starts).toEqual([...starts].sort().reverse())
  })

  it('does not mutate the source array', () => {
    const before = roles.map((r) => r.id)
    rolesNewestFirst()
    expect(roles.map((r) => r.id)).toEqual(before)
  })
})

describe('findProject', () => {
  it('finds a project by id', () => {
    expect(findProject('woodtrick')?.name).toBe('woodtrick')
  })

  it('returns undefined for an unknown id', () => {
    expect(findProject('nope')).toBeUndefined()
  })
})

describe('data integrity', () => {
  it('gives every project a unique id', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every project a unique order', () => {
    const orders = projects.map((p) => p.order)
    expect(new Set(orders).size).toBe(orders.length)
  })

  it('points every role projectId at a real project', () => {
    const ids = new Set(projects.map((p) => p.id))
    for (const role of roles) {
      if (role.projectId) expect(ids.has(role.projectId)).toBe(true)
    }
  })
})
