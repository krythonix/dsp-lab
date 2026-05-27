import { getConcept, getConceptNav } from '../content/concepts'
import { ConceptDiagram, ChorusFlowDiagram } from '../diagrams/ConceptDiagrams'
import { navigate } from '../navigation'

type ConceptDetailPageProps = {
  slug: string
}

export function ConceptDetailPage({ slug }: ConceptDetailPageProps) {
  const concept = getConcept(slug)
  const { prev, next } = getConceptNav(slug)

  if (!concept) {
    return (
      <main className="page">
        <header className="hero">
          <h1>Concept not found</h1>
          <p>
            <button type="button" className="text-link" onClick={() => navigate({ type: 'map' })}>
              ← Back to concept map
            </button>
          </p>
        </header>
      </main>
    )
  }

  return (
    <main className="page">
      <nav className="breadcrumb">
        <button type="button" className="text-link" onClick={() => navigate({ type: 'map' })}>
          10 Concepts
        </button>
        <span aria-hidden="true"> / </span>
        <span>{concept.name}</span>
      </nav>

      <header className="hero">
        {concept.num !== null && (
          <p className="concept-badge">
            {concept.category === 'bonus' ? 'Bonus' : `Concept ${concept.num}`}
          </p>
        )}
        {concept.num === null && concept.category === 'bonus' && (
          <p className="concept-badge concept-badge--bonus">Bonus</p>
        )}
        <h1>{concept.name}</h1>
        <p>{concept.tagline}</p>
        {concept.slug === 'harmonics' && (
          <p style={{ marginTop: 12 }}>
            <button type="button" className="text-link" onClick={() => navigate({ type: 'harmonics' })}>
              Open the full Harmonics visual guide →
            </button>
          </p>
        )}
      </header>

      <section className="section">
        <ConceptDiagram id={concept.diagram} />
        {concept.slug === 'dry-wet' && (
          <div style={{ marginTop: 16 }}>
            <ChorusFlowDiagram />
          </div>
        )}
      </section>

      {concept.sections.map((section) => (
        <section key={section.title} className="section">
          <h2>{section.title}</h2>
          {section.paragraphs.map((p, i) => (
            <p key={i} className="lead">
              {p}
            </p>
          ))}
          {section.bullets && (
            <ul className="detail-list">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {concept.formula && (
        <section className="section">
          <h2>In code / math terms</h2>
          <pre className="formula-block">{concept.formula}</pre>
        </section>
      )}

      <section className="section">
        <h2>Guitar examples</h2>
        <ul className="detail-list">
          {concept.guitarExamples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      </section>

      {concept.commonMistakes && (
        <section className="section">
          <h2>Common mistakes</h2>
          <ul className="detail-list detail-list--warn">
            {concept.commonMistakes.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>
      )}

      {concept.related.length > 0 && (
        <section className="section">
          <h2>Related concepts</h2>
          <div className="related-links">
            {concept.related.map((rel) => {
              const related = getConcept(rel)
              if (!related) return null
              return (
                <button
                  key={rel}
                  type="button"
                  className="related-link"
                  onClick={() => navigate({ type: 'concept', slug: rel })}
                >
                  {related.name}
                </button>
              )
            })}
          </div>
        </section>
      )}

      <nav className="concept-pager">
        {prev ? (
          <button type="button" className="pager-btn" onClick={() => navigate({ type: 'concept', slug: prev.slug })}>
            ← {prev.name}
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button type="button" className="pager-btn pager-btn--next" onClick={() => navigate({ type: 'concept', slug: next.slug })}>
            {next.name} →
          </button>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
