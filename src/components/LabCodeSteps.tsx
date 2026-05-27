export function LabCodeSteps({ steps }: { steps: { title: string; body: string; formula?: string }[] }) {
  return (
    <ol className="detail-list code-steps">
      {steps.map((step, i) => (
        <li key={step.title} className="concept-card">
          <span className="concept-card__num">{i + 1}</span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            {step.formula && <pre className="formula-block">{step.formula}</pre>}
          </div>
        </li>
      ))}
    </ol>
  )
}
