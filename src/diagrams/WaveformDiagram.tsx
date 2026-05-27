type WaveType = 'clean' | 'soft' | 'hard'

function sampleWave(type: WaveType, t: number): number {
  const x = t * Math.PI * 2
  const sine = Math.sin(x)

  if (type === 'clean') return sine

  const driven = sine * 2.5
  if (type === 'soft') return Math.tanh(driven)
  return Math.max(-1, Math.min(1, driven))
}

function buildPath(type: WaveType, width: number, height: number, amplitude: number): string {
  const midY = height / 2
  const steps = 200
  const points: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = t * width
    const y = midY - sampleWave(type, t) * amplitude
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}

type WaveformDiagramProps = {
  type: WaveType
  title: string
  color: string
}

export function WaveformDiagram({ type, title, color }: WaveformDiagramProps) {
  const width = 320
  const height = 120
  const amplitude = 40
  const midY = height / 2

  return (
    <figure className="diagram-card">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={`${title} waveform`}
      >
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" strokeWidth={1} />
        <line x1={0} y1={8} x2={0} y2={height - 8} stroke="#2a2724" strokeWidth={1} />
        <path d={buildPath(type, width, height, amplitude)} fill="none" stroke={color} strokeWidth={2.5} />
        <text x={8} y={18} fill="#78716c" fontSize={11}>
          amplitude
        </text>
        <text x={width - 52} y={height - 6} fill="#78716c" fontSize={11}>
          time →
        </text>
      </svg>
      <figcaption>{title}</figcaption>
    </figure>
  )
}
