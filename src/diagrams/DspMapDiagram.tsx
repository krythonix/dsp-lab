type Node = {
  id: string
  label: string
  sub: string
  x: number
  y: number
  color: string
}

const nodes: Node[] = [
  { id: 'sample', label: 'Sample', sub: 'one slice of audio', x: 80, y: 40, color: '#60a5fa' },
  { id: 'flow', label: 'Signal flow', sub: 'chain of blocks', x: 240, y: 40, color: '#94a3b8' },
  { id: 'linear', label: 'Linear', sub: 'volume, EQ pass', x: 80, y: 130, color: '#60a5fa' },
  { id: 'nonlinear', label: 'Nonlinear', sub: 'drive & fuzz', x: 240, y: 130, color: '#f87171' },
  { id: 'clip', label: 'Clipping', sub: 'OD · dist · fuzz', x: 400, y: 130, color: '#f87171' },
  { id: 'harmonics', label: 'Harmonics', sub: 'grit & buzz', x: 560, y: 130, color: '#fb923c' },
  { id: 'filter', label: 'Filter / EQ', sub: 'tone shaping', x: 80, y: 220, color: '#a78bfa' },
  { id: 'delay', label: 'Delay line', sub: 'echo · chorus', x: 240, y: 220, color: '#34d399' },
  { id: 'mix', label: 'Dry / wet', sub: 'blend copies', x: 400, y: 220, color: '#34d399' },
  { id: 'lfo', label: 'LFO', sub: 'slow movement', x: 560, y: 220, color: '#c084fc' },
]

const edges: [string, string][] = [
  ['sample', 'flow'],
  ['sample', 'linear'],
  ['linear', 'nonlinear'],
  ['nonlinear', 'clip'],
  ['clip', 'harmonics'],
  ['flow', 'filter'],
  ['flow', 'delay'],
  ['delay', 'mix'],
  ['lfo', 'delay'],
  ['filter', 'clip'],
]

function nodeById(id: string): Node {
  return nodes.find((n) => n.id === id)!
}

export function DspMapDiagram() {
  const width = 680
  const height = 290
  const boxW = 118
  const boxH = 52

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Guitar DSP concept map">
        {edges.map(([from, to]) => {
          const a = nodeById(from)
          const b = nodeById(to)
          const x1 = a.x + boxW
          const y1 = a.y + boxH / 2
          const x2 = b.x
          const y2 = b.y + boxH / 2
          const midX = (x1 + x2) / 2

          return (
            <path
              key={`${from}-${to}`}
              d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke="#3f3a36"
              strokeWidth={1.5}
            />
          )
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={boxW}
              height={boxH}
              rx={8}
              fill="#1f1c1a"
              stroke={node.color}
              strokeWidth={1.5}
            />
            <text x={node.x + boxW / 2} y={node.y + 22} textAnchor="middle" fill="#faf9f7" fontSize={12} fontWeight={600}>
              {node.label}
            </text>
            <text x={node.x + boxW / 2} y={node.y + 38} textAnchor="middle" fill="#78716c" fontSize={10}>
              {node.sub}
            </text>
          </g>
        ))}

        <text x={16} y={280} fill="#78716c" fontSize={11}>
          Start top-left → follow arrows → covers most guitar effects
        </text>
      </svg>
      <figcaption>Ten core ideas and how they connect — learn these before diving into heavy math</figcaption>
    </figure>
  )
}
