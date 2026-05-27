import { GuitarSamplePlayer } from './guitarSamplePlayer'

export type ChorusParams = {
  centerMs: number
  depthMs: number
  rateHz: number
  mix: number
  output: number
}

export const defaultChorusParams: ChorusParams = {
  centerMs: 22,
  depthMs: 8,
  rateHz: 0.7,
  mix: 0.5,
  output: 0.45,
}

export type ChorusGraph = {
  analyser: AnalyserNode
  setParams: (params: ChorusParams) => void
  startDemoSong: () => Promise<void>
  startGuitarInput: () => Promise<void>
  stop: () => void
  dispose: () => void
}

export function msToSeconds(ms: number): number {
  return ms / 1000
}

export function delayRangeMs(centerMs: number, depthMs: number): { min: number; max: number } {
  return {
    min: Math.max(1, centerMs - depthMs),
    max: centerMs + depthMs,
  }
}

export function createChorusGraph(): ChorusGraph {
  const ctx = new AudioContext()
  let params = { ...defaultChorusParams }

  const input = ctx.createGain()
  const dryGain = ctx.createGain()
  const wetGain = ctx.createGain()
  const delay = ctx.createDelay(0.08)
  const lfo = ctx.createOscillator()
  const lfoDepth = ctx.createGain()
  const outputGain = ctx.createGain()
  const analyser = ctx.createAnalyser()

  lfo.type = 'sine'
  analyser.fftSize = 2048
  analyser.smoothingTimeConstant = 0.35

  input.connect(dryGain)
  dryGain.connect(outputGain)

  input.connect(delay)
  delay.connect(wetGain)
  wetGain.connect(outputGain)

  lfo.connect(lfoDepth)
  lfoDepth.connect(delay.delayTime)
  lfo.start()

  outputGain.connect(analyser)
  analyser.connect(ctx.destination)

  let samplePlayer: GuitarSamplePlayer | null = null
  let mediaStream: MediaStream | null = null
  let mediaSource: MediaStreamAudioSourceNode | null = null

  function applyParams(next: ChorusParams) {
    params = next
    const center = msToSeconds(next.centerMs)
    const depth = msToSeconds(next.depthMs)

    delay.delayTime.setTargetAtTime(center, ctx.currentTime, 0.02)
    lfoDepth.gain.setTargetAtTime(depth, ctx.currentTime, 0.02)
    lfo.frequency.setTargetAtTime(Math.max(0.05, next.rateHz), ctx.currentTime, 0.02)
    dryGain.gain.setTargetAtTime(1 - next.mix, ctx.currentTime, 0.02)
    wetGain.gain.setTargetAtTime(next.mix, ctx.currentTime, 0.02)
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
      samplePlayer = new GuitarSamplePlayer(ctx, input)
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
      mediaSource.connect(input)
    },
    stop() {
      stopSource()
    },
    dispose() {
      stopSource()
      lfo.stop()
      void ctx.close()
    },
  }
}
