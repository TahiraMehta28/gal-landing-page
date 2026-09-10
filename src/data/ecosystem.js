// Powers the formal "ecosystem" section that replaced the circular
// triple-helix diagram. Builder sits in the middle as the emphasised panel.
export const ecosystemPanels = [
  {
    id: 'academia',
    label: 'Academia',
    description: 'Research, talent and technology worth taking further.',
    accent: 'border-t-moss',
  },
  {
    id: 'builder',
    label: 'The Builder',
    description: 'The founder, researcher or professional actually doing the work.',
    accent: 'border-t-ink',
    emphasis: true,
  },
  {
    id: 'industry',
    label: 'Industry',
    description: 'Real problems, distribution and capital, applied early.',
    accent: 'border-t-spark',
  },
]

export const ecosystemExtra = {
  id: 'government',
  label: 'Government',
  description: 'Policy, funding and infrastructure that make building possible at scale.',
  accent: 'border-t-denim',
}
