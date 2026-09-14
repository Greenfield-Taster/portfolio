import { projects as ownProjects } from './projects'
import { roles as allRoles } from './experience'
import type { Project, Role } from './types'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * How many projects the page can vouch for: every client role in Experience
 * was one product, and the side projects are the rest.
 */
export function projectCount(own: Project[] = ownProjects, client: Role[] = allRoles): number {
  return client.length + own.length
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
