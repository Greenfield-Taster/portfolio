# Anastasiia Horbachova — portfolio

The personal site of a full-stack developer: experience, side projects and stack, on one page.

- **Live:** https://horbachov.com
- **Author:** [Anastasiia Horbachova](https://github.com/Greenfield-Taster) · [LinkedIn](https://www.linkedin.com/in/anastasiia-horbachova)

## Overview

The page opens with a loading screen that scrambles the AH. initials into place, then a hero over a live Three.js scene: a wireframe terrain flowing toward the camera under a field of stars, drawn in the palette of whichever theme is on. Below it: About, Professional Experience on a glowing timeline, Side Projects, Technical Stack and Contact. Light and dark themes follow the system until the visitor picks one; the choice is remembered.

Everything on the page is data. The text lives in `frontend/src/data/`; a new project or role is one object in a file, and no component needs to change.

## Highlights

- **A hero that runs everywhere.** The WebGL scene resolves a quality tier at startup — `high`, `low` for phones and weak GPUs, `still` for visitors who ask for reduced motion — and pauses whenever it leaves the viewport. On a phone the canvas is held at the large viewport height so the address bar cannot resize it, and the GPU is asked for low power. If the context is ever lost, a painted CSS sky takes over.
- **Motion that respects the reader.** Section reveals use an `IntersectionObserver`, the loading screen and the reveals are skipped under `prefers-reduced-motion`, and Lenis smooths the wheel on desktop only.
- **Accessible by default.** Semantic landmarks and heading order, visible focus on every control, `aria` labels on icon buttons, the theme toggle and the burger menu announced correctly, and the decorative scene hidden from assistive technology.
- **SEO.** Canonical URL, Open Graph and Twitter cards, `robots.txt`, `sitemap.xml`, and Person and WebSite JSON-LD.
- **Tested.** 170 unit tests with Vitest and Testing Library, 8 end-to-end tests with Playwright.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19, TypeScript 6 |
| Build | Vite 8 |
| Styling | SCSS with design tokens; Space Grotesk, Inter and JetBrains Mono from Fontsource |
| 3D | three r186 |
| Motion | GSAP (with ScrambleText for the loading screen), Lenis |
| Icons | simple-icons for the tool strip |
| Tests | Vitest 4, Testing Library, Playwright |
| Lint | oxlint |
| Local orchestration | .NET Aspire AppHost (optional) |
| Hosting | Cloudflare Pages |

## Getting started

Requirements: Node.js 22. For the Aspire path you also need the .NET 10 SDK and the Aspire CLI.

Frontend only:

```bash
cd frontend
npm install
npm run dev
```

Everything together, through Aspire:

```bash
aspire start
```

The AppHost starts the Vite dev server next to the .NET server. The site never calls that server; it is kept only for local orchestration, and only `frontend/` ships.

## Scripts

From `frontend/`:

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check and build to `frontend/dist` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests, once |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run lint` | oxlint |

From the repository root:

| Script | What it does |
|---|---|
| `npm run e2e` | Playwright end-to-end tests against a fresh production build |

Playwright is pinned to `channel: 'chromium'`; in CI install it explicitly with `npx playwright install chromium`.

## Project structure

```
portfolio/
├── frontend/                   # the site; the only folder that ships
│   ├── public/                 # CV, favicons, og.png, robots.txt, sitemap.xml, _headers, _redirects
│   └── src/
│       ├── components/         # Nav, HeroCanvas, Loader, ProjectCard, ToolMarquee, …
│       ├── sections/           # Hero, About, Experience, Projects, Stack, Contact
│       ├── data/               # profile, experience, projects, stack, tools
│       ├── hooks/              # theme, reduced motion, scroll reveal, Lenis, timeline progress
│       ├── lib/                # pure helpers: reveal rules, scroll progress, SEO builders
│       ├── three/              # the hero scene, terrain noise, quality tiers
│       └── styles/             # tokens, themes, typography, reset
├── e2e/                        # Playwright tests
├── docs/                       # design directions
├── WebStarter.AppHost/         # .NET Aspire AppHost for local runs
└── WebStarter.Server/          # ASP.NET Core server; not used by the site
```

## Content

| File | Holds |
|---|---|
| `data/profile.ts` | Name, roles, tagline, contacts, education, languages, headline numbers |
| `data/experience.ts` | Roles, newest first on the page |
| `data/projects.ts` | Side projects with highlights, stack, status and links |
| `data/stack.ts` | Stack groups and their items |
| `data/tools.ts` | The tool strip and its icons |

The CV served by the Resume and Download CV buttons is `frontend/public/Anastasiia_Horbachova_FullStack.pdf`.

## Deployment

Cloudflare Pages builds and deploys `main` on every push.

- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 22

`frontend/public/_headers` sets a one-year immutable cache on hashed assets plus `X-Content-Type-Options` and `Referrer-Policy`; Cloudflare Pages picks the file up automatically.

### A known limitation

JSON-LD is injected into `<head>` by client-side JavaScript, so it is absent from the HTML the server sends. Google executes JavaScript and sees it; most link-preview bots (Telegram, LinkedIn, Slack) do not, and for them the card is carried by the plain Open Graph tags in `index.html`, which is why `og.png` exists. This is the deliberate cost of a static site without pre-rendering.

## License

[MIT](LICENSE)
