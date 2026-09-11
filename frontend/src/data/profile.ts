import type { Profile } from './types'

export const profile: Profile = {
  name: 'Anastasiia Horbachova',
  role: 'Full-stack developer',
  roles: ['Full-Stack Developer', 'React Developer', 'Node.js Developer'],
  tagline: 'Building React and Node applications',
  availability: 'Available for work',
  workAuthorization: 'EU work authorization',
  lede:
    'An experienced full-stack developer who takes a project end to end — I agree the work with the client myself, then build all of it: the interface, the server behind it and the database under that.',
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
