import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createReverbGraph, defaultReverbParams } from '../audio/reverb'
import { useLabEngine } from '../hooks/useLabEngine'

export function ReverbLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createReverbGraph, defaultReverbParams)

  return (
    <main className="page">
      <header className="hero">
        <h1>Reverb Lab</h1>
        <p>Many tiny echoes blended together — convolution reverb smears the dry guitar into a room or hall.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Raise mix for ambience — longer decay simulates a bigger space."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <PedalSlider label="Decay" value={params.decay} min={1} max={4} step={0.1} display={params.decay.toFixed(1)} onChange={(decay) => setParams({ decay })} />
            <PedalSlider label="Pre-delay" value={params.preDelayMs} min={0} max={80} step={5} display={`${params.preDelayMs} ms`} onChange={(preDelayMs) => setParams({ preDelayMs })} />
            <PedalSlider label="Mix (wet)" value={params.mix} min={0} max={1} step={0.01} display={`${Math.round(params.mix * 100)}%`} onChange={(mix) => setParams({ mix })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#60a5fa" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'Pre-delay', body: 'Short delay before reverb — keeps pick attack clear.', formula: 'dry attack, then tail' },
          { title: 'Convolution', body: 'ConvolverNode applies an impulse response — thousands of micro-echoes.', formula: 'out = convolve(in, IR)' },
          { title: 'Mix', body: 'Blend dry guitar with reverb tail — same dry/wet idea as delay.', formula: 'out = dry + wet × mix' },
        ]} />
      </section>
    </main>
  )
}
