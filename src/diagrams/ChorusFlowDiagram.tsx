export function ChorusFlowDiagram() {
  const width = 520
  const height = 200

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Chorus signal flow">
        {/* Input */}
        <rect x={16} y={72} width={72} height={44} rx={8} fill="#1f1c1a" stroke="#3f3a36" />
        <text x={52} y={92} textAnchor="middle" fill="#faf9f7" fontSize={12} fontWeight={600}>
          Input
        </text>
        <text x={52} y={106} textAnchor="middle" fill="#78716c" fontSize={10}>
          guitar
        </text>

        {/* Split node */}
        <circle cx={130} cy={94} r={8} fill="#292524" stroke="#57534e" strokeWidth={2} />
        <text x={130} y={118} textAnchor="middle" fill="#78716c" fontSize={10}>
          split
        </text>

        {/* Dry path */}
        <line x1={138} y1={94} x2={168} y2={94} stroke="#57534e" strokeWidth={2} />
        <line x1={168} y1={94} x2={168} y2={54} stroke="#57534e" strokeWidth={2} />
        <line x1={168} y1={54} x2={340} y2={54} stroke="#60a5fa" strokeWidth={2} />
        <rect x={340} y={32} width={72} height={44} rx={8} fill="#141c28" stroke="#60a5fa" />
        <text x={376} y={52} textAnchor="middle" fill="#faf9f7" fontSize={12} fontWeight={600}>
          Dry
        </text>
        <text x={376} y={66} textAnchor="middle" fill="#78716c" fontSize={10}>
          no delay
        </text>

        {/* Wet path */}
        <line x1={138} y1={94} x2={168} y2={94} stroke="#57534e" strokeWidth={2} />
        <line x1={168} y1={94} x2={168} y2={134} stroke="#57534e" strokeWidth={2} />
        <line x1={168} y1={134} x2={210} y2={134} stroke="#34d399" strokeWidth={2} />
        <rect x={210} y={112} width={88} height={44} rx={8} fill="#14241f" stroke="#34d399" strokeWidth={2} />
        <text x={254} y={132} textAnchor="middle" fill="#faf9f7" fontSize={12} fontWeight={600}>
          Delay
        </text>
        <text x={254} y={146} textAnchor="middle" fill="#78716c" fontSize={10}>
          10–30 ms
        </text>

        {/* LFO to delay */}
        <line x1={254} y1={156} x2={254} y2={176} stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 3" />
        <rect x={206} y={176} width={96} height={18} rx={4} fill="#1f1529" stroke="#a78bfa" />
        <text x={254} y={189} textAnchor="middle" fill="#c4b5fd" fontSize={10}>
          LFO modulates delay time
        </text>

        <line x1={298} y1={134} x2={340} y2={134} stroke="#34d399" strokeWidth={2} />
        <rect x={340} y={112} width={72} height={44} rx={8} fill="#14241f" stroke="#34d399" />
        <text x={376} y={132} textAnchor="middle" fill="#faf9f7" fontSize={12} fontWeight={600}>
          Wet
        </text>
        <text x={376} y={146} textAnchor="middle" fill="#78716c" fontSize={10}>
          shifted copy
        </text>

        {/* Mix */}
        <line x1={412} y1={54} x2={440} y2={54} stroke="#57534e" strokeWidth={2} />
        <line x1={412} y1={134} x2={440} y2={134} stroke="#57534e" strokeWidth={2} />
        <line x1={440} y1={54} x2={440} y2={94} stroke="#57534e" strokeWidth={2} />
        <line x1={440} y1={134} x2={440} y2={94} stroke="#57534e" strokeWidth={2} />
        <line x1={440} y1={94} x2={452} y2={94} stroke="#57534e" strokeWidth={2} />
        <circle cx={460} cy={94} r={10} fill="#292017" stroke="#fbbf24" strokeWidth={2} />
        <text x={460} y={98} textAnchor="middle" fill="#faf9f7" fontSize={10} fontWeight={600}>
          +
        </text>
        <line x1={470} y1={94} x2={490} y2={94} stroke="#57534e" strokeWidth={2} />
        <polygon points="488,89 488,99 496,94" fill="#57534e" />

        <rect x={498} y={72} width={72} height={44} rx={8} fill="#1f1c1a" stroke="#fbbf24" strokeWidth={2} />
        <text x={534} y={92} textAnchor="middle" fill="#faf9f7" fontSize={12} fontWeight={600}>
          Output
        </text>
        <text x={534} y={106} textAnchor="middle" fill="#78716c" fontSize={10}>
          dry + wet
        </text>

        <line x1={88} y1={94} x2={122} y2={94} stroke="#57534e" strokeWidth={2} />
        <polygon points="120,89 120,99 128,94" fill="#57534e" />
      </svg>
      <figcaption>
        Chorus splits the signal: one path stays dry, the other passes through a delay whose time is moved by an LFO
      </figcaption>
    </figure>
  )
}
