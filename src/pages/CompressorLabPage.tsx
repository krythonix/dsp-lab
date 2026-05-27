import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createCompressorGraph, defaultCompressorParams } from '../audio/compressor'
import { useLabEngine } from '../hooks/useLabEngine'

export function CompressorLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createCompressorGraph, defaultCompressorParams)

  return (
    <main className="page">
      <header className="hero">
        <h1>Compressor Lab</h1>
        <p>Turn down loud notes and bring up quiet ones — evens picking dynamics so drive and delay respond more consistently.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Lower threshold and raise ratio to hear squash — add makeup gain to match level."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <PedalSlider label="Threshold" value={params.threshold} min={-48} max={0} step={1} display={`${params.threshold} dB`} onChange={(threshold) => setParams({ threshold })} />
            <PedalSlider label="Ratio" value={params.ratio} min={1} max={12} step={0.5} display={`${params.ratio.toFixed(1)}:1`} onChange={(ratio) => setParams({ ratio })} />
            <PedalSlider label="Attack" value={params.attack} min={0.001} max={0.1} step={0.001} display={`${(params.attack * 1000).toFixed(0)} ms`} onChange={(attack) => setParams({ attack })} />
            <PedalSlider label="Release" value={params.release} min={0.05} max={1} step={0.01} display={`${(params.release * 1000).toFixed(0)} ms`} onChange={(release) => setParams({ release })} />
            <PedalSlider label="Makeup gain" value={params.makeup} min={0} max={18} step={0.5} display={`+${params.makeup} dB`} onChange={(makeup) => setParams({ makeup })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#fbbf24" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'DynamicsCompressorNode', body: 'Built-in Web Audio compressor reduces gain when input exceeds threshold.', formula: 'above threshold → gain ↓ by ratio' },
          { title: 'Attack / release', body: 'How fast compression engages and lets go — fast attack tames pick transients.', formula: 'slow release = pumping' },
          { title: 'Makeup gain', body: 'Boost output after compression to restore perceived loudness.', formula: 'out × 10^(makeup/20)' },
        ]} />
      </section>
    </main>
  )
}
