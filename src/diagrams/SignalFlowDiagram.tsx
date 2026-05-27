const blocks = [
  { label: 'Guitar', sub: 'analog signal' },
  { label: 'Input gain', sub: 'drive knob' },
  { label: 'Waveshaper', sub: 'soft or hard clip' },
  { label: 'Tone filter', sub: 'EQ shaping' },
  { label: 'Output', sub: 'to amp / DAW' },
]

export function SignalFlowDiagram() {
  const blockW = 100
  const blockH = 52
  const gap = 24
  const arrow = 16
  const totalW = blocks.length * blockW + (blocks.length - 1) * (gap + arrow)
  const height = 100

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${totalW} ${height}`} width="100%" height={height} role="img" aria-label="Distortion signal flow">
        {blocks.map((block, i) => {
          const x = i * (blockW + gap + arrow)
          const isCore = block.label === 'Waveshaper'

          return (
            <g key={block.label}>
              {i > 0 && (
                <g>
                  <line
                    x1={x - gap - arrow + 4}
                    y1={height / 2}
                    x2={x - 4}
                    y2={height / 2}
                    stroke="#57534e"
                    strokeWidth={2}
                  />
                  <polygon
                    points={`${x - 4},${height / 2 - 5} ${x - 4},${height / 2 + 5} ${x + 2},${height / 2}`}
                    fill="#57534e"
                  />
                </g>
              )}
              <rect
                x={x}
                y={(height - blockH) / 2}
                width={blockW}
                height={blockH}
                rx={8}
                fill={isCore ? '#292017' : '#1f1c1a'}
                stroke={isCore ? '#d97706' : '#3f3a36'}
                strokeWidth={isCore ? 2 : 1}
              />
              <text x={x + blockW / 2} y={(height - blockH) / 2 + 22} textAnchor="middle" fill="#faf9f7" fontSize={12} fontWeight={600}>
                {block.label}
              </text>
              <text x={x + blockW / 2} y={(height - blockH) / 2 + 38} textAnchor="middle" fill="#78716c" fontSize={10}>
                {block.sub}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>Typical overdrive / distortion signal chain — the waveshaper is where clipping happens</figcaption>
    </figure>
  )
}
