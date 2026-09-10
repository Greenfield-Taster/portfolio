import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './App'
import { buildPersonJsonLd, buildWebSiteJsonLd } from './lib/seo'
import { profile } from './data/profile'

function injectJsonLd() {
  for (const data of [buildPersonJsonLd(profile), buildWebSiteJsonLd(profile)]) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }
}

injectJsonLd()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
