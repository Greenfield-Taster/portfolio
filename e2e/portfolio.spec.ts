import { test, expect } from '@playwright/test'

test('the whole page is readable without scrolling to trigger anything', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  for (const id of ['about', 'experience', 'projects', 'stack', 'contact']) {
    await expect(page.locator(`#${id}`)).toBeAttached()
  }

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

  await expect(html).toHaveAttribute('data-theme', /^(light|dark)$/)
  const initial = await html.getAttribute('data-theme')
  const expected = initial === 'dark' ? 'light' : 'dark'

  await page.locator('button[aria-label^="Switch to"]').click()
  await expect(html).toHaveAttribute('data-theme', expected)

  await page.reload()
  await expect(html).toHaveAttribute('data-theme', expected)
})

test('every side project links out to its code', async ({ page }) => {
  await page.goto('/')
  const cards = page.getByTestId('project-card')
  await expect(cards).toHaveCount(3)

  for (const card of await cards.all()) {
    await expect(card.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      /github\.com\/Greenfield-Taster\//
    )
  }
})

test('reduced motion turns the animation off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const smooth = await page.evaluate(() =>
    document.documentElement.classList.contains('lenis')
  )
  expect(smooth).toBe(false)
})

test('the email address copies to the clipboard on a click', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')

  await page.getByRole('button', { name: /horbachova\.site@gmail\.com/ }).click()
  await expect(page.getByText('Copied to clipboard')).toBeVisible()

  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toBe('horbachova.site@gmail.com')
})

test('the header follows the reader down the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const nav = page.getByRole('navigation')

  await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'true')
  await expect(nav.locator('a[aria-current]')).toHaveCount(1)

  await page.locator('#projects').scrollIntoViewIfNeeded()
  await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'true')
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

  const top = await page.locator('#contact').evaluate((el) => el.getBoundingClientRect().top)
  expect(Math.abs(top)).toBeLessThanOrEqual(2)
})
