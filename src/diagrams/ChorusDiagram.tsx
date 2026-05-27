import { useEffect, useRef } from 'react'

function sampleSine(t: number): number {
  return Math.sin(t * Math.PI * 2)
}

function buildPath(
  sample: (t: number, phase: number) => number,
  width: number,
  height: number,
  amplitude: number,
  phase: number,
): string {
  const midY = height / 2
  const steps = 200
  const points: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = t * width
    const y = midY - sample(t, phase) * amplitude
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}

export function ChorusDiagram() {
  const dryRef = useRef<SVGPathElement>(null)
  const wetRef = useRef<SVGPathElement>(null)
  const mixRef = useRef<SVGPathElement>(null)
  const lfoRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const width = 640
    const waveHeight = 90
    const lfoHeight = 50
    const amplitude = 32
    const lfoAmplitude = 18
    const lfoMid = waveHeight + 28 + lfoHeight / 2

    let frame = 0
    let raf = 0

    const tick = () => {
      frame += 1
      const phase = frame * 0.025

      const dry = (t: number) => sampleSine(t)
      const delay = 0.018 + 0.012 * Math.sin(phase)
      const wet = (t: number) => sampleSine(t - delay)
      const mix = (t: number) => 0.5 * dry(t) + 0.5 * wet(t)
      const lfo = (t: number) => Math.sin(t * Math.PI * 2 * 2 + phase)

      dryRef.current?.setAttribute('d', buildPath(dry, width, waveHeight, amplitude, phase))
      wetRef.current?.setAttribute('d', buildPath(wet, width, waveHeight, amplitude, phase))
      mixRef.current?.setAttribute('d', buildPath(mix, width, waveHeight, amplitude, phase))

      const lfoSteps = 200
      const lfoPoints: string[] = []
      for (let i = 0; i <= lfoSteps; i++) {
        const t = i / lfoSteps
        const x = t * width
        const y = lfoMid - lfo(t) * lfoAmplitude
        lfoPoints.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
      }
      lfoRef.current?.setAttribute('d', lfoPoints.join(' '))

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const width = 640
  const waveHeight = 90
  const totalHeight = 170
  const waveMid = waveHeight / 2 + 8

  return (
    <figure className="diagram-card">
      <svg
        viewBox={`0 0 ${width} ${totalHeight}`}
        width="100%"
        height={totalHeight}
        role="img"
        aria-label="Animated chorus dry, wet, and mixed signals with LFO"
      >
        <line x1={0} y1={waveMid} x2={width} y2={waveMid} stroke="#2a2724" strokeWidth={1} />
        <path ref={dryRef} fill="none" stroke="#60a5fa" strokeWidth={2} opacity={0.85} />
        <path ref={wetRef} fill="none" stroke="#34d399" strokeWidth={2} opacity={0.85} />
        <path ref={mixRef} fill="none" stroke="#fbbf24" strokeWidth={2.5} />
        <text x={8} y={20} fill="#60a5fa" fontSize={11}>
          dry
        </text>
        <text x={48} y={20} fill="#34d399" fontSize={11}>
          delayed copy
        </text>
        <text x={148} y={20} fill="#fbbf24" fontSize={11}>
          mix (what you hear)
        </text>
        <line x1={0} y1={waveHeight + 36} x2={width} y2={waveHeight + 36} stroke="#2a2724" strokeWidth={1} />
        <path ref={lfoRef} fill="none" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 4" />
        <text x={8} y={waveHeight + 28} fill="#a78bfa" fontSize={11}>
          LFO — sweeps delay time up and down
        </text>
        <text x={width - 52} y={totalHeight - 6} fill="#78716c" fontSize={11}>
          time →
        </text>
      </svg>
      <figcaption>
        Chorus copies the signal, delays it, and wiggles that delay with an LFO — dry + wet creates shimmer
      </figcaption>
    </figure>
  )
}
