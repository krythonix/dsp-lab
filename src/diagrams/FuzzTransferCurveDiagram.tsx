function fuzzCurve(x: number): number {
  const driven = x * 2.8
  return Math.sign(driven) * (1 - Math.exp(-Math.abs(driven)))
}

function buildCurve(size: number, padding: number): string {
  const inner = size - padding * 2
  const steps = 120
  const points: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const input = t * 2 - 1
    const output = fuzzCurve(input)
    const x = padding + (input + 1) * 0.5 * inner
    const y = padding + (1 - output) * 0.5 * inner
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}

export function FuzzTransferCurveDiagram() {
  const size = 220
  const padding = 28

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size} role="img" aria-label="Fuzz transfer curve">
        <line x1={padding} y1={size - padding} x2={size - padding} y2={size - padding} stroke="#2a2724" />
        <line x1={padding} y1={padding} x2={padding} y2={size - padding} stroke="#2a2724" />
        <line
          x1={padding}
          y1={size - padding}
          x2={size - padding}
          y2={padding}
          stroke="#2a2724"
          strokeDasharray="4 4"
          opacity={0.5}
        />
        <path d={buildCurve(size, padding)} fill="none" stroke="#c084fc" strokeWidth={2.5} />
        <text x={size / 2 - 18} y={size - 8} fill="#78716c" fontSize={11}>
          input
        </text>
        <text
          x={10}
          y={size / 2}
          fill="#78716c"
          fontSize={11}
          transform={`rotate(-90 10 ${size / 2})`}
        >
          output
        </text>
      </svg>
      <figcaption>
        Fuzz transfer curve — same idea as hard clip: output hits ±1 and stays flat
      </figcaption>
    </figure>
  )
}
