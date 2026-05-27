import { useEffect, useState } from 'react'
import { ConceptDetailPage } from './pages/ConceptDetailPage'
import { DspMapPage } from './pages/DspMapPage'
import { DelayLabPage } from './pages/DelayLabPage'
import { DistortionLabPage } from './pages/DistortionLabPage'
import { FuzzChorusPage } from './pages/FuzzChorusPage'
import { HarmonicsPage } from './pages/HarmonicsPage'
import { OverdrivePage } from './pages/OverdrivePage'
import { navigate, parseHash, type Route } from './navigation'
import './index.css'

function readRoute(): Route {
  return parseHash(window.location.hash)
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

  const isMap = route.type === 'map'
  const isOverdrive = route.type === 'overdrive'
  const isFuzzChorus = route.type === 'fuzz-chorus'
  const isHarmonics = route.type === 'harmonics'
  const isDistortionLab = route.type === 'distortion-lab'
  const isDelayLab = route.type === 'delay-lab'
  const isConcept = route.type === 'concept'

  return (
    <>
      <nav className="site-nav">
        <button type="button" className="site-nav__brand site-nav__brand-btn" onClick={() => go({ type: 'map' })}>
          Guitar DSP
        </button>
        <div className="site-nav__links">
          <button
            type="button"
            className={isMap ? 'site-nav__link active' : 'site-nav__link'}
            onClick={() => go({ type: 'map' })}
          >
            10 Concepts
          </button>
          <button
            type="button"
            className={isOverdrive ? 'site-nav__link active' : 'site-nav__link'}
            onClick={() => go({ type: 'overdrive' })}
          >
            Overdrive &amp; Distortion
          </button>
          <button
            type="button"
            className={isDistortionLab ? 'site-nav__link active' : 'site-nav__link'}
            onClick={() => go({ type: 'distortion-lab' })}
          >
            Distortion Lab
          </button>
          <button
            type="button"
            className={isDelayLab ? 'site-nav__link active' : 'site-nav__link'}
            onClick={() => go({ type: 'delay-lab' })}
          >
            Delay Lab
          </button>
          <button
            type="button"
            className={isHarmonics ? 'site-nav__link active' : 'site-nav__link'}
            onClick={() => go({ type: 'harmonics' })}
          >
            Harmonics
          </button>
          <button
            type="button"
            className={isFuzzChorus ? 'site-nav__link active' : 'site-nav__link'}
            onClick={() => go({ type: 'fuzz-chorus' })}
          >
            Fuzz &amp; Chorus
          </button>
        </div>
      </nav>
      {isMap && <DspMapPage />}
      {isOverdrive && <OverdrivePage />}
      {isFuzzChorus && <FuzzChorusPage />}
      {isDistortionLab && <DistortionLabPage />}
      {isDelayLab && <DelayLabPage />}
      {isHarmonics && <HarmonicsPage />}
      {isConcept && <ConceptDetailPage slug={route.slug} />}
    </>
  )
}
