/**
 * The account name at the end of a profile URL — 'Greenfield-Taster' from a
 * GitHub link, 'anastasiia-horbachova' from a LinkedIn one.
 *
 * A business card shows the handle, not the URL: the full address is what the
 * link is for, and printing it would crowd the card with characters nobody
 * reads. Derived rather than written down a second time, so the card cannot
 * end up pointing at one account and naming another.
 */
export function handleFromUrl(url: string): string {
  // Trailing slashes are common in profile links and would otherwise make the
  // last segment an empty string.
  const trimmed = url.replace(/\/+$/, '')
  const lastSlash = trimmed.lastIndexOf('/')
  return lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)
}
