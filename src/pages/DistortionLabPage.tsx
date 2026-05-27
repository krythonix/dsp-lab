import { DraggableTransferCurve } from '../components/DraggableTransferCurve'
import { WaveformScope } from '../components/WaveformScope'
import { useDistortionEngine } from '../hooks/useDistortionEngine'
import type { ClipType } from '../audio/distortion'
import { presetCurvePoints } from '../audio/distortion'
import { SignalFlowDiagram } from '../diagrams/SignalFlowDiagram'

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

export function DistortionLabPage() {
  const {
    params,
    setParams,
    isActive,
    source,
    error,
    startDemoSong,
    startGuitarInput,
    stop,
    getAnalyser,
  } = useDistortionEngine()

  const clipLabels: Record<ClipType, string> = {
    soft: 'Soft (overdrive)',
    hard: 'Hard (distortion)',
    fuzz: 'Fuzz',
  }

  const clipHints: Record<ClipType, string> = {
    soft: 'Rounded curve — warmer, more note dynamics. Try drive 8–14.',
    hard: 'Flat tops — tight rock distortion. Sweet spot ~5–10.',
    fuzz: 'Square-ish — buzzy and compressed. Try drive 4–8.',
  }

  return (
    <main className="page">
      <header className="hero">
        <h1>Distortion Lab</h1>
        <p>
          A real DSP distortion effect built with the Web Audio API: input gain → waveshaper → tone
          filter → output. Hear hard clipping and watch the waveform flatten live.
        </p>
      </header>

      <section className="section">
        <h2>Signal chain</h2>
        <p className="lead">Same structure as a physical pedal — gain pushes the signal into the clipper.</p>
        <SignalFlowDiagram />
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
                Playing:{' '}
                <strong>
                  {source === 'demo'
                    ? 'Clean guitar recording (loops)'
                    : 'Live input'}
                </strong>
              </p>
            )}

            {!isActive && (
              <p className="pedal-hint">
                No audio until you press Clean guitar sample or Guitar / mic in. The sample is a
                real clean guitar recording — distortion is applied in real time.
              </p>
            )}

            <label className="pedal-control pedal-control--toggle">
              <input
                type="checkbox"
                checked={params.bypass}
                onChange={(e) => setParams({ bypass: e.target.checked })}
              />
              Bypass (clean)
            </label>

            <fieldset className="pedal-fieldset">
              <legend>Clip type</legend>
              {(['soft', 'hard', 'fuzz'] as ClipType[]).map((type) => (
                <label key={type} className="pedal-radio">
                  <input
                    type="radio"
                    name="clipType"
                    checked={params.clipType === type}
                    onChange={() => setParams({ clipType: type })}
                  />
                  {clipLabels[type]}
                </label>
              ))}
            </fieldset>
            <p className="pedal-hint">{clipHints[params.clipType]} Presets reload the curve — drag handles to customize.</p>

            <button
              type="button"
              className="pedal-btn"
              onClick={() => setParams({ curvePoints: presetCurvePoints(params.clipType, params.drive) })}
            >
              Reset curve
            </button>

            <Slider
              label="Drive"
              value={params.drive}
              min={1}
              max={20}
              step={0.5}
              display={params.drive.toFixed(1)}
              onChange={(drive) => setParams({ drive })}
            />
            <Slider
              label="Tone"
              value={params.tone}
              min={0}
              max={1}
              step={0.01}
              display={`${Math.round(params.tone * 100)}%`}
              onChange={(tone) => setParams({ tone })}
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
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} />
            <DraggableTransferCurve
              points={params.curvePoints}
              bypass={params.bypass}
              onChange={(curvePoints) => setParams({ curvePoints })}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What the code does</h2>
        <p className="lead">Each audio sample passes through this pipeline in real time:</p>
        <ol className="detail-list code-steps">
          <li className="concept-card">
            <span className="concept-card__num">1</span>
            <div>
              <h3>Input gain</h3>
              <p>Multiply sample by drive — pushes peaks toward the clipper.</p>
              <pre className="formula-block">sample × drive</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">2</span>
            <div>
              <h3>Waveshaper (hard clip for distortion)</h3>
              <p>Web Audio <code>WaveShaperNode</code> applies a lookup curve per sample.</p>
              <pre className="formula-block">clamp(sample × drive, −1, 1)</pre>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">3</span>
            <div>
              <h3>Tone filter</h3>
              <p>Low-pass removes harsh harmonics after clipping — like a pedal tone knob.</p>
            </div>
          </li>
          <li className="concept-card">
            <span className="concept-card__num">4</span>
            <div>
              <h3>Output gain</h3>
              <p>Sets final level to your speakers or headphones.</p>
            </div>
          </li>
        </ol>
      </section>
    </main>
  )
}
