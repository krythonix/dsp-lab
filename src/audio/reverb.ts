import { createLabOutput, createLabSources, msToSeconds, type LabGraphCore } from './labCommon'

export type ReverbParams = {
  decay: number
  preDelayMs: number
  mix: number
  output: number
}

export const defaultReverbParams: ReverbParams = {
  decay: 2.2,
  preDelayMs: 20,
  mix: 0.35,
  output: 0.5,
}

function buildImpulse(ctx: AudioContext, duration: number, decay: number) {
  const rate = ctx.sampleRate
  const length = Math.floor(rate * duration)
  const impulse = ctx.createBuffer(2, length, rate)
  for (let c = 0; c < 2; c++) {
    const ch = impulse.getChannelData(c)
    for (let i = 0; i < length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  return impulse
}

export type ReverbGraph = LabGraphCore & { setParams: (params: ReverbParams) => void }

export function createReverbGraph(): ReverbGraph {
  const ctx = new AudioContext()
  let params = { ...defaultReverbParams }

  const input = ctx.createGain()
  const dryGain = ctx.createGain()
  const wetGain = ctx.createGain()
  const preDelay = ctx.createDelay(0.2)
  const convolver = ctx.createConvolver()
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  convolver.buffer = buildImpulse(ctx, 2.5, params.decay)

  input.connect(dryGain)
  dryGain.connect(outputGain)
  input.connect(preDelay)
  preDelay.connect(convolver)
  convolver.connect(wetGain)
  wetGain.connect(outputGain)

  function applyParams(next: ReverbParams) {
    const decayChanged = Math.abs(next.decay - params.decay) > 0.05
    params = next
    preDelay.delayTime.setTargetAtTime(msToSeconds(next.preDelayMs), ctx.currentTime, 0.02)
    dryGain.gain.setTargetAtTime(1 - next.mix, ctx.currentTime, 0.02)
    wetGain.gain.setTargetAtTime(next.mix, ctx.currentTime, 0.02)
    outputGain.gain.value = next.output
    if (decayChanged) {
      convolver.buffer = buildImpulse(ctx, 2.5, next.decay)
    }
  }

  applyParams(params)

  return {
    analyser,
    setParams: applyParams,
    startDemoSong: sources.startDemoSong,
    startGuitarInput: sources.startGuitarInput,
    stop: sources.stopSource,
    dispose() {
      sources.dispose()
      void ctx.close()
    },
  }
}
