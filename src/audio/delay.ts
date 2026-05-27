import { GuitarSamplePlayer } from './guitarSamplePlayer'

export type DelayParams = {
  delayMs: number
  feedback: number
  mix: number
  output: number
}

export const defaultDelayParams: DelayParams = {
  delayMs: 320,
  feedback: 0.42,
  mix: 0.5,
  output: 0.45,
}

export type DelayGraph = {
  analyser: AnalyserNode
  setParams: (params: DelayParams) => void
  startDemoSong: () => Promise<void>
  startGuitarInput: () => Promise<void>
  stop: () => void
  dispose: () => void
}

export function msToSeconds(ms: number): number {
  return ms / 1000
}

export function echoCount(feedback: number, threshold = 0.05): number {
  if (feedback <= 0) return 1
  return Math.max(1, Math.ceil(Math.log(threshold) / Math.log(feedback)))
}

export function createDelayGraph(): DelayGraph {
  const ctx = new AudioContext()
  let params = { ...defaultDelayParams }

  const input = ctx.createGain()
  const dryGain = ctx.createGain()
  const wetGain = ctx.createGain()
  const delay = ctx.createDelay(2)
  const feedbackGain = ctx.createGain()
  const outputGain = ctx.createGain()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 2048
  analyser.smoothingTimeConstant = 0.35

  // input → dry path → output
  input.connect(dryGain)
  dryGain.connect(outputGain)

  // input → delay → wet path → output
  input.connect(delay)
  delay.connect(wetGain)
  wetGain.connect(outputGain)

  // feedback: delay → feedback → delay
  delay.connect(feedbackGain)
  feedbackGain.connect(delay)

  outputGain.connect(analyser)
  analyser.connect(ctx.destination)

  let samplePlayer: GuitarSamplePlayer | null = null
  let mediaStream: MediaStream | null = null
  let mediaSource: MediaStreamAudioSourceNode | null = null

  function applyParams(next: DelayParams) {
    params = next
    const seconds = msToSeconds(next.delayMs)
    delay.delayTime.setTargetAtTime(seconds, ctx.currentTime, 0.02)
    feedbackGain.gain.setTargetAtTime(Math.min(0.92, Math.max(0, next.feedback)), ctx.currentTime, 0.02)
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
      void ctx.close()
    },
  }
}
