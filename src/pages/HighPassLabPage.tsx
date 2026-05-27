import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createHighPassGraph, defaultHighPassParams, hzToLabel } from '../audio/highpass'
import { useLabEngine } from '../hooks/useLabEngine'

export function HighPassLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createHighPassGraph, defaultHighPassParams)

  return (
    <main className="page">
      <header className="hero">
        <h1>High-pass Lab</h1>
        <p>Remove low-end rumble before drive or recording — bass notes below the cutoff get quieter while the rest passes through.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Sweep cutoff from 40 Hz to 250 Hz — hear mud disappear as you raise it."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <PedalSlider label="Cutoff" value={params.frequency} min={40} max={250} step={1} display={hzToLabel(params.frequency)} onChange={(frequency) => setParams({ frequency })} />
            <PedalSlider label="Q" value={params.q} min={0.5} max={4} step={0.1} display={params.q.toFixed(1)} onChange={(q) => setParams({ q })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#60a5fa" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'High-pass filter', body: 'Frequencies below cutoff are attenuated — useful before distortion so bass does not clog the drive.', formula: 'keep highs, cut lows' },
          { title: 'Cutoff', body: 'Typical guitar HPF: 70–120 Hz for live, higher for tight metal tones.', formula: 'freq ↑ → thinner tone' },
        ]} />
      </section>
    </main>
  )
}
