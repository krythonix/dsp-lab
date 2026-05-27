import { useEffect, useRef } from 'react'
import { delayRangeMs } from '../audio/chorus'

type ChorusFlowDiagramProps = {
  centerMs: number
  depthMs: number
  rateHz: number
  mix: number
}

export function ChorusFlowDiagram({ centerMs, depthMs, rateHz, mix }: ChorusFlowDiagramProps) {
  const { min, max } = delayRangeMs(centerMs, depthMs)

  return (
    <figure className="diagram-card">
      <svg viewBox="0 0 520 200" width="100%" height={200} role="img" aria-label="Chorus signal flow">
        <rect x={16} y={72} width={64} height={40} rx={8} fill="#1f1c1a" stroke="#3f3a36" />
        <text x={48} y={97} textAnchor="middle" fill="#faf9f7" fontSize={11} fontWeight={600}>
          Input
        </text>

        <line x1={80} y1={92} x2={108} y2={92} stroke="#57534e" strokeWidth={2} />
        <circle cx={116} cy={92} r={7} fill="#292524" stroke="#57534e" strokeWidth={2} />

        <line x1={123} y1={92} x2={140} y2={92} stroke="#57534e" strokeWidth={2} />
        <line x1={140} y1={92} x2={140} y2={48} stroke="#60a5fa" strokeWidth={2} />
        <line x1={140} y1={48} x2={340} y2={48} stroke="#60a5fa" strokeWidth={2} />
        <rect x={340} y={28} width={64} height={36} rx={8} fill="#141c28" stroke="#60a5fa" />
        <text x={372} y={44} textAnchor="middle" fill="#faf9f7" fontSize={10} fontWeight={600}>
          Dry
        </text>
        <text x={372} y={56} textAnchor="middle" fill="#78716c" fontSize={9}>
          {Math.round((1 - mix) * 100)}%
        </text>

        <line x1={140} y1={92} x2={140} y2={136} stroke="#57534e" strokeWidth={2} />
        <line x1={140} y1={136} x2={168} y2={136} stroke="#34d399" strokeWidth={2} />
        <rect x={168} y={116} width={96} height={40} rx={8} fill="#14241f" stroke="#34d399" strokeWidth={2} />
        <text x={216} y={134} textAnchor="middle" fill="#faf9f7" fontSize={10} fontWeight={600}>
          Delay
        </text>
        <text x={216} y={148} textAnchor="middle" fill="#78716c" fontSize={9}>
          {min}–{max} ms
        </text>

        <line x1={216} y1={156} x2={216} y2={176} stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 3" />
        <rect x={168} y={176} width={96} height={18} rx={4} fill="#1f1529" stroke="#a78bfa" />
        <text x={216} y={189} textAnchor="middle" fill="#c4b5fd" fontSize={9}>
          LFO {rateHz.toFixed(1)} Hz ±{depthMs} ms
        </text>

        <line x1={264} y1={136} x2={340} y2={136} stroke="#34d399" strokeWidth={2} />
        <rect x={340} y={116} width={64} height={40} rx={8} fill="#14241f" stroke="#34d399" />
        <text x={372} y={134} textAnchor="middle" fill="#faf9f7" fontSize={10} fontWeight={600}>
          Wet
        </text>
        <text x={372} y={148} textAnchor="middle" fill="#78716c" fontSize={9}>
          {Math.round(mix * 100)}%
        </text>

        <line x1={404} y1={48} x2={428} y2={48} stroke="#57534e" strokeWidth={2} />
        <line x1={404} y1={136} x2={428} y2={136} stroke="#57534e" strokeWidth={2} />
        <line x1={428} y1={48} x2={428} y2={92} stroke="#57534e" strokeWidth={2} />
        <line x1={428} y1={136} x2={428} y2={92} stroke="#57534e" strokeWidth={2} />
        <circle cx={444} cy={92} r={10} fill="#292017" stroke="#fbbf24" strokeWidth={2} />
        <text x={444} y={96} textAnchor="middle" fill="#faf9f7" fontSize={10}>
          +
        </text>
        <line x1={454} y1={92} x2={472} y2={92} stroke="#57534e" strokeWidth={2} />
        <rect x={472} y={72} width={64} height={40} rx={8} fill="#1f1c1a" stroke="#fbbf24" strokeWidth={2} />
        <text x={504} y={97} textAnchor="middle" fill="#faf9f7" fontSize={11} fontWeight={600}>
          Out
        </text>

        <text x={16} y={20} fill="#78716c" fontSize={10}>
          Center delay {centerMs} ms — LFO sweeps between {min} ms and {max} ms
        </text>
      </svg>
      <figcaption>
        Chorus mixes a dry path with a short delayed copy whose time is swept by an LFO — that wobble thickens the tone.
      </figcaption>
    </figure>
  )
}

type ChorusLfoDiagramProps = {
  centerMs: number
  depthMs: number
  rateHz: number
  isActive: boolean
}

export function ChorusLfoDiagram({ centerMs, depthMs, rateHz, isActive }: ChorusLfoDiagramProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const width = 640
  const height = 120
  const padX = 40
  const plotW = width - padX * 2
  const midY = 58
  const { min, max } = delayRangeMs(centerMs, depthMs)
  const span = max - min || 1

  useEffect(() => {
    let frame = 0
    let raf = 0

    const tick = () => {
      frame += 1
      const t = frame * 0.016 * rateHz
      const steps = 120
      const points: string[] = []

      for (let i = 0; i <= steps; i++) {
        const phase = (i / steps) * Math.PI * 2
        const x = padX + (i / steps) * plotW
        const ms = centerMs + depthMs * Math.sin(phase)
        const y = midY - ((ms - centerMs) / Math.max(depthMs, 1)) * 28
        points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
      }

      pathRef.current?.setAttribute('d', points.join(' '))

      const currentMs = centerMs + depthMs * Math.sin(t * Math.PI * 2)
      const dotX = padX + (((currentMs - min) / span) * plotW)
      const dotY = midY - ((currentMs - centerMs) / Math.max(depthMs, 1)) * 28
      dotRef.current?.setAttribute('cx', String(dotX))
      dotRef.current?.setAttribute('cy', String(dotY))

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [centerMs, depthMs, rateHz, min, span])

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Chorus LFO modulating delay time">
        <line x1={padX} y1={midY} x2={width - padX} y2={midY} stroke="#2a2724" strokeWidth={1} strokeDasharray="4 4" />
        <text x={padX} y={18} fill="#78716c" fontSize={11}>
          delay time (ms)
        </text>
        <text x={padX} y={104} fill="#57534e" fontSize={10}>
          {min} ms
        </text>
        <text x={width - padX} y={104} textAnchor="end" fill="#57534e" fontSize={10}>
          {max} ms
        </text>

        <path ref={pathRef} fill="none" stroke="#a78bfa" strokeWidth={2} opacity={0.85} />
        <circle ref={dotRef} r={6} fill="#c4b5fd" stroke="#a78bfa" strokeWidth={2} />

        {isActive && (
          <text x={padX} y={34} fill="#a8a29e" fontSize={11}>
            LFO sweeps delay around {centerMs} ms — the moving copy creates pitch shimmer
          </text>
        )}
      </svg>
      <figcaption>Live LFO shape — faster rate = more wobble; more depth = wider pitch swing</figcaption>
    </figure>
  )
}
