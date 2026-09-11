import { tools } from '../../data/tools'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './ToolMarquee.scss'

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {tools.map((tool) => (
        <li key={tool.name} className="marquee__item">
          <svg className="marquee__logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={tool.path} fill="currentColor" />
          </svg>
          {tool.name}
        </li>
      ))}
    </ul>
  )
}

/**
 * The tools, drifting past. Two identical rows sit end to end and the track
 * slides by exactly one row's width before snapping back, which is what makes
 * the loop seamless — the second row is under the cursor at the moment the
 * first one leaves, so there is nothing to see at the join.
 */
export function ToolMarquee() {
  const reduced = useReducedMotion()

  return (
    <div className="marquee" data-testid="tool-marquee">
      {reduced ? (
        // Nothing moves, and nothing is duplicated: a still copy of the list
        // is the honest version of this for a reader who asked for calm.
        <Row />
      ) : (
        <div className="marquee__track">
          <Row />
          {/* The understudy. It carries no information of its own, so it is
              kept out of the accessibility tree rather than read out twice. */}
          <Row hidden />
        </div>
      )}
    </div>
  )
}
