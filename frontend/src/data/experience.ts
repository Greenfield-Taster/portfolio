import type { Role } from './types'

export const roles: Role[] = [
  {
    id: 'kryla-nadii',
    company: 'Kryla Nadii',
    context: 'Education & Rehabilitation Centre',
    title: 'Frontend Developer',
    location: 'Fastiv, Ukraine',
    start: '2026-07',
    end: null,
    summary:
      'Sole developer of the public website of a special-education and rehabilitation centre, from requirements through to deployment.',
    highlights: [
      'Solely architected and developed from scratch the public website — owned the full lifecycle from requirements gathering to design, implementation, and deployment on Cloudflare Pages',
      'Built a 430+ token SCSS design system with fluid clamp() typography and CSS Grid across 42 breakpoints',
      '7 sections on React Router, accessibility (semantic ARIA, :focus-visible, prefers-reduced-motion), and JSON-LD SEO, Open Graph, sitemap',
    ],
    stack: ['React', 'TypeScript', 'React Router', 'SCSS', 'Cloudflare Pages'],
  },
  {
    id: 'just-sleep',
    company: 'Just Sleep',
    context: 'E-commerce Platform',
    title: 'Full-Stack Developer',
    location: 'Kyiv, Ukraine',
    start: '2025-09',
    end: '2026-07',
    summary:
      'Built a full e-commerce platform end to end: React 19 storefront on a MedusaJS v2 backend, with payments, delivery and transactional email.',
    highlights: [
      'React 19 storefront (catalog with multi-filter sidebar, product gallery, cart, multi-step checkout, wishlist, order tracking) + MedusaJS v2 backend on PostgreSQL, 6 custom modules, 20+ REST API endpoints',
      'Phone + OTP auth via TurboSMS (rate limiting, retry logic) and Google OAuth 2.0 with custom JWT strategy — access/refresh rotation, httpOnly cookies, 401 auto-retry axios interceptor',
      'WayForPay payment gateway (card, Google Pay, Apple Pay) with HMAC-MD5 signature verification, webhook handlers for order status sync, and refund flow',
      'Three delivery carriers (Nova Poshta, Delivery Auto, SAT): city/branch lookup, cost calculation, and warehouse search with server-side caching via a unified abstraction layer',
      'SEO: dynamic meta, Open Graph, Twitter Cards, JSON-LD (Product, Organization, FAQ, BreadcrumbList); transactional emails via Resend + React Email, Zod validation, Multer uploads',
    ],
    stack: ['React 19', 'MedusaJS v2', 'PostgreSQL', 'Node.js', 'Zod', 'Resend'],
  },
  {
    id: 'biosafe',
    company: 'BioSafe',
    context: 'Medical & Veterinary Lab Consulting',
    title: 'Full-Stack Developer',
    location: 'Zaporizhzhia',
    start: '2025-07',
    end: '2025-10',
    summary:
      'Built a full-stack site for a medical and veterinary diagnostics consultancy, with consultant profiles, filterable services and hardened contact handling.',
    highlights: [
      'React + TypeScript frontend with consultant profiles (modal detail views) and filterable diagnostic service listings; Node.js/Express backend handling contact form submissions with schema validation and email dispatch',
      'Google reCAPTCHA v3 with server-side token verification for invisible bot protection — score-based risk analysis, automatic challenge on suspicious requests, and graceful fallback; custom Ukrainian phone validation (libphonenumber-js)',
      'EmailJS with templated variables and retry-on-failure logic; interactive Google Maps with platform-aware deep linking (iOS Maps, Android Google Maps, desktop fallback)',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'reCAPTCHA v3', 'EmailJS'],
  },
  {
    id: 'td-capital-market',
    company: 'TD Capital Market',
    context: 'Construction Company',
    title: 'Frontend Developer',
    location: 'Kyiv, Ukraine',
    start: '2025-04',
    end: '2025-07',
    summary:
      'Built a bilingual company site with a large project portfolio, and made 350+ photographs load fast on a phone.',
    highlights: [
      'Bilingual website (EN/UK) on React + TypeScript with i18next, project listings with multi-criteria status filtering, and photo gallery with interactive lightbox (zoom, swipe gestures); implemented design from Figma',
      'Optimized performance for a portfolio with 350+ photos using lazy loading via Intersection Observer API, WebP image compression, responsive srcset, and scroll-reveal animations; deployed via GitHub Actions CI/CD',
    ],
    stack: ['React', 'TypeScript', 'i18next', 'GitHub Actions'],
  },
  {
    id: 'cryptobit',
    company: 'Cryptobit',
    context: 'Cryptocurrency Exchange Platform',
    title: 'Full-Stack Developer',
    location: 'Kyiv, Ukraine',
    start: '2025-01',
    end: '2025-07',
    summary:
      'Built a crypto exchange with live pricing, a real-time support chat over SignalR, and an admin dashboard.',
    highlights: [
      'React + TypeScript with JWT auth (refresh token rotation); integrated CoinGecko API for real-time price tracking of 15 cryptocurrencies and a live currency converter',
      'Real-time support chat via Microsoft SignalR WebSocket: persistent message history with infinite scroll, synced read receipts, typing indicators, auto-reconnect with exponential backoff, and optimistic UI updates via Redux Toolkit',
      'Admin dashboard with Recharts analytics, user/order management tables with server-side pagination and filtering, bilingual UI (EN/RU) via i18next; containerized with Docker and deployed via Azure Static Web Apps CI/CD',
    ],
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'SignalR', 'Docker', 'Azure'],
  },
  {
    id: 'bustour',
    company: 'BusTour',
    context: 'Travel Booking Platform',
    title: 'Junior Full-Stack Developer',
    location: 'Ukraine',
    start: '2023-10',
    end: '2024-06',
    summary:
      'Worked in an agile team on a full frontend redesign of a legacy travel platform, under a tech lead.',
    highlights: [
      'Contributed to a full frontend redesign of a legacy travel platform as part of an agile team under tech lead supervision — participated in code reviews, sprint plannings, and task estimations',
      'Built authentication flow (login, registration, multi-step verification) with Vee-Validate — reduced form errors by 25%; occasionally worked on the backend to add roles and custom claims to JWT',
      'Refactored legacy JavaScript callback-hell to modern async/await across 10+ modules and covered critical flows with unit tests',
    ],
    stack: ['Vue.js', 'JavaScript', 'Vee-Validate', 'JWT'],
  },
]
