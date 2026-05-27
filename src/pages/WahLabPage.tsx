import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createWahGraph, defaultWahParams, hzToLabel } from '../audio/wah'
import { useLabEngine } from '../hooks/useLabEngine'

export function WahLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createWahGraph, defaultWahParams)

  return (
    <main className="page">
      <header className="hero">
        <h1>Wah Lab</h1>
        <p>A band-pass filter sweep — move the peak through the mids like a crybaby wah pedal.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Sweep frequency while playing — toe down (high Hz) vs heel down (low Hz)."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <PedalSlider label="Sweep (frequency)" value={params.frequency} min={350} max={2200} step={10} display={hzToLabel(params.frequency)} onChange={(frequency) => setParams({ frequency })} />
            <PedalSlider label="Q (resonance)" value={params.q} min={1} max={10} step={0.1} display={params.q.toFixed(1)} onChange={(q) => setParams({ q })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#fb923c" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'Band-pass peak', body: 'Boost a narrow mid band — frequency slider moves the peak.', formula: 'type = bandpass, high Q' },
          { title: 'Manual sweep', body: 'Real wah uses an expression pedal; here a slider controls the peak position.', formula: 'freq ↑ → brighter vowel' },
        ]} />
      </section>
    </main>
  )
}
