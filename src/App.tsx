import { type ReactNode, useEffect, useState } from 'react'
import { SiteNav } from './components/SiteNav'
import { ConceptDetailPage } from './pages/ConceptDetailPage'
import { ChainLabPage } from './pages/ChainLabPage'
import { ChorusLabPage } from './pages/ChorusLabPage'
import { CompressorLabPage } from './pages/CompressorLabPage'
import { DelayLabPage } from './pages/DelayLabPage'
import { DistortionLabPage } from './pages/DistortionLabPage'
import { DspMapPage } from './pages/DspMapPage'
import { FilterLabPage } from './pages/FilterLabPage'
import { FuzzChorusPage } from './pages/FuzzChorusPage'
import { GateLabPage } from './pages/GateLabPage'
import { HarmonicsPage } from './pages/HarmonicsPage'
import { HighPassLabPage } from './pages/HighPassLabPage'
import { OverdrivePage } from './pages/OverdrivePage'
import { PhaserLabPage } from './pages/PhaserLabPage'
import { ReverbLabPage } from './pages/ReverbLabPage'
import { TremoloLabPage } from './pages/TremoloLabPage'
import { WahLabPage } from './pages/WahLabPage'
import { navigate, parseHash, type Route } from './navigation'
import './index.css'

function readRoute(): Route {
  return parseHash(window.location.hash)
}

const labPages: Partial<Record<Route['type'], ReactNode>> = {
  'distortion-lab': <DistortionLabPage />,
  'delay-lab': <DelayLabPage />,
  'chorus-lab': <ChorusLabPage />,
  'filter-lab': <FilterLabPage />,
  'tremolo-lab': <TremoloLabPage />,
  'compressor-lab': <CompressorLabPage />,
  'gate-lab': <GateLabPage />,
  'highpass-lab': <HighPassLabPage />,
  'wah-lab': <WahLabPage />,
  'phaser-lab': <PhaserLabPage />,
  'reverb-lab': <ReverbLabPage />,
  'chain-lab': <ChainLabPage />,
}

export default function App() {
  const [route, setRoute] = useState<Route>(readRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    if (!window.location.hash) navigate({ type: 'map' })
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const routeKey = route.type === 'concept' ? `concept/${route.slug}` : route.type

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [routeKey])

  const go = (next: Route) => {
    navigate(next)
    setRoute(next)
  }

  const labPage = route.type in labPages ? labPages[route.type as keyof typeof labPages] : null

  return (
    <>
      <SiteNav route={route} onNavigate={go} />
      {route.type === 'map' && <DspMapPage />}
      {route.type === 'overdrive' && <OverdrivePage />}
      {route.type === 'fuzz-chorus' && <FuzzChorusPage />}
      {route.type === 'harmonics' && <HarmonicsPage />}
      {route.type === 'concept' && <ConceptDetailPage slug={route.slug} />}
      {labPage}
    </>
  )
}
