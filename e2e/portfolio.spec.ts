import { test, expect } from '@playwright/test'

// These specs run against the production build (`vite preview`, see
// playwright.config.ts), not the dev server. They cover the four things
// that can only break in a real browser: first-frame readability, state
// that must survive a reload, hash-driven UI, and prefers-reduced-motion.
//
// Headless Chromium reports misleading frame rates on any page with a
// WebGL canvas (the hero field), so nothing here asserts on timing or FPS.

test('the whole page is readable without scrolling to trigger anything', async ({ page }) => {
  // A generous desktop viewport so this actually exercises content that
  // sits in the first frame, not just the hero. `src/lib/reveal.ts` (see
  // its unit tests) intentionally animates in only elements that are
  // BELOW the fold at mount — anything already on screen must never be
  // parked at opacity: 0 waiting for the user to scroll to it.
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  for (const id of ['about', 'experience', 'work', 'stack', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached()
  }

  // Anything that is already inside the viewport on first paint must be
  // fully opaque — reveal-on-scroll may only ever target elements that are
  // still below the fold. This is what stops a future change (e.g. a CSS
  // rule that parks [data-reveal] at opacity: 0 regardless of position)
  // from quietly making on-screen content invisible.
  const hiddenInFirstFrame = await page.evaluate(() => {
    const viewportHeight = window.innerHeight
    return Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => {
      const inFirstFrame = el.getBoundingClientRect().top <= viewportHeight
      return inFirstFrame && getComputedStyle(el).opacity === '0'
    }).length
  })
  expect(hiddenInFirstFrame).toBe(0)
})

test('the theme choice survives a reload', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')

  // The toggle's accessible name and the starting data-theme both derive
  // from the OS colour scheme, so read the current state rather than
  // assuming light — this must pass whether the test machine is in light
  // or dark mode.
  await expect(html).toHaveAttribute('data-theme', /^(light|dark)$/)
  const initial = await html.getAttribute('data-theme')
  const expected = initial === 'dark' ? 'light' : 'dark'

  await page.locator('button[aria-label^="Switch to"]').click()
  await expect(html).toHaveAttribute('data-theme', expected)

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', expected)
})

test('a project panel opens, shares and closes', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /open details for woodtrick/i }).click()

  // The panel is a labelled region rendered inline in the section flow, not
  // an overlay — it does not claim role="dialog" or trap focus.
  const panel = page.getByTestId('project-panel')
  await expect(panel).toBeVisible()
  await expect(panel).toContainText('woodtrick')
  expect(page.url()).toContain('#work/woodtrick')

  await page.keyboard.press('Escape')
  // The panel is conditionally rendered — closing it removes it from the
  // DOM rather than just hiding it, and toBeHidden() accepts both.
  await expect(panel).toBeHidden()
})

test('a shared project link opens that project', async ({ page }) => {
  await page.goto('/#work/contrlve')
  await expect(page.getByTestId('project-panel')).toContainText('contrlve')
})

test('reduced motion turns the animation off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  // The Lenis smooth-scroll library stamps a `lenis` class onto <html> the
  // moment it is instantiated. useLenis() never constructs it when reduced
  // motion is requested, so the class must be absent.
  const smooth = await page.evaluate(() =>
    document.documentElement.classList.contains('lenis')
  )
  expect(smooth).toBe(false)
})

test('the contact form reports every empty field', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /send message/i }).click()

  await expect(page.getByText('Please add your name.')).toBeVisible()
  await expect(
    page.getByText('Please add an email address so I can reply.')
  ).toBeVisible()
  await expect(page.getByText('Please write a short message.')).toBeVisible()
})

test('the header follows the reader down the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const nav = page.getByRole('navigation')

  // Home owns the hero, so it is what the header marks before any scrolling.
  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'true')
  await expect(nav.locator('a[aria-current]')).toHaveCount(1)

  await page.locator('#work').scrollIntoViewIfNeeded()
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'true')
  await expect(nav.locator('a[aria-current]')).toHaveCount(1)
})

test('the header downloads the CV without leaving the page', async ({ page }) => {
  await page.goto('/')

  const download = page.waitForEvent('download')
  await page.getByRole('navigation').getByRole('link', { name: 'Resume' }).click()

  expect((await download).suggestedFilename()).toBe('Anastasiia_Horbachova_FullStack.pdf')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('picking a section from the header goes straight there', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const nav = page.getByRole('navigation')
  await nav.getByRole('link', { name: 'Contact' }).click()

  // Sample the marked link over the frames a travelling scroll would have
  // spent crossing the page. Home is the mark the page started on and may
  // still be committed for a frame; what must never appear is a section in
  // between, because that only happens when the scroll animates through them.
  const seen = await page.evaluate(async () => {
    const marks = new Set<string>()
    for (let i = 0; i < 40; i += 1) {
      const current = document.querySelector('nav a[aria-current]')
      if (current?.textContent) marks.add(current.textContent)
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    return [...marks]
  })

  expect(seen.filter((label) => label !== 'Contact' && label !== 'Home')).toEqual([])
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'true')

  // The section's own top edge sits on the top of the screen, rather than
  // below a scroll-padding gap that would leave the previous section showing.
  const top = await page.locator('#contact').evaluate((el) => el.getBoundingClientRect().top)
  expect(Math.abs(top)).toBeLessThanOrEqual(2)
})
