import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createTremoloGraph, defaultTremoloParams } from '../audio/tremolo'
import { useLabEngine } from '../hooks/useLabEngine'

export function TremoloLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createTremoloGraph, defaultTremoloParams)

  return (
    <main className="page">
      <header className="hero">
        <h1>Tremolo Lab</h1>
        <p>Pure LFO on volume — an oscillator slowly turns the signal up and down. No delay, no clipping.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Try 3–6 Hz for classic amp tremolo, or slow rates for pulsing ambience."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <PedalSlider label="Rate" value={params.rateHz} min={0.5} max={12} step={0.1} display={`${params.rateHz.toFixed(1)} Hz`} onChange={(rateHz) => setParams({ rateHz })} />
            <PedalSlider label="Depth" value={params.depth} min={0} max={1} step={0.01} display={`${Math.round(params.depth * 100)}%`} onChange={(depth) => setParams({ depth })} />
            <PedalSlider label="Mix" value={params.mix} min={0} max={1} step={0.01} display={`${Math.round(params.mix * 100)}%`} onChange={(mix) => setParams({ mix })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#c084fc" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'LFO → gain', body: 'A sine oscillator modulates a GainNode — amplitude goes up and down.', formula: 'gain = offset + depth × sin(LFO)' },
          { title: 'Rate & depth', body: 'Rate is wobble speed; depth is how quiet the dips get.', formula: 'out = in × modulatedGain' },
        ]} />
      </section>
    </main>
  )
}
