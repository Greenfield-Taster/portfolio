import { Nav } from './components/Nav/Nav'
import { Footer } from './components/Footer/Footer'
import { Grain } from './components/Grain/Grain'
import { HeroCanvas } from './components/HeroCanvas/HeroCanvas'
import { Hero } from './sections/Hero/Hero'
import { About } from './sections/About/About'
import { Experience } from './sections/Experience/Experience'
import { Work } from './sections/Work/Work'
import { Stack } from './sections/Stack/Stack'
import { Contact } from './sections/Contact/Contact'
import { useLenis } from './hooks/useLenis'
import { useScrollReveal } from './hooks/useScrollReveal'
import { ThemeProvider } from './hooks/ThemeProvider'

export default function App() {
  useLenis()
  useScrollReveal()

  return (
    <ThemeProvider>
      {/* The scene belongs to the page, not to the hero: it is fixed behind
          everything, and each section below is a scrim the landscape carries
          on under. Kept ahead of the content in the DOM so it paints first. */}
      <HeroCanvas />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <Grain />
    </ThemeProvider>
  )
}
