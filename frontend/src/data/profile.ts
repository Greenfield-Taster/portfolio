import type { Profile } from './types'

export const profile: Profile = {
  name: 'Anastasiia Horbachova',
  role: 'Full-stack developer',
  roles: ['Full-Stack Developer', 'React Developer', 'Node.js Developer'],
  tagline: 'Building React and Node applications',
  availability: 'Available for work',
  workAuthorization: 'EU work authorization',
  intro: 'Full-stack developer who builds the whole product, end to end.',
  lede:
    'For three years I’ve been the developer small businesses hire to build the whole thing — usually as the only engineer on the project. I take the brief myself, then ship every layer: the React storefront, the Node API behind it, the PostgreSQL schema under that, and the parts nobody notices until they fail — payment webhooks, OTP sign-in, delivery integrations, a support chat that reconnects on its own. I started in an agile team untangling a legacy codebase; today I hand clients products that survive real users.',
  email: 'horbachova.site@gmail.com',
  linkedin: 'https://www.linkedin.com/in/anastasiia-horbachova',
  github: 'https://github.com/Greenfield-Taster',
  cvPath: '/Anastasiia_Horbachova_FullStack.pdf',
  siteUrl: 'https://horbachova.com/',
  education: [
    {
      school: 'National University «Zaporizhzhia Polytechnic»',
      degree: 'B.Sc. Software Engineering',
      years: '2024 – 2027',
    },
    {
      school: 'Zaporizhzhia Electrotechnical Professional College',
      degree: "Jr. Bachelor's, Software Engineering",
      years: '2020 – 2024',
    },
  ],
  languages: [
    { name: 'English', level: 'B2 — Duolingo certified' },
    { name: 'Ukrainian', level: 'Native' },
  ],
  years: '3+',
  companies: 1,
  clients: 6,
  npmPackages: 2,
}
