import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { shouldReveal } from '../lib/reveal'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal(selector = '[data-reveal]'): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const targets = elements.filter((el) =>
      shouldReveal(el.getBoundingClientRect(), window.innerHeight, reduced)
    )
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      for (const el of targets) {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.62,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      }
    })

    return () => ctx.revert()
  }, [selector, reduced])
}
