import { ChorusDiagram } from '../diagrams/ChorusDiagram'
import { ChorusFlowDiagram } from '../diagrams/ChorusFlowDiagram'
import { FuzzFlowDiagram } from '../diagrams/FuzzFlowDiagram'
import { FuzzTransferCurveDiagram } from '../diagrams/FuzzTransferCurveDiagram'
import { FuzzWaveformDiagram } from '../diagrams/FuzzWaveformDiagram'
import { navigate } from '../navigation'

export function FuzzChorusPage() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Fuzz &amp; Chorus — Visual Guide</h1>
        <p>
          Two classic guitar effects that work very differently: fuzz is heavy clipping that squashes
          each sample; chorus copies the signal and moves a delayed version against the original — no
          clipping at all. Try the live chorus in{' '}
          <button type="button" className="text-link" onClick={() => navigate({ type: 'chorus-lab' })}>
            Chorus Lab
          </button>
          .
        </p>
      </header>

      <section className="section">
        <h2>1. Fuzz — what happens to the signal</h2>
        <p className="lead">
          Fuzz is clipping — just more extreme than overdrive or distortion. The circuit (or DSP) pushes
          the wave so hard that the peaks flatten into a square-ish shape (hard clip territory). That
          adds strong odd harmonics — the buzzy, woolly tone heard on classic psychedelic and garage
          rock records.
        </p>
        <FuzzFlowDiagram />
        <div className="grid-2" style={{ marginTop: 16 }}>
          <FuzzWaveformDiagram />
          <FuzzTransferCurveDiagram />
        </div>
        <p className="lead" style={{ marginTop: 20, marginBottom: 0 }}>
          In code terms: each input sample <code>x</code> becomes something like{' '}
          <code>sign(x) × (1 − exp(−|x|))</code> — output slams to ±1 quickly and stays there. That
          flat ceiling <em>is</em> clipping. Overdrive clips too, but with a gentler <code>tanh</code>{' '}
          bend; fuzz clips harder, closer to a square wave.
        </p>
      </section>

      <section className="section">
        <h2>2. Chorus — what happens to the signal</h2>
        <p className="lead">
          Chorus is a time-based effect, not a clipper. The input is duplicated: one copy
          stays dry, the other is delayed by roughly 10–30 ms. A low-frequency oscillator (LFO) slowly
          wiggles that delay time. Mixing dry + wet makes the pitch seem to shimmer — like two instruments
          slightly out of sync.
        </p>
        <ChorusFlowDiagram />
        <div style={{ marginTop: 16 }}>
          <ChorusDiagram />
        </div>
        <p className="lead" style={{ marginTop: 20, marginBottom: 0 }}>
          In code terms: <code>output = dry × (1 − mix) + delay(input, time + LFO) × mix</code>.
          The LFO might run at 0.5–2 Hz — far below audio frequencies — so you hear motion, not a new note.
        </p>
      </section>

      <section className="section">
        <h2>3. Fuzz vs chorus at a glance</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Fuzz</th>
              <th>Chorus</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Effect type</td>
              <td>Nonlinear (waveshaping)</td>
              <td>Linear time effect (delay + mix)</td>
            </tr>
            <tr>
              <td>Clipping?</td>
              <td>Yes — hard, aggressive clip</td>
              <td>No — signal level stays linear</td>
            </tr>
            <tr>
              <td>What changes</td>
              <td>Wave shape — flat, square tops</td>
              <td>Timing — slight offset between copies</td>
            </tr>
            <tr>
              <td>Core math</td>
              <td>Hard waveshaping / clip per sample</td>
              <td>Delay buffer + LFO modulation</td>
            </tr>
            <tr>
              <td>Harmonics</td>
              <td>Many strong odd harmonics</td>
              <td>No new harmonics from clipping — pitch shimmer from interference</td>
            </tr>
            <tr>
              <td>Typical sound</td>
              <td>Fuzzy, thick, aggressive</td>
              <td>Wide, shimmery, “double-tracked”</td>
            </tr>
            <tr>
              <td>Classic examples</td>
              <td>Hendrix “Purple Haze”, Smashing Pumpkins rhythm</td>
              <td>80s clean guitar, 12-string shimmer, Nirvana “Come As You Are”</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>4. Key terms</h2>
        <dl className="glossary">
          <div>
            <dt>Saturation / waveshaping</dt>
            <dd>Mapping input samples through a nonlinear curve — the basis of fuzz and drive.</dd>
          </div>
          <div>
            <dt>Odd harmonics</dt>
            <dd>Extra frequencies at odd multiples of the note — square-ish waves are rich in these, which is why fuzz sounds buzzy.</dd>
          </div>
          <div>
            <dt>Delay line</dt>
            <dd>A buffer that holds past samples and plays them back later — the core of chorus, echo, and reverb.</dd>
          </div>
          <div>
            <dt>LFO (low-frequency oscillator)</dt>
            <dd>A slow cyclic control signal (usually below 20 Hz) that modulates delay time, volume, or filter cutoff.</dd>
          </div>
          <div>
            <dt>Dry / wet mix</dt>
            <dd>Blending the unaffected signal (dry) with the processed copy (wet). Chorus needs both to create its width.</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
