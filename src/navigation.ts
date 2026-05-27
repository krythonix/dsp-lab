export type Route =
  | { type: 'map' }
  | { type: 'overdrive' }
  | { type: 'fuzz-chorus' }
  | { type: 'harmonics' }
  | { type: 'distortion-lab' }
  | { type: 'delay-lab' }
  | { type: 'concept'; slug: string }

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '')
  if (path === 'overdrive') return { type: 'overdrive' }
  if (path === 'fuzz-chorus') return { type: 'fuzz-chorus' }
  if (path === 'harmonics') return { type: 'harmonics' }
  if (path === 'distortion-lab') return { type: 'distortion-lab' }
  if (path === 'delay-lab') return { type: 'delay-lab' }
  if (path.startsWith('concept/')) {
    const slug = path.slice('concept/'.length)
    if (slug) return { type: 'concept', slug }
  }
  return { type: 'map' }
}

export function routeToHash(route: Route): string {
  switch (route.type) {
    case 'overdrive':
      return '#/overdrive'
    case 'fuzz-chorus':
      return '#/fuzz-chorus'
    case 'harmonics':
      return '#/harmonics'
    case 'distortion-lab':
      return '#/distortion-lab'
    case 'delay-lab':
      return '#/delay-lab'
    case 'concept':
      return `#/concept/${route.slug}`
    default:
      return '#/'
  }
}

export function navigate(route: Route) {
  window.location.hash = routeToHash(route).slice(1)
}
