function sampleClean(t: number): number {
  return Math.sin(t * Math.PI * 2)
}

function sampleFuzz(t: number): number {
  const driven = sampleClean(t) * 6
  return Math.sign(driven) * (1 - Math.exp(-Math.abs(driven * 1.1)))
}

function buildPath(sample: (t: number) => number, width: number, height: number, amplitude: number): string {
  const midY = height / 2
  const steps = 200
  const points: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = t * width
    const y = midY - sample(t) * amplitude
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}

export function FuzzWaveformDiagram() {
  const width = 320
  const height = 120
  const amplitude = 40
  const midY = height / 2

  return (
    <figure className="diagram-card">
      <svg
        viewBox={`0 0 ${width * 2 + 24} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label="Clean vs fuzz waveform comparison"
      >
        <g transform="translate(0, 0)">
          <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" strokeWidth={1} />
          <path d={buildPath(sampleClean, width, height, amplitude)} fill="none" stroke="#60a5fa" strokeWidth={2.5} />
          <text x={8} y={18} fill="#78716c" fontSize={11}>
            clean input
          </text>
        </g>
        <g transform={`translate(${width + 24}, 0)`}>
          <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" strokeWidth={1} />
          <path d={buildPath(sampleFuzz, width, height, amplitude)} fill="none" stroke="#c084fc" strokeWidth={2.5} />
          <text x={8} y={18} fill="#78716c" fontSize={11}>
            fuzz output
          </text>
          <text x={width - 52} y={height - 6} fill="#78716c" fontSize={11}>
            time →
          </text>
        </g>
      </svg>
      <figcaption>
        Fuzz squashes the wave into a square-ish shape — flat tops and steep edges create strong odd harmonics
      </figcaption>
    </figure>
  )
}
