import type { ReactNode } from 'react'
import { SignalFlowDiagram } from './SignalFlowDiagram'
import { TransferCurveDiagram } from './TransferCurveDiagram'
import { WaveformDiagram } from './WaveformDiagram'
import { ChorusFlowDiagram } from './ChorusFlowDiagram'
import { FuzzWaveformDiagram } from './FuzzWaveformDiagram'

export function SampleDiagram() {
  const width = 400
  const height = 100
  const midY = height / 2
  const count = 24
  const step = width / count

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Discrete audio samples">
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" strokeWidth={1} />
        <path
          d={Array.from({ length: count + 1 }, (_, i) => {
            const t = i / count
            const y = midY - Math.sin(t * Math.PI * 2) * 36
            return `${i === 0 ? 'M' : 'L'} ${(t * width).toFixed(1)} ${y.toFixed(1)}`
          }).join(' ')}
          fill="none"
          stroke="#44403c"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        {Array.from({ length: count }, (_, i) => {
          const t = i / count
          const x = t * width + step / 2
          const y = midY - Math.sin(t * Math.PI * 2) * 36
          return <circle key={i} cx={x} cy={y} r={4} fill="#60a5fa" />
        })}
        <text x={8} y={16} fill="#78716c" fontSize={11}>
          each dot = one sample
        </text>
      </svg>
      <figcaption>Continuous wave (dashed) vs the discrete samples a computer actually stores</figcaption>
    </figure>
  )
}

export function LinearNonlinearDiagram() {
  return (
    <div className="grid-2">
      <TransferCurveDiagram type="linear" title="Linear — straight line (clean boost)" color="#60a5fa" />
      <TransferCurveDiagram type="soft" title="Nonlinear — bent curve (overdrive)" color="#fbbf24" />
    </div>
  )
}

export function ClippingDiagram() {
  return (
    <>
      <div className="grid-2">
        <WaveformDiagram type="clean" title="Clean input" color="#60a5fa" />
        <WaveformDiagram type="soft" title="Soft clip — overdrive" color="#fbbf24" />
      </div>
      <div className="grid-2" style={{ marginTop: 16 }}>
        <WaveformDiagram type="hard" title="Hard clip — distortion" color="#f87171" />
        <FuzzWaveformDiagram />
      </div>
    </>
  )
}

export function HarmonicsDiagram() {
  const width = 400
  const height = 140
  const midY = height / 2

  const waves = [
    { label: 'Fundamental (110 Hz)', color: '#60a5fa', mult: 1, amp: 36 },
    { label: '+ 3rd harmonic', color: '#fbbf24', mult: 3, amp: 14 },
    { label: '+ 5th harmonic (combined shape)', color: '#f87171', mult: 0, amp: 0, combined: true },
  ]

  function combined(t: number) {
    const f = Math.sin(t * Math.PI * 2)
    const h3 = 0.35 * Math.sin(t * Math.PI * 2 * 3)
    const h5 = 0.2 * Math.sin(t * Math.PI * 2 * 5)
    return f + h3 + h5
  }

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height * 3 + 20}`} width="100%" height={height * 3 + 20} role="img" aria-label="Harmonic content">
        {waves.map((w, row) => {
          const y0 = row * (height + 10)
          const mid = y0 + midY
          const points = Array.from({ length: 201 }, (_, i) => {
            const t = i / 200
            const x = t * width
            let val: number
            if (w.combined) val = combined(t)
            else val = Math.sin(t * Math.PI * 2 * w.mult) * (w.mult === 1 ? 1 : 0.35)
            const y = mid - val * (w.combined ? 28 : w.amp)
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
          }).join(' ')
          return (
            <g key={w.label}>
              <line x1={0} y1={mid} x2={width} y2={mid} stroke="#2a2724" strokeWidth={1} />
              <path d={points} fill="none" stroke={w.color} strokeWidth={2} />
              <text x={8} y={y0 + 16} fill={w.color} fontSize={11}>
                {w.label}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>Clipping builds a complex wave from the fundamental plus higher harmonics</figcaption>
    </figure>
  )
}

function FilterCurve({ kind }: { kind: 'lowpass' | 'highpass' }) {
  const width = 360
  const height = 120
  const pad = 28
  const innerW = width - pad * 2

  const points = Array.from({ length: 101 }, (_, i) => {
    const t = i / 100
    const freq = t
    let mag: number
    if (kind === 'lowpass') {
      mag = 1 / Math.sqrt(1 + Math.pow(freq / 0.35, 4))
    } else {
      mag = 1 / Math.sqrt(1 + Math.pow(0.35 / Math.max(freq, 0.01), 4))
    }
    const x = pad + t * innerW
    const y = pad + (1 - mag) * (height - pad * 2)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#2a2724" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#2a2724" />
        <path d={points} fill="none" stroke={kind === 'lowpass' ? '#a78bfa' : '#34d399'} strokeWidth={2.5} />
        <text x={width / 2 - 30} y={height - 8} fill="#78716c" fontSize={11}>
          frequency →
        </text>
        <text x={8} y={pad + 4} fill="#78716c" fontSize={11}>
          level
        </text>
      </svg>
      <figcaption>
        {kind === 'lowpass' ? 'Low-pass — keeps lows, rolls off highs (tone knob)' : 'High-pass — cuts lows, keeps highs (rumble filter)'}
      </figcaption>
    </figure>
  )
}

export function FilterEqDiagram() {
  return <FilterCurve kind="lowpass" />
}

export function HighPassDiagram() {
  return <FilterCurve kind="highpass" />
}

export function DelayBufferDiagram() {
  const width = 420
  const height = 100
  const cells = 14
  const cellW = 24

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Delay buffer">
        {Array.from({ length: cells }, (_, i) => (
          <g key={i}>
            <rect x={20 + i * cellW} y={30} width={20} height={40} rx={4} fill={i < 4 ? '#292524' : '#1f1c1a'} stroke={i === 3 ? '#34d399' : '#3f3a36'} strokeWidth={i === 3 ? 2 : 1} />
            <text x={30 + i * cellW} y={55} textAnchor="middle" fill="#78716c" fontSize={8}>
              {i}
            </text>
          </g>
        ))}
        <text x={20} y={20} fill="#78716c" fontSize={11}>
          buffer (past samples)
        </text>
        <text x={20 + 3 * cellW} y={88} fill="#34d399" fontSize={10}>
          read here (delay)
        </text>
        <polygon points="380,50 395,50 388,44 388,56" fill="#fbbf24" />
        <text x={340} y={44} fill="#fbbf24" fontSize={10}>
          write new
        </text>
      </svg>
      <figcaption>New samples enter one end; reading further back in the buffer = longer delay time</figcaption>
    </figure>
  )
}

export function DryWetDiagram() {
  const width = 400
  const height = 120

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Dry wet mix">
        <rect x={20} y={40} width={80} height={40} rx={8} fill="#141c28" stroke="#60a5fa" />
        <text x={60} y={65} textAnchor="middle" fill="#faf9f7" fontSize={11}>
          Dry
        </text>
        <rect x={140} y={40} width={80} height={40} rx={8} fill="#14241f" stroke="#34d399" />
        <text x={180} y={65} textAnchor="middle" fill="#faf9f7" fontSize={11}>
          Wet
        </text>
        <line x1={100} y1={60} x2={130} y2={60} stroke="#57534e" strokeWidth={2} />
        <line x1={220} y1={60} x2={250} y2={60} stroke="#57534e" strokeWidth={2} />
        <line x1={180} y1={80} x2={180} y2={95} stroke="#57534e" strokeWidth={2} />
        <line x1={60} y1={80} x2={60} y2={95} stroke="#57534e" strokeWidth={2} />
        <line x1={60} y1={95} x2={180} y2={95} stroke="#57534e" strokeWidth={2} />
        <line x1={180} y1={95} x2={180} y2={60} stroke="#57534e" strokeWidth={2} />
        <circle cx={290} cy={60} r={12} fill="#292017" stroke="#fbbf24" strokeWidth={2} />
        <text x={290} y={64} textAnchor="middle" fill="#faf9f7" fontSize={12}>
          +
        </text>
        <rect x={320} y={40} width={60} height={40} rx={8} fill="#1f1c1a" stroke="#fbbf24" />
        <text x={350} y={65} textAnchor="middle" fill="#faf9f7" fontSize={11}>
          Out
        </text>
        <text x={250} y={30} fill="#78716c" fontSize={10}>
          mix knob blends both
        </text>
      </svg>
      <figcaption>output = dry × (1 − mix) + wet × mix</figcaption>
    </figure>
  )
}

export function LfoDiagram() {
  const width = 400
  const height = 100
  const midY = height / 2
  const points = Array.from({ length: 201 }, (_, i) => {
    const t = i / 200
    const x = t * width
    const y = midY - Math.sin(t * Math.PI * 2 * 1.5) * 32
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="LFO waveform">
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" strokeWidth={1} />
        <path d={points} fill="none" stroke="#c084fc" strokeWidth={2.5} strokeDasharray="6 4" />
        <text x={8} y={18} fill="#c084fc" fontSize={11}>
          LFO (~1 Hz) — controls delay, volume, or filter
        </text>
        <text x={width - 52} y={height - 8} fill="#78716c" fontSize={11}>
          time →
        </text>
      </svg>
      <figcaption>Slow sine wave below audio range — you hear what it modulates, not the LFO itself</figcaption>
    </figure>
  )
}

export function SampleRateDiagram() {
  const width = 400
  const height = 90
  const rates = [
    { label: 'Slow buffer (512 samples)', w: 280, color: '#78716c' },
    { label: 'Fast buffer (64 samples)', w: 80, color: '#60a5fa' },
  ]

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height + 50}`} width="100%" height={height + 50} role="img">
        {rates.map((r, i) => (
          <g key={r.label} transform={`translate(0, ${i * 50})`}>
            <rect x={20} y={10} width={r.w} height={24} rx={4} fill="#1f1c1a" stroke={r.color} />
            {Array.from({ length: Math.floor(r.w / 12) }, (_, j) => (
              <rect key={j} x={24 + j * 12} y={14} width={6} height={16} rx={1} fill={r.color} opacity={0.6} />
            ))}
            <text x={20} y={48} fill="#78716c" fontSize={10}>
              {r.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>Larger buffers = higher latency but less CPU load; live playing favors smaller blocks</figcaption>
    </figure>
  )
}

export function CompressorDiagram() {
  const width = 400
  const height = 120
  const midY = height / 2

  const input = Array.from({ length: 201 }, (_, i) => {
    const t = i / 200
    const env = 0.4 + 0.6 * Math.max(0, Math.sin(t * Math.PI * 2))
    return env
  })

  const output = input.map((v) => (v > 0.7 ? 0.7 + (v - 0.7) * 0.25 : v * 1.1))

  function path(values: number[], scale: number, offsetY: number) {
    return values
      .map((v, i) => {
        const x = (i / 200) * width
        const y = offsetY - v * scale
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')
  }

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height * 2 + 16}`} width="100%" height={height * 2 + 16} role="img">
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" />
        <path d={path(input, 40, midY)} fill="none" stroke="#60a5fa" strokeWidth={2} />
        <text x={8} y={16} fill="#60a5fa" fontSize={11}>
          input (dynamic picking)
        </text>
        <line x1={0} y1={height + midY} x2={width} y2={height + midY} stroke="#2a2724" />
        <path d={path(output, 40, height + midY)} fill="none" stroke="#fbbf24" strokeWidth={2} />
        <text x={8} y={height + 16} fill="#fbbf24" fontSize={11}>
          output (peaks reduced, body lifted)
        </text>
      </svg>
      <figcaption>Gain follows an envelope — loud peaks turned down, not flattened by a clip curve</figcaption>
    </figure>
  )
}

export function NoiseGateDiagram() {
  const width = 400
  const height = 100
  const midY = height / 2
  const threshold = midY - 20

  const points = Array.from({ length: 201 }, (_, i) => {
    const t = i / 200
    const x = t * width
    let v = Math.sin(t * Math.PI * 4) * 35
    if (Math.abs(v) < 18 && t > 0.25 && t < 0.55) v = 0
    const y = midY - v
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img">
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" />
        <line x1={0} y1={threshold} x2={width} y2={threshold} stroke="#f87171" strokeDasharray="4 4" opacity={0.7} />
        <text x={8} y={threshold - 6} fill="#f87171" fontSize={10}>
          threshold
        </text>
        <path d={points} fill="none" stroke="#34d399" strokeWidth={2} />
        <text x={140} y={midY + 28} fill="#78716c" fontSize={10}>
          gate closed (silence)
        </text>
      </svg>
      <figcaption>Below threshold the output is muted; playing opens the gate again</figcaption>
    </figure>
  )
}

const diagramMap: Record<string, () => ReactNode> = {
  sample: SampleDiagram,
  'signal-flow': SignalFlowDiagram,
  'linear-nonlinear': LinearNonlinearDiagram,
  clipping: ClippingDiagram,
  harmonics: HarmonicsDiagram,
  'filter-eq': FilterEqDiagram,
  'high-pass': HighPassDiagram,
  'delay-line': DelayBufferDiagram,
  'dry-wet': DryWetDiagram,
  lfo: LfoDiagram,
  'sample-rate': SampleRateDiagram,
  compressor: CompressorDiagram,
  'noise-gate': NoiseGateDiagram,
}

export function ConceptDiagram({ id }: { id: string }) {
  const Component = diagramMap[id]
  if (!Component) return null
  return <Component />
}

// Re-export flow diagram for signal-flow detail extras
export { ChorusFlowDiagram }
