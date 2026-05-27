import { useEffect, useRef } from 'react'

type WaveformScopeProps = {
  getAnalyser: () => AnalyserNode | null
  isActive: boolean
  color?: string
  label?: string
}

export function WaveformScope({ getAnalyser, isActive, color = '#f87171', label = 'Output waveform' }: WaveformScopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const buffer = new Uint8Array(2048)
    let raf = 0

    const draw = () => {
      const analyser = getAnalyser()
      if (!analyser || !canvas) return

      analyser.getByteTimeDomainData(buffer)
      const { width, height } = canvas
      ctx.fillStyle = '#1a1816'
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = '#2a2724'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i < buffer.length; i++) {
        const x = (i / buffer.length) * width
        const v = buffer[i] / 128 - 1
        const y = height / 2 - v * (height * 0.42)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [isActive, getAnalyser, color])

  return (
    <figure className="diagram-card scope-card">
      <canvas ref={canvasRef} className="scope-canvas" width={640} height={140} aria-label={label} />
      <figcaption>{isActive ? label : 'Start audio to see the live waveform'}</figcaption>
    </figure>
  )
}
