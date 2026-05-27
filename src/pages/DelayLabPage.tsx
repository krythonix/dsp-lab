import { WaveformScope } from '../components/WaveformScope'
import { DelayFlowDiagram, DelayTimeline } from '../diagrams/DelayLabDiagrams'
import { useDelayEngine } from '../hooks/useDelayEngine'

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

export function DelayLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useDelayEngine()

  return (
    <main className="page">
      <header className="hero">
        <h1>Delay Lab</h1>
        <p>
          A real echo effect: the dry guitar passes through unchanged while a copy is stored, delayed,
          and mixed back — feedback sends part of the echo back for repeats.
        </p>
      </header>

      <section className="section">
        <h2>Signal flow</h2>
        <p className="lead">Linear time effect — no clipping. The wave shape stays the same; copies arrive later.</p>
        <DelayFlowDiagram delayMs={params.delayMs} feedback={params.feedback} mix={params.mix} />
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
                Start the clean sample to hear echoes clearly. Try slapback (~120 ms), rhythm delay (~300 ms),
                or long ambience (~600 ms).
              </p>
            )}

            <Slider
              label="Delay time"
              value={params.delayMs}
              min={80}
              max={800}
              step={10}
              display={`${params.delayMs} ms`}
              onChange={(delayMs) => setParams({ delayMs })}
            />
            <Slider
              label="Feedback"
              value={params.feedback}
              min={0}
              max={0.85}
              step={0.01}
              display={`${Math.round(params.feedback * 100)}%`}
              onChange={(feedback) => setParams({ feedback })}
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
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#34d399" label="Output waveform" />
            <DelayTimeline delayMs={params.delayMs} feedback={params.feedback} isActive={isActive} />
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
              <p>One copy goes straight to the output; another enters the delay line.</p>
              <pre className="formula-block">dry = input × (1 − mix)</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">2</span>
            <div>
              <h3>Delay line</h3>
              <p>Web Audio <code>DelayNode</code> holds samples and releases them after the set time.</p>
              <pre className="formula-block">wet = delayed(input, delayTime)</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">3</span>
            <div>
              <h3>Feedback</h3>
              <p>Part of the delayed signal feeds back into the delay for repeating echoes.</p>
              <pre className="formula-block">delayInput = input + feedback × delayed</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">4</span>
            <div>
              <h3>Mix</h3>
              <p>Dry and wet are summed — you hear the note plus its echo.</p>
              <pre className="formula-block">out = dry + wet × mix</pre>
            </div>
          </li>
        </ol>
      </section>
    </main>
  )
}
