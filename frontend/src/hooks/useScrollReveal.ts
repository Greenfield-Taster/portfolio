import { useEffect } from 'react'
import gsap from 'gsap'
import { shouldReveal } from '../lib/reveal'
import { useReducedMotion } from './useReducedMotion'

export function useScrollReveal(selector = '[data-reveal]'): void {
  const reduced = useReducedMotion()

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    const targets = elements.filter((el) =>
      shouldReveal(el.getBoundingClientRect(), window.innerHeight, reduced)
    )
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 24 })
    })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.unobserve(entry.target)
          ctx.add(() => {
            gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.62, ease: 'power2.out' })
          })
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    )
    for (const el of targets) observer.observe(el)

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [selector, reduced])
}
