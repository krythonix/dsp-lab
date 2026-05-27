import { SignalFlowDiagram } from '../diagrams/SignalFlowDiagram'
import { TransferCurveDiagram } from '../diagrams/TransferCurveDiagram'
import { WaveformDiagram } from '../diagrams/WaveformDiagram'
import { navigate } from '../navigation'

export function OverdrivePage() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Overdrive &amp; Distortion — Visual Guide</h1>
        <p>
          A beginner-friendly look at how guitar overdrive and distortion work in DSP.
          Both effects clip the signal; the difference is how sharply the wave gets squashed.
          Try the live effect in{' '}
          <button type="button" className="text-link" onClick={() => navigate({ type: 'distortion-lab' })}>
            Distortion Lab
          </button>
          .
        </p>
      </header>

      <section className="section">
        <h2>1. Signal flow</h2>
        <p className="lead">
          Every sample passes through a chain. Gain pushes the signal louder, then the waveshaper
          applies nonlinear shaping — that is the heart of the effect.
        </p>
        <SignalFlowDiagram />
      </section>

      <section className="section">
        <h2>2. What clipping looks like</h2>
        <p className="lead">
          A clean sine wave stays smooth. Overdrive rounds the peaks (soft clip). Distortion chops
          them flat (hard clip). Those flat tops add new frequencies called harmonics.
        </p>
        <div className="grid-2">
          <WaveformDiagram type="clean" title="Clean — linear, no clipping" color="#60a5fa" />
          <WaveformDiagram type="soft" title="Overdrive — soft clipping (tanh curve)" color="#fbbf24" />
        </div>
        <div style={{ marginTop: 16 }}>
          <WaveformDiagram type="hard" title="Distortion — hard clipping (signal clamped to ±1)" color="#f87171" />
        </div>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: '#60a5fa' }} />
            Clean
          </span>
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: '#fbbf24' }} />
            Soft clip (overdrive)
          </span>
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: '#f87171' }} />
            Hard clip (distortion)
          </span>
        </div>
      </section>

      <section className="section">
        <h2>3. Transfer functions (input → output)</h2>
        <p className="lead">
          In DSP, the waveshaper is a function: for each input sample, it computes one output sample.
          Linear processing follows a straight line. Nonlinear curves bend and limit the signal.
        </p>
        <div className="grid-2">
          <TransferCurveDiagram type="linear" title="Linear — volume only (y = gain × x)" color="#60a5fa" />
          <TransferCurveDiagram type="soft" title="Soft clip — gradual bend (overdrive)" color="#fbbf24" />
        </div>
        <div style={{ marginTop: 16 }}>
          <TransferCurveDiagram type="hard" title="Hard clip — flat ceiling (distortion)" color="#f87171" />
        </div>
      </section>

      <section className="section">
        <h2>4. Side-by-side comparison</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Overdrive</th>
              <th>Distortion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Clipping type</td>
              <td>Soft — rounded, gradual</td>
              <td>Hard — sharp, immediate</td>
            </tr>
            <tr>
              <td>Typical math</td>
              <td>tanh(x × drive)</td>
              <td>clamp(x × drive, −1, +1)</td>
            </tr>
            <tr>
              <td>Dynamics</td>
              <td>More — harder picking = more grit</td>
              <td>Less — signal feels compressed</td>
            </tr>
            <tr>
              <td>Harmonics</td>
              <td>Smoother mix, warmer tone</td>
              <td>Stronger, buzzier harmonics</td>
            </tr>
            <tr>
              <td>Character</td>
              <td>Tube-amp breakup</td>
              <td>Aggressive saturation</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>5. Key terms</h2>
        <dl className="glossary">
          <div>
            <dt>Sample</dt>
            <dd>One tiny slice of audio at a single moment in time.</dd>
          </div>
          <div>
            <dt>Linear</dt>
            <dd>Output scales proportionally with input — like turning up volume.</dd>
          </div>
          <div>
            <dt>Nonlinear / waveshaping</dt>
            <dd>Output does not scale proportionally — this is where saturation lives.</dd>
          </div>
          <div>
            <dt>Harmonics</dt>
            <dd>Extra frequencies created when a wave is clipped — they give the “grit.”</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
