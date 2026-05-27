import { bonusConcepts, concepts, coreConcepts } from '../content/concepts'
import { DspMapDiagram } from '../diagrams/DspMapDiagram'
import { navigate, navMenu } from '../navigation'

const comparisonsGroup = navMenu.find((group) => group.id === 'comparisons')
const labsGroup = navMenu.find((group) => group.id === 'labs')

const laterTopics = [
  { name: 'Fourier / frequency analysis', why: 'Deep filter design, spectral effects' },
  { name: 'Z-transform & biquads', why: 'Formal filter math' },
  { name: 'Aliasing & oversampling', why: 'High-gain digital modeling' },
  { name: 'Convolution', why: 'Cab sims, IR reverb' },
  { name: 'State-space & virtual analog', why: 'Component-level amp modeling' },
]

const effectLookup = [
  { effect: 'Overdrive', needs: 'Clipping (soft), harmonics, signal flow' },
  { effect: 'Distortion', needs: 'Clipping (hard), harmonics' },
  { effect: 'Fuzz', needs: 'Clipping (extreme), harmonics, filter' },
  { effect: 'Chorus', needs: 'Delay, dry/wet, LFO' },
  { effect: 'Delay / echo', needs: 'Delay line, dry/wet' },
  { effect: 'Reverb', needs: 'Many delays + mix (same family as #7–8)' },
  { effect: 'Tremolo', needs: 'LFO, gain (linear)' },
  { effect: 'Wah', needs: 'Filter, LFO or manual control' },
  { effect: 'Compressor', needs: 'Dynamics (envelope), signal flow' },
  { effect: 'Noise gate', needs: 'Dynamics (threshold), signal flow' },
]

export function DspMapPage() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Guitar DSP — 10 Concepts to Start</h1>
        <p>
          You do not need the whole DSP textbook to understand guitar tone. These ten ideas cover
          most pedals and amp behavior — click any concept for the full guide.
        </p>
      </header>

      <section className="section">
        <h2>The map</h2>
        <p className="lead">
          Two paths from the same starting point: nonlinear effects (drive family) and time-based
          effects (modulation / ambience). Filters sit in both worlds.
        </p>
        <DspMapDiagram />
      </section>

      <section className="section">
        <h2>Learn in this order</h2>
        <ol className="concept-list">
          {coreConcepts.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                className="concept-card concept-card--link"
                onClick={() => navigate({ type: 'concept', slug: c.slug })}
              >
                <span className="concept-card__num">{c.num}</span>
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <p className="concept-card__cta">Read full guide →</p>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2>Bonus guides</h2>
        <ol className="concept-list">
          {bonusConcepts.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                className="concept-card concept-card--link concept-card--bonus"
                onClick={() => navigate({ type: 'concept', slug: c.slug })}
              >
                <span className="concept-card__num">+</span>
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                  <p className="concept-card__cta">Read full guide →</p>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2>Which concepts power which effects?</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Effect</th>
              <th>Core concepts</th>
            </tr>
          </thead>
          <tbody>
            {effectLookup.map((row) => (
              <tr key={row.effect}>
                <td>{row.effect}</td>
                <td>{row.needs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>All concept pages ({concepts.length})</h2>
        <div className="concept-grid">
          {concepts.map((c) => (
            <button
              key={c.slug}
              type="button"
              className="concept-grid__item"
              onClick={() => navigate({ type: 'concept', slug: c.slug })}
            >
              {c.num !== null ? `${c.num}. ` : '+ '}
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Ignore for now (Layer 2)</h2>
        <p className="lead">
          Useful when building plugins or studying formally — not required to understand tone or use
          your visualizer pages.
        </p>
        <ul className="later-list">
          {laterTopics.map((t) => (
            <li key={t.name}>
              <strong>{t.name}</strong>
              <span>{t.why}</span>
            </li>
          ))}
        </ul>
      </section>

      {comparisonsGroup && (
        <section className="section">
          <h2>Comparison guides</h2>
          <p className="lead">Visual side-by-side guides — waveforms, transfer curves, and signal flow.</p>
          <ul className="concept-list">
            {comparisonsGroup.items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="concept-card concept-card--link"
                  onClick={() => navigate(item.route)}
                >
                  <span className="concept-card__num">{item.icon}</span>
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                    <p className="concept-card__cta">Open guide →</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {labsGroup && (
        <section className="section">
          <h2>Interactive labs</h2>
          <p className="lead">Hands-on Web Audio demos — tweak controls and hear the result in real time.</p>
          <ul className="concept-list">
            {labsGroup.items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className="concept-card concept-card--link"
                  onClick={() => navigate(item.route)}
                >
                  <span className="concept-card__num">{item.icon}</span>
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                    <p className="concept-card__cta">Open lab →</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
