import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createGateGraph, defaultGateParams } from '../audio/gate'
import { useLabEngine } from '../hooks/useLabEngine'

export function GateLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createGateGraph, defaultGateParams)

  return (
    <main className="page">
      <header className="hero">
        <h1>Noise Gate Lab</h1>
        <p>Mute the signal when it drops below a threshold — cuts hiss and hum between notes, especially after heavy drive.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Raise threshold until silence between phrases gets cut — use live input with room noise for best demo."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <PedalSlider label="Threshold" value={params.threshold} min={0.002} max={0.08} step={0.001} display={params.threshold.toFixed(3)} onChange={(threshold) => setParams({ threshold })} />
            <PedalSlider label="Attack" value={params.attackMs} min={1} max={30} step={1} display={`${params.attackMs} ms`} onChange={(attackMs) => setParams({ attackMs })} />
            <PedalSlider label="Release" value={params.releaseMs} min={20} max={400} step={10} display={`${params.releaseMs} ms`} onChange={(releaseMs) => setParams({ releaseMs })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#94a3b8" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'Level detector', body: 'Measure short-term RMS of the input — compare to threshold.', formula: 'rms = √(mean(sample²))' },
          { title: 'Gain switch', body: 'Open gate when above threshold, close when below — with attack and release smoothing.', formula: 'open → gain 1, closed → ~0' },
        ]} />
      </section>
    </main>
  )
}
