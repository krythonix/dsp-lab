export type Route =
  | { type: 'map' }
  | { type: 'overdrive' }
  | { type: 'fuzz-chorus' }
  | { type: 'harmonics' }
  | { type: 'distortion-lab' }
  | { type: 'delay-lab' }
  | { type: 'chorus-lab' }
  | { type: 'filter-lab' }
  | { type: 'tremolo-lab' }
  | { type: 'compressor-lab' }
  | { type: 'gate-lab' }
  | { type: 'highpass-lab' }
  | { type: 'wah-lab' }
  | { type: 'phaser-lab' }
  | { type: 'reverb-lab' }
  | { type: 'chain-lab' }
  | { type: 'concept'; slug: string }

export type NavItem = {
  route: Route
  label: string
  description: string
  icon?: string
}

export type NavGroup = {
  id: string
  label: string
  items: NavItem[]
}

export const navMenu: NavGroup[] = [
  {
    id: 'learn',
    label: 'Learn',
    items: [
      {
        route: { type: 'map' },
        label: '10 Concepts',
        description: 'Core DSP ideas and the concept map',
        icon: '10',
      },
    ],
  },
  {
    id: 'comparisons',
    label: 'Comparisons',
    items: [
      {
        route: { type: 'overdrive' },
        label: 'Overdrive & Distortion',
        description: 'Clipping, transfer curves, and waveforms',
        icon: '~',
      },
      {
        route: { type: 'harmonics' },
        label: 'Harmonics',
        description: 'Harmonic series, odd/even, and drive',
        icon: 'ƒ',
      },
      {
        route: { type: 'fuzz-chorus' },
        label: 'Fuzz & Chorus',
        description: 'Hard clip vs delay, mix, and LFO',
        icon: '◈',
      },
    ],
  },
  {
    id: 'labs',
    label: 'Labs',
    items: [
      { route: { type: 'distortion-lab' }, label: 'Distortion Lab', description: 'Draggable waveshaper with live audio', icon: '⚡' },
      { route: { type: 'delay-lab' }, label: 'Delay Lab', description: 'Delay time, feedback, and dry/wet mix', icon: '↻' },
      { route: { type: 'chorus-lab' }, label: 'Chorus Lab', description: 'LFO-modulated short delay and mix', icon: '◈' },
      { route: { type: 'filter-lab' }, label: 'Filter / EQ Lab', description: 'Biquad filters and tone shaping', icon: '∩' },
      { route: { type: 'highpass-lab' }, label: 'High-pass Lab', description: 'Cut low-end rumble before drive', icon: '∧' },
      { route: { type: 'tremolo-lab' }, label: 'Tremolo Lab', description: 'LFO amplitude modulation', icon: '∿' },
      { route: { type: 'compressor-lab' }, label: 'Compressor Lab', description: 'Threshold, ratio, attack, release', icon: '⊏' },
      { route: { type: 'gate-lab' }, label: 'Noise Gate Lab', description: 'Threshold-based muting between notes', icon: '⊓' },
      { route: { type: 'wah-lab' }, label: 'Wah Lab', description: 'Band-pass filter sweep', icon: '◠' },
      { route: { type: 'phaser-lab' }, label: 'Phaser & Flanger Lab', description: 'All-pass notches or short delay sweep', icon: '◎' },
      { route: { type: 'reverb-lab' }, label: 'Reverb Lab', description: 'Convolution ambience and mix', icon: '☁' },
      { route: { type: 'chain-lab' }, label: 'Signal Chain Lab', description: 'Reorder drive, filter, delay, chorus', icon: '⛓' },
    ],
  },
]

const labRoutes = [
  'distortion-lab',
  'delay-lab',
  'chorus-lab',
  'filter-lab',
  'tremolo-lab',
  'compressor-lab',
  'gate-lab',
  'highpass-lab',
  'wah-lab',
  'phaser-lab',
  'reverb-lab',
  'chain-lab',
] as const

export type LabRouteType = (typeof labRoutes)[number]

export function routesEqual(a: Route, b: Route): boolean {
  if (a.type !== b.type) return false
  if (a.type === 'concept' && b.type === 'concept') return a.slug === b.slug
  return true
}

export function getRouteLabel(route: Route): string {
  for (const group of navMenu) {
    for (const item of group.items) {
      if (routesEqual(route, item.route)) return item.label
    }
  }
  if (route.type === 'concept') return 'Concept guide'
  return '10 Concepts'
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '')
  if (path === 'overdrive') return { type: 'overdrive' }
  if (path === 'fuzz-chorus') return { type: 'fuzz-chorus' }
  if (path === 'harmonics') return { type: 'harmonics' }
  if (path === 'distortion-lab') return { type: 'distortion-lab' }
  if (path === 'delay-lab') return { type: 'delay-lab' }
  if (path === 'chorus-lab') return { type: 'chorus-lab' }
  if (path === 'filter-lab') return { type: 'filter-lab' }
  if (path === 'tremolo-lab') return { type: 'tremolo-lab' }
  if (path === 'compressor-lab') return { type: 'compressor-lab' }
  if (path === 'gate-lab') return { type: 'gate-lab' }
  if (path === 'highpass-lab') return { type: 'highpass-lab' }
  if (path === 'wah-lab') return { type: 'wah-lab' }
  if (path === 'phaser-lab') return { type: 'phaser-lab' }
  if (path === 'reverb-lab') return { type: 'reverb-lab' }
  if (path === 'chain-lab') return { type: 'chain-lab' }
  if (path.startsWith('concept/')) {
    const slug = path.slice('concept/'.length)
    if (slug) return { type: 'concept', slug }
  }
  return { type: 'map' }
}

export function routeToHash(route: Route): string {
  if (route.type === 'concept') return `#/concept/${route.slug}`
  if (route.type === 'map') return '#/'
  return `#/${route.type}`
}

export function navigate(route: Route) {
  window.location.hash = routeToHash(route).slice(1)
}
