// data/imt.js
// Content for the three program ribbons rendered by components/IMT.jsx.
// `accent`  = bright tone used on the pointer block border + number + expanded badge
// `fill`    = deeper tone used as the ribbon body background (kept dark enough
//             for AA-contrast white text at the sizes used here)

export const imtPrograms = [
  {
    id: 'imt',
    number: '01',
    short: 'IMT',
    title: 'Incubation Management Training',
    description:
      'Equip leaders with frameworks to scale early-stage ventures and manage incubator ecosystems effectively.',
    accent: '#C9A227',
    fill: '#8A6A16',
  },
  {
    id: 'fedp',
    number: '02',
    short: 'FEDP',
    title: 'Faculty Entrepreneurship Development Program',
    description:
      'Empower academic faculty to foster startup culture, commercialize research, and mentor student innovators.',
    accent: '#4B7A62',
    fill: '#2F4F3F',
  },
  {
    id: 'add',
    number: '03',
    short: 'ADD',
    title: 'Accelerator Demo Day',
    description:
      'Connect high-growth cohorts with angel investors, VCs, and industry partners for high-stakes pitching.',
    accent: '#C1502E',
    fill: '#8C381D',
  },
]