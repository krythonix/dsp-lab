import { useCallback, useEffect, useRef, useState } from 'react'
import type { CurvePoint } from '../audio/distortion'
import { buildPathFromPoints } from '../audio/distortion'

type DraggableTransferCurveProps = {
  points: CurvePoint[]
  bypass: boolean
  onChange: (points: CurvePoint[]) => void
}

const SIZE = 280
const PAD = 36
const INNER = SIZE - PAD * 2

function toSvg(x: number, y: number) {
  return {
    sx: PAD + (x + 1) * 0.5 * INNER,
    sy: PAD + (1 - y) * 0.5 * INNER,
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export function DraggableTransferCurve({ points, bypass, onChange }: DraggableTransferCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const path = bypass
    ? `M ${PAD} ${SIZE - PAD} L ${SIZE - PAD} ${PAD}`
    : buildPathFromPoints(points, SIZE, PAD)

  const updatePointY = useCallback(
    (index: number, clientY: number) => {
      const svg = svgRef.current
      if (!svg) return

      const rect = svg.getBoundingClientRect()
      const sy = ((clientY - rect.top) / rect.height) * SIZE
      const y = clamp(1 - ((sy - PAD) / INNER) * 2, -1, 1)

      const next = points.map((p, i) => (i === index ? { ...p, y } : p))
      onChange(next)
    },
    [onChange, points],
  )

  useEffect(() => {
    if (dragIndex === null) return

    const onMove = (e: PointerEvent) => updatePointY(dragIndex, e.clientY)
    const onUp = () => setDragIndex(null)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragIndex, updatePointY])

  return (
    <figure className="diagram-card diagram-card--curve">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        height={SIZE}
        role="application"
        aria-label="Draggable waveshaper transfer curve"
        className={bypass ? 'curve-editor curve-editor--bypass' : 'curve-editor'}
      >
        <line x1={PAD} y1={SIZE - PAD} x2={SIZE - PAD} y2={SIZE - PAD} stroke="#2a2724" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={SIZE - PAD} stroke="#2a2724" />
        <line
          x1={PAD}
          y1={SIZE - PAD}
          x2={SIZE - PAD}
          y2={PAD}
          stroke="#2a2724"
          strokeDasharray="4 4"
          opacity={0.5}
        />

        <path d={path} fill="none" stroke={bypass ? '#60a5fa' : '#f87171'} strokeWidth={2.5} />

        {!bypass &&
          points.map((point, index) => {
            const { sx, sy } = toSvg(point.x, point.y)
            return (
              <g key={index}>
                <circle
                  cx={sx}
                  cy={sy}
                  r={dragIndex === index ? 9 : 7}
                  className="curve-handle"
                  fill="#faf9f7"
                  stroke="#f87171"
                  strokeWidth={2}
                  onPointerDown={(e) => {
                    e.preventDefault()
                    setDragIndex(index)
                  }}
                />
              </g>
            )
          })}

        <text x={SIZE / 2 - 18} y={SIZE - 8} fill="#78716c" fontSize={11}>
          input
        </text>
        <text
          x={12}
          y={SIZE / 2}
          fill="#78716c"
          fontSize={11}
          transform={`rotate(-90 12 ${SIZE / 2})`}
        >
          output
        </text>
      </svg>
      <figcaption>
        {bypass
          ? 'Bypass — linear path (drag disabled)'
          : 'Drag the handles to shape the waveshaper — each input maps to an output'}
      </figcaption>
    </figure>
  )
}
