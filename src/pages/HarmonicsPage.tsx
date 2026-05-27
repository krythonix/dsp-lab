import { HarmonicsDiagram } from '../diagrams/ConceptDiagrams'
import {
  HarmonicFusionDiagram,
  HarmonicSeriesDiagram,
  HarmonicStackDiagram,
  OddEvenHarmonicsDiagram,
} from '../diagrams/HarmonicsPageDiagrams'
import { navigate } from '../navigation'

export function HarmonicsPage() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Harmonics — Visual Guide</h1>
        <p>
          Harmonics are extra frequencies stacked on your note. They define timbre — warm, bright,
          buzzy — and clipping adds more of them. This is where much of guitar “tone” lives.
        </p>
      </header>

      <section className="section">
        <h2>1. What is a harmonic?</h2>
        <p className="lead">
          When you play a note, you hear one pitch — the <strong>fundamental</strong>. But the string
          (or circuit) also produces energy at integer multiples of that frequency. Those multiples
          are <strong>harmonics</strong> (also called overtones).
        </p>
        <HarmonicSeriesDiagram />
        <p className="lead">
          Formula: harmonic frequency = fundamental × <em>n</em>, where <em>n</em> is 2, 3, 4, 5…
        </p>
      </section>

      <section className="section">
        <h2>2. Are harmonics also “A” in our example?</h2>
        <p className="lead">
          Play <strong>A at 110 Hz</strong>. Your ear usually hears <strong>one note: A</strong> — not
          a chord. All harmonics belong to the <strong>harmonic series of A</strong>, but they are not
          all the letter A by name.
        </p>
        <div className="callout">
          <p>
            <strong>Octave harmonics (2nd, 4th, 8th…)</strong> → still <strong>A</strong> (higher octaves)
          </p>
          <p>
            <strong>Other harmonics (3rd, 5th, 7th…)</strong> → <strong>E, C♯, G…</strong> — different
            note names, but still overtones <em>of</em> your A
          </p>
        </div>
        <p className="lead">
          Think of them as tints of the same root pitch, not separate melody notes. Your brain{' '}
          <strong>fuses</strong> fundamental + harmonics into one perceived pitch (A at 110 Hz) while
          using the harmonic balance to judge timbre.
        </p>
        <HarmonicFusionDiagram />
      </section>

      <section className="section">
        <h2>3. Strength of each harmonic</h2>
        <p className="lead">
          A real guitar string does not produce harmonics at equal volume. Lower harmonics are usually
          stronger; high harmonics fade out. Change that recipe — with pickup, amp, or clipper — and
          the character changes even on the same fretted note.
        </p>
        <HarmonicStackDiagram />
      </section>

      <section className="section">
        <h2>4. Why clipping creates harmonics</h2>
        <p className="lead">
          A pure sine wave has only the fundamental — no harmonics. Flatten the peaks (clip) and the
          wave is no longer a sine. Mathematically it equals many sine waves added together — new
          harmonics. More clipping → stronger harmonics → more distortion heard.
        </p>
        <HarmonicsDiagram />
      </section>

      <section className="section">
        <h2>5. Odd vs even harmonics</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Examples</th>
              <th>Character</th>
              <th>Typical source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Even (2nd, 4th…)</td>
              <td>Octaves of the fundamental</td>
              <td>Sweet, full, vocal, creamy</td>
              <td>Asymmetric clip, some tube stages</td>
            </tr>
            <tr>
              <td>Odd (3rd, 5th…)</td>
              <td>5th, 7th partials in the series</td>
              <td>Edgy, hollow, aggressive, buzzy</td>
              <td>Symmetric hard clip, fuzz, square waves</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 16 }}>
          <OddEvenHarmonicsDiagram />
        </div>
      </section>

      <section className="section">
        <h2>6. Harmonics and guitar effects</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Tone</th>
              <th>Harmonic content</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Clean</td>
              <td>Mostly fundamental, gentle natural overtones</td>
            </tr>
            <tr>
              <td>Overdrive</td>
              <td>Moderate harmonics — warm 2nd and 3rd</td>
            </tr>
            <tr>
              <td>Distortion</td>
              <td>Strong harmonics — dense, compressed</td>
            </tr>
            <tr>
              <td>Fuzz</td>
              <td>Very strong odd harmonics — buzzy, square-like</td>
            </tr>
            <tr>
              <td>Tone knob after drive</td>
              <td>Filter removes harsh <em>upper</em> harmonics (not the fundamental)</td>
            </tr>
          </tbody>
        </table>
        <p className="lead" style={{ marginTop: 16 }}>
          Chorus and delay do <em>not</em> add harmonics by clipping — they copy and shift the signal
          in time. Any harmonics you hear are already in the source tone.
        </p>
      </section>

      <section className="section">
        <h2>7. Not the same as “natural harmonics” on guitar</h2>
        <p className="lead">
          Touching a node at the 12th fret to get a bell-like tone is also called playing{' '}
          <strong>harmonics</strong> — same physics (emphasizing overtones), different technique. DSP
          harmonics from clipping mean: the waveform contains more partials, not necessarily that you
          played a harmonic at the fretboard.
        </p>
      </section>

      <section className="section">
        <h2>Related guides</h2>
        <dl className="glossary">
          <div>
            <dt>
              <button type="button" className="text-link" onClick={() => navigate({ type: 'concept', slug: 'harmonics' })}>
                Concept 5 — Harmonics (short guide)
              </button>
            </dt>
            <dd>Part of the 10-concept learning path.</dd>
          </div>
          <div>
            <dt>
              <button type="button" className="text-link" onClick={() => navigate({ type: 'overdrive' })}>
                Overdrive &amp; Distortion
              </button>
            </dt>
            <dd>How clipping creates harmonics in waveforms and transfer curves.</dd>
          </div>
          <div>
            <dt>
              <button type="button" className="text-link" onClick={() => navigate({ type: 'fuzz-chorus' })}>
                Fuzz &amp; Chorus
              </button>
            </dt>
            <dd>Fuzz = odd harmonics from hard clip; chorus = no new harmonics.</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
