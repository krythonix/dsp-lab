import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createPhaserGraph, defaultPhaserParams, type ModMode } from '../audio/phaser'
import { useLabEngine } from '../hooks/useLabEngine'

export function PhaserLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createPhaserGraph, defaultPhaserParams)

  return (
    <main className="page">
      <header className="hero">
        <h1>Phaser &amp; Flanger Lab</h1>
        <p>Two modulation cousins: phaser sweeps all-pass filter notches; flanger uses a short delay with feedback and LFO.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Switch between phaser and flanger — flanger needs more feedback for the jet-plane sweep."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <fieldset className="pedal-fieldset">
              <legend>Mode</legend>
              {(['phaser', 'flanger'] as ModMode[]).map((mode) => (
                <label key={mode} className="pedal-radio">
                  <input type="radio" name="modMode" checked={params.mode === mode} onChange={() => setParams({ mode })} />
                  {mode === 'phaser' ? 'Phaser' : 'Flanger'}
                </label>
              ))}
            </fieldset>
            <PedalSlider label="Rate" value={params.rateHz} min={0.1} max={3} step={0.1} display={`${params.rateHz.toFixed(1)} Hz`} onChange={(rateHz) => setParams({ rateHz })} />
            <PedalSlider label="Depth" value={params.depth} min={0.1} max={1} step={0.01} display={`${Math.round(params.depth * 100)}%`} onChange={(depth) => setParams({ depth })} />
            {params.mode === 'phaser' && (
              <PedalSlider label="Center" value={params.centerHz} min={300} max={1400} step={10} display={`${params.centerHz} Hz`} onChange={(centerHz) => setParams({ centerHz })} />
            )}
            {params.mode === 'flanger' && (
              <PedalSlider label="Feedback" value={params.feedback} min={0} max={0.85} step={0.01} display={`${Math.round(params.feedback * 100)}%`} onChange={(feedback) => setParams({ feedback })} />
            )}
            <PedalSlider label="Mix" value={params.mix} min={0} max={1} step={0.01} display={`${Math.round(params.mix * 100)}%`} onChange={(mix) => setParams({ mix })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#34d399" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'Phaser', body: 'Stack of all-pass filters with LFO on frequency — creates moving notches.', formula: 'allpass + LFO → phase shift' },
          { title: 'Flanger', body: 'Very short delay + feedback + LFO — stronger, metallic sweep.', formula: 'delay 2–8 ms + feedback' },
        ]} />
      </section>
    </main>
  )
}
