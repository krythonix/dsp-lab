import { GuitarSamplePlayer } from './guitarSamplePlayer'

export type LabGraphCore = {
  analyser: AnalyserNode
  startDemoSong: () => Promise<void>
  startGuitarInput: () => Promise<void>
  stop: () => void
  dispose: () => void
}

export function createLabOutput(ctx: AudioContext) {
  const outputGain = ctx.createGain()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 2048
  analyser.smoothingTimeConstant = 0.35
  outputGain.connect(analyser)
  analyser.connect(ctx.destination)
  return { outputGain, analyser }
}

export function createLabSources(ctx: AudioContext, input: AudioNode) {
  let samplePlayer: GuitarSamplePlayer | null = null
  let mediaStream: MediaStream | null = null
  let mediaSource: MediaStreamAudioSourceNode | null = null

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

  return {
    async startDemoSong() {
      stopSource()
      await resume()
      samplePlayer = new GuitarSamplePlayer(ctx, input as GainNode)
      await samplePlayer.start()
    },
    async startGuitarInput() {
      stopSource()
      await resume()
      mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      mediaSource = ctx.createMediaStreamSource(mediaStream)
      mediaSource.connect(input)
    },
    stopSource,
    dispose() {
      stopSource()
    },
  }
}

export function msToSeconds(ms: number) {
  return ms / 1000
}

export function hzToLabel(hz: number) {
  return hz >= 1000 ? `${(hz / 1000).toFixed(1)} kHz` : `${Math.round(hz)} Hz`
}
