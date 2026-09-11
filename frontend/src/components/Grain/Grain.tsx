import './Grain.scss'

/**
 * A still film-grain wash over the whole page. Decoration with nothing to
 * read, so it is hidden from assistive technology.
 */
export function Grain() {
  return <div className="grain" aria-hidden="true" data-testid="grain" />
}
