import { projects as allProjects } from './projects'
import { roles as allRoles } from './experience'
import type { Project, Role } from './types'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function byOrder(a: Project, b: Project) {
  return a.order - b.order
}

export function featuredProjects(list: Project[] = allProjects): Project[] {
  return list.filter((p) => p.featured).sort(byOrder)
}

export function compactProjects(list: Project[] = allProjects): Project[] {
  return list.filter((p) => !p.featured).sort(byOrder)
}

export function projectCount(list: Project[] = allProjects): number {
  return list.length
}

export function findProject(id: string, list: Project[] = allProjects): Project | undefined {
  return list.find((p) => p.id === id)
}

function formatMonth(value: string): string {
  const [year, month] = value.split('-')
  return `${MONTHS[Number(month) - 1]} ${year}`
}

export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`
}

export function rolesNewestFirst(list: Role[] = allRoles): Role[] {
  return [...list].sort((a, b) => b.start.localeCompare(a.start))
}
