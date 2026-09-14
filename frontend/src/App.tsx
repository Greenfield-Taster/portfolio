import { Nav } from './components/Nav/Nav'
import { Footer } from './components/Footer/Footer'
import { Grain } from './components/Grain/Grain'
import { HeroCanvas } from './components/HeroCanvas/HeroCanvas'
import { Hero } from './sections/Hero/Hero'
import { About } from './sections/About/About'
import { Experience } from './sections/Experience/Experience'
import { Projects } from './sections/Projects/Projects'
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
      <HeroCanvas />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <Grain />
    </ThemeProvider>
  )
}
