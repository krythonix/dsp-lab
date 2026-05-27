import { echoCount } from '../audio/delay'

type DelayFlowDiagramProps = {
  delayMs: number
  feedback: number
  mix: number
}

export function DelayFlowDiagram({ delayMs, feedback, mix }: DelayFlowDiagramProps) {
  const repeats = echoCount(feedback)

  return (
    <figure className="diagram-card">
      <svg viewBox="0 0 520 200" width="100%" height={200} role="img" aria-label="Delay signal flow">
        <rect x={16} y={72} width={64} height={40} rx={8} fill="#1f1c1a" stroke="#3f3a36" />
        <text x={48} y={97} textAnchor="middle" fill="#faf9f7" fontSize={11} fontWeight={600}>
          Input
        </text>

        <line x1={80} y1={92} x2={108} y2={92} stroke="#57534e" strokeWidth={2} />
        <circle cx={116} cy={92} r={7} fill="#292524" stroke="#57534e" strokeWidth={2} />

        {/* Dry */}
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

        {/* Wet / delay */}
        <line x1={140} y1={92} x2={140} y2={136} stroke="#57534e" strokeWidth={2} />
        <line x1={140} y1={136} x2={168} y2={136} stroke="#34d399" strokeWidth={2} />
        <rect x={168} y={116} width={88} height={40} rx={8} fill="#14241f" stroke="#34d399" strokeWidth={2} />
        <text x={212} y={134} textAnchor="middle" fill="#faf9f7" fontSize={10} fontWeight={600}>
          Delay
        </text>
        <text x={212} y={148} textAnchor="middle" fill="#78716c" fontSize={9}>
          {delayMs} ms
        </text>

        {/* Feedback loop */}
        <path
          d="M 256 156 Q 256 178 212 178 Q 168 178 168 156"
          fill="none"
          stroke="#fbbf24"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <text x={212} y={192} textAnchor="middle" fill="#fbbf24" fontSize={9}>
          feedback {Math.round(feedback * 100)}%
        </text>

        <line x1={256} y1={136} x2={340} y2={136} stroke="#34d399" strokeWidth={2} />
        <rect x={340} y={116} width={64} height={40} rx={8} fill="#14241f" stroke="#34d399" />
        <text x={372} y={134} textAnchor="middle" fill="#faf9f7" fontSize={10} fontWeight={600}>
          Wet
        </text>
        <text x={372} y={148} textAnchor="middle" fill="#78716c" fontSize={9}>
          {Math.round(mix * 100)}%
        </text>

        {/* Mix */}
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
          ~{repeats} audible repeats before fading out
        </text>
      </svg>
      <figcaption>
        Dry path stays immediate; wet path is delayed. Feedback sends part of the delay back for echoes.
      </figcaption>
    </figure>
  )
}

type DelayTimelineProps = {
  delayMs: number
  feedback: number
  isActive: boolean
}

export function DelayTimeline({ delayMs, feedback, isActive }: DelayTimelineProps) {
  const width = 640
  const height = 100
  const repeats = Math.min(6, echoCount(feedback, 0.08))
  const spanMs = delayMs * (repeats + 1)

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Delay echo timeline">
        <line x1={24} y1={height - 24} x2={width - 16} y2={height - 24} stroke="#2a2724" strokeWidth={1} />
        <text x={24} y={16} fill="#78716c" fontSize={11}>
          time →
        </text>

        {/* Dry tap */}
        <circle cx={48} cy={height - 24} r={7} fill="#60a5fa" />
        <text x={48} y={height - 36} textAnchor="middle" fill="#60a5fa" fontSize={10}>
          dry
        </text>

        {Array.from({ length: repeats }, (_, i) => {
          const t = (i + 1) * delayMs
          const x = 48 + (t / spanMs) * (width - 80)
          const amp = Math.pow(feedback, i + 1)
          const r = 4 + amp * 8
          return (
            <g key={i}>
              <circle cx={x} cy={height - 24} r={r} fill="#34d399" opacity={0.35 + amp * 0.55} />
              <text x={x} y={height - 36} textAnchor="middle" fill="#78716c" fontSize={9}>
                +{t}ms
              </text>
            </g>
          )
        })}

        {isActive && (
          <text x={24} y={44} fill="#a8a29e" fontSize={11}>
            Each echo arrives {delayMs} ms after the previous — feedback makes repeats fade slower
          </text>
        )}
      </svg>
      <figcaption>Echo timing on a timeline — taller dots = louder repeats</figcaption>
    </figure>
  )
}
