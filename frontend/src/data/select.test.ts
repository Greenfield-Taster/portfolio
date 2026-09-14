import { projectCount, formatPeriod, rolesNewestFirst } from './select'
import { projects } from './projects'
import { roles } from './experience'
import type { Project, Role } from './types'

describe('projectCount', () => {
  it('counts every client role and every side project together', () => {
    expect(projectCount()).toBe(roles.length + projects.length)
  })

  // CONTENT-CHANGE TRIPWIRE — the one deliberately hard-coded count in this
  // file. The Hero renders projectCount() as a headline stat, so this number
  // is copy the visitor reads. If you added or removed a role or a project,
  // this failure is expected: update the literal here and re-check the Hero
  // stats. Every other count in this file is derived from the data on purpose.
  it('still shows nine projects in the hero stat', () => {
    expect(projectCount()).toBe(9)
  })

  it('tracks the data rather than a hard-coded number', () => {
    const extra: Project = { ...projects[0], id: 'extra' }
    const role: Role = { ...roles[0], id: 'extra-role' }
    expect(projectCount([...projects, extra], roles)).toBe(roles.length + projects.length + 1)
    expect(projectCount(projects, [...roles, role])).toBe(roles.length + projects.length + 1)
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

describe('data integrity', () => {
  it('gives every project a unique id', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every role a unique id', () => {
    const ids = roles.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every project somewhere to go', () => {
    for (const project of projects) {
      expect(project.links.repo ?? project.links.live).toBeTruthy()
    }
  })
})
