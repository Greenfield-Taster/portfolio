import type { Profile } from './types'

export const profile: Profile = {
  name: 'Anastasiia Horbachova',
  role: 'Full-stack developer',
  roles: ['Full-Stack Developer', 'React Developer', 'Node.js Developer'],
  tagline: 'Building React and Node applications',
  availability: 'Available for work',
  workAuthorization: 'EU work authorization',
  lede:
    'I build full-stack React and Node applications — from a storefront with payments and three delivery carriers to a real-time support chat that reconnects on its own.',
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
  companies: 6,
  npmPackages: 2,
}
