import { GuitarSamplePlayer } from './guitarSamplePlayer'

export type ClipType = 'soft' | 'hard' | 'fuzz'

export type CurvePoint = { x: number; y: number }

/** Fixed input positions for draggable control points */
export const CURVE_CONTROL_X = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1] as const

export type DistortionParams = {
  drive: number
  tone: number
  output: number
  clipType: ClipType
  bypass: boolean
  curvePoints: CurvePoint[]
}

export const defaultDistortionParams: DistortionParams = {
  drive: 6,
  tone: 0.65,
  output: 0.4,
  clipType: 'hard',
  bypass: false,
  curvePoints: [],
}

export function initDefaultParams(): DistortionParams {
  const base = { ...defaultDistortionParams, drive: 6, clipType: 'hard' as ClipType }
  return { ...base, curvePoints: presetCurvePoints(base.clipType, base.drive) }
}

/** Per-type gain — soft needs more drive knob to saturate; fuzz saturates earliest. */
export const DRIVE_SCALE: Record<ClipType, number> = {
  soft: 0.28,
  hard: 0.9,
  fuzz: 1.6,
}

export function effectiveDrive(drive: number, type: ClipType): number {
  return drive * DRIVE_SCALE[type]
}

function shapeSample(gained: number, type: ClipType): number {
  switch (type) {
    case 'soft':
      return Math.tanh(gained * 0.75)
    case 'hard':
      return Math.max(-1, Math.min(1, gained))
    case 'fuzz':
      return Math.sign(gained) * (1 - Math.exp(-Math.abs(gained * 1.35)))
  }
}

export function clipSample(x: number, type: ClipType, drive: number): number {
  return shapeSample(x * effectiveDrive(drive, type), type)
}

export function presetCurvePoints(type: ClipType, drive: number): CurvePoint[] {
  return CURVE_CONTROL_X.map((x) => ({ x, y: clipSample(x, type, drive) }))
}

export function interpolateCurvePoints(points: CurvePoint[], x: number): number {
  const sorted = [...points].sort((a, b) => a.x - b.x)
  if (x <= sorted[0].x) return sorted[0].y
  if (x >= sorted[sorted.length - 1].x) return sorted[sorted.length - 1].y
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]
    const b = sorted[i + 1]
    if (x >= a.x && x <= b.x) {
      const t = (x - a.x) / (b.x - a.x)
      return a.y + t * (b.y - a.y)
    }
  }
  return 0
}

export function pointsToWaveshaperCurve(points: CurvePoint[], samples = 4096): Float32Array {
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = (i / (samples - 1)) * 2 - 1
    curve[i] = interpolateCurvePoints(points, x)
  }
  return curve
}

export function buildPathFromPoints(points: CurvePoint[], size: number, padding: number): string {
  const inner = size - padding * 2
  const steps = 120
  const pts: string[] = []

  for (let i = 0; i <= steps; i++) {
    const input = (i / steps) * 2 - 1
    const output = interpolateCurvePoints(points, input)
    const x = padding + (input + 1) * 0.5 * inner
    const y = padding + (1 - output) * 0.5 * inner
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return pts.join(' ')
}

export function makeWaveshaperCurve(type: ClipType, drive: number, samples = 4096): Float32Array {
  return pointsToWaveshaperCurve(presetCurvePoints(type, drive), samples)
}

export function toneFrequency(tone: number): number {
  return 200 + tone * tone * 7800
}

export type DistortionGraph = {
  analyser: AnalyserNode
  setParams: (params: DistortionParams) => void
  startDemoSong: () => Promise<void>
  startGuitarInput: () => Promise<void>
  stop: () => void
  dispose: () => void
}

export function createDistortionGraph(): DistortionGraph {
  const ctx = new AudioContext()
  let params = initDefaultParams()

  const inputGain = ctx.createGain()
  const highPass = ctx.createBiquadFilter()
  highPass.type = 'highpass'
  highPass.frequency.value = 90
  highPass.Q.value = 0.7
  const waveshaper = ctx.createWaveShaper()
  waveshaper.oversample = '4x'
  const toneFilter = ctx.createBiquadFilter()
  toneFilter.type = 'lowpass'
  const outputGain = ctx.createGain()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 2048
  analyser.smoothingTimeConstant = 0.4

  inputGain.connect(highPass)
  highPass.connect(waveshaper)
  waveshaper.connect(toneFilter)
  toneFilter.connect(outputGain)
  outputGain.connect(analyser)
  analyser.connect(ctx.destination)

  let samplePlayer: GuitarSamplePlayer | null = null
  let mediaStream: MediaStream | null = null
  let mediaSource: MediaStreamAudioSourceNode | null = null

  function applyParams(next: DistortionParams) {
    params = next
    // Drive lives in the waveshaper curve — keeps each clip type in its distinct region
    inputGain.gain.value = 1
    const curve = next.bypass ? makeLinearCurve() : pointsToWaveshaperCurve(next.curvePoints)
    waveshaper.curve = curve as Float32Array<ArrayBuffer>
    toneFilter.frequency.value = toneFrequency(next.tone)
    outputGain.gain.value = next.output
  }

  function stopSource() {
    samplePlayer?.stop()
    samplePlayer = null
    mediaSource?.disconnect()
    mediaSource = null
    mediaStream?.getTracks().forEach((t) => t.stop())
    mediaStream = null
  }

  async function resume() {
    if (ctx.state === 'suspended') await ctx.resume()
  }

  applyParams(params)

  return {
    analyser,
    setParams: applyParams,
    async startDemoSong() {
      stopSource()
      await resume()
      samplePlayer = new GuitarSamplePlayer(ctx, inputGain)
      await samplePlayer.start()
    },
    async startGuitarInput() {
      stopSource()
      await resume()
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })
      mediaSource = ctx.createMediaStreamSource(mediaStream)
      mediaSource.connect(inputGain)
    },
    stop() {
      stopSource()
    },
    dispose() {
      stopSource()
      void ctx.close()
    },
  }
}

function makeLinearCurve(samples = 4096): Float32Array {
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    curve[i] = (i / (samples - 1)) * 2 - 1
  }
  return curve
}

export function buildTransferPath(
  type: ClipType,
  drive: number,
  size: number,
  padding: number,
): string {
  const inner = size - padding * 2
  const steps = 120
  const points: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const input = t * 2 - 1
    const output = clipSample(input, type, drive)
    const x = padding + (input + 1) * 0.5 * inner
    const y = padding + (1 - output) * 0.5 * inner
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return points.join(' ')
}
