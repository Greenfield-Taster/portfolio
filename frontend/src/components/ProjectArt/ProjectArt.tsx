import type { ProjectArt as Kind } from '../../data/types'
import './ProjectArt.scss'

/**
 * A cover for each side project, drawn from the project's own idea rather
 * than a screenshot of it: the site has no photography anywhere else, and a
 * cover that is the idea says more than one that is the pixels.
 */
export function ProjectArt({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'marker':
      return <Marker />
    case 'puzzle':
      return <Puzzle />
    case 'terminal':
      return <Terminal />
  }
}

/** contrlve: the show's logo is selected text — Ctrl+V — so the cover is that selection. */
function Marker() {
  return (
    <div className="art art--marker">
      <p className="art__keys">
        <kbd>Ctrl</kbd>
        <span>+</span>
        <kbd>V</kbd>
      </p>
      <p className="art__word">
        <mark>контрлве</mark>
        <span className="art__caret" />
      </p>
    </div>
  )
}

/** woodtrick: one laser-cut piece, tabs and blanks and the grain of the plywood. */
function Puzzle() {
  return (
    <svg className="art art--puzzle" viewBox="0 0 200 200">
      <defs>
        <clipPath id="art-piece">
          <path d={PIECE} />
        </clipPath>
      </defs>

      {/* The neighbours it was cut from, as a faint grid behind it. */}
      <g className="art__grid">
        <path d="M25 50H175M25 100H175M25 150H175M50 25V175M100 25V175M150 25V175" />
      </g>

      <path className="art__piece" d={PIECE} />

      {/* The grain runs on across the whole sheet and is cut off by the piece's edge. */}
      <g className="art__grain" clipPath="url(#art-piece)">
        <path d="M20 62c40-8 80 6 120-2s40-6 60-4" />
        <path d="M20 78c30-6 70 8 110 0s50-10 70-6" />
        <path d="M20 96c50-10 90 8 130 0s30-8 50-6" />
        <path d="M20 114c35-6 75 6 115 0s45-8 65-6" />
        <path d="M20 132c45-8 85 8 125 0s35-8 55-4" />
        <path d="M20 150c30-6 70 8 110 0s50-8 70-6" />
        <ellipse cx="128" cy="86" rx="9" ry="5" />
        <ellipse cx="128" cy="86" rx="4" ry="2" />
      </g>
    </svg>
  )
}

// A square piece with the knob out on the top and right edges and the
// socket in on the bottom and left, so it would mate with three neighbours.
const PIECE = [
  'M50 50 L88 50 C93 50 93 44 90 41 C85 34 115 34 110 41 C107 44 107 50 112 50 L150 50',
  'L150 88 C150 93 156 93 159 90 C166 85 166 115 159 110 C156 107 150 107 150 112 L150 150',
  'L112 150 C107 150 107 144 110 141 C115 134 85 134 90 141 C93 144 93 150 88 150 L50 150',
  'L50 112 C50 107 56 107 59 110 C66 115 66 85 59 90 C56 93 50 93 50 88 Z',
].join(' ')

/** LaunchKit: the two questions the CLI asks, and the palette it computes from the answer. */
function Terminal() {
  return (
    <div className="art art--terminal">
      <div className="art__window">
        <p className="art__bar">
          <i />
          <i />
          <i />
        </p>
        <pre className="art__lines">
          <span className="art__prompt">$</span> npx @greenfield-taster/launchkit-shop{'\n'}
          <span className="art__ask">?</span> Project name <b>my-shop</b>{'\n'}
          <span className="art__ask">?</span> Brand colour <b>#F56F0D</b>{'\n'}
          <span className="art__ok">✔</span> 170 tokens computed{'\n'}
          <span className="art__prompt">$</span> <span className="art__caret" />
        </pre>
        <ul className="art__palette">
          {SWATCHES.map((mix) => (
            <li key={mix} style={{ '--mix': mix } as React.CSSProperties} />
          ))}
        </ul>
      </div>
    </div>
  )
}

// One colour, ten steps: each swatch mixes the accent towards the page's
// ground or its ink, which is what the CLI does with the hex it is given.
const SWATCHES = [
  'var(--bg) 88%', 'var(--bg) 72%', 'var(--bg) 54%', 'var(--bg) 36%', 'var(--bg) 18%',
  'transparent 0%', 'var(--ink) 18%', 'var(--ink) 36%', 'var(--ink) 54%', 'var(--ink) 70%',
]
