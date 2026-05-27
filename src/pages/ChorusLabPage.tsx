import { WaveformScope } from '../components/WaveformScope'
import { ChorusFlowDiagram, ChorusLfoDiagram } from '../diagrams/ChorusLabDiagrams'
import { delayRangeMs } from '../audio/chorus'
import { useChorusEngine } from '../hooks/useChorusEngine'

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display?: string
}) {
  return (
    <label className="pedal-control">
      <span className="pedal-control__label">
        {label}
        {display !== undefined && <span className="pedal-control__value">{display}</span>}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

export function ChorusLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useChorusEngine()
  const { min, max } = delayRangeMs(params.centerMs, params.depthMs)

  return (
    <main className="page">
      <header className="hero">
        <h1>Chorus Lab</h1>
        <p>
          A real chorus effect: the dry guitar stays put while a short delayed copy is mixed in. An LFO
          slowly moves that delay time — the pitch wobble thickens the sound without obvious echoes.
        </p>
      </header>

      <section className="section">
        <h2>Signal flow</h2>
        <p className="lead">
          Linear time effect like delay, but with a very short delay and no feedback — the LFO is the star.
        </p>
        <ChorusFlowDiagram
          centerMs={params.centerMs}
          depthMs={params.depthMs}
          rateHz={params.rateHz}
          mix={params.mix}
        />
      </section>

      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <div className="pedal-actions">
              <button type="button" className="pedal-btn" onClick={startDemoSong} disabled={source === 'demo'}>
                Clean guitar sample
              </button>
              <button type="button" className="pedal-btn" onClick={startGuitarInput} disabled={source === 'input'}>
                Guitar / mic in
              </button>
              <button type="button" className="pedal-btn pedal-btn--stop" onClick={stop} disabled={!isActive}>
                Stop
              </button>
            </div>

            {error && <p className="pedal-error">{error}</p>}
            {isActive && (
              <p className="pedal-status">
                Playing: <strong>{source === 'demo' ? 'Clean guitar recording (loops)' : 'Live input'}</strong>
              </p>
            )}

            {!isActive && (
              <p className="pedal-hint">
                Start the clean sample to hear the shimmer. Try slow rate + moderate depth for classic chorus, or
                faster rate for vibrato-like motion.
              </p>
            )}

            <Slider
              label="Center delay"
              value={params.centerMs}
              min={12}
              max={40}
              step={1}
              display={`${params.centerMs} ms (${min}–${max} ms sweep)`}
              onChange={(centerMs) => setParams({ centerMs })}
            />
            <Slider
              label="Depth"
              value={params.depthMs}
              min={1}
              max={14}
              step={0.5}
              display={`±${params.depthMs} ms`}
              onChange={(depthMs) => setParams({ depthMs })}
            />
            <Slider
              label="Rate (LFO)"
              value={params.rateHz}
              min={0.2}
              max={3}
              step={0.1}
              display={`${params.rateHz.toFixed(1)} Hz`}
              onChange={(rateHz) => setParams({ rateHz })}
            />
            <Slider
              label="Mix (wet)"
              value={params.mix}
              min={0}
              max={1}
              step={0.01}
              display={`${Math.round(params.mix * 100)}%`}
              onChange={(mix) => setParams({ mix })}
            />
            <Slider
              label="Output"
              value={params.output}
              min={0}
              max={1}
              step={0.01}
              display={`${Math.round(params.output * 100)}%`}
              onChange={(output) => setParams({ output })}
            />
          </div>

          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#a78bfa" label="Output waveform" />
            <ChorusLfoDiagram
              centerMs={params.centerMs}
              depthMs={params.depthMs}
              rateHz={params.rateHz}
              isActive={isActive}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What the code does</h2>
        <ol className="detail-list code-steps">
          <li className="concept-card">
            <span className="concept-card__num">1</span>
            <div>
              <h3>Split dry / wet</h3>
              <p>Same as delay — one copy stays immediate, one enters a short delay line.</p>
              <pre className="formula-block">dry = input × (1 − mix)</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">2</span>
            <div>
              <h3>Short delay line</h3>
              <p>Chorus uses ~10–40 ms delays — too short to hear as a separate echo.</p>
              <pre className="formula-block">wet = delayed(input, centerDelay)</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">3</span>
            <div>
              <h3>LFO on delay time</h3>
              <p>
                An oscillator modulates <code>DelayNode.delayTime</code> — moving delay = subtle pitch shift.
              </p>
              <pre className="formula-block">delayTime = center + depth × sin(LFO)</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">4</span>
            <div>
              <h3>Mix</h3>
              <p>Dry and shifting wet combine into the wide, shimmery chorus tone.</p>
              <pre className="formula-block">out = dry + wet × mix</pre>
            </div>
          </li>
        </ol>
      </section>
    </main>
  )
}
