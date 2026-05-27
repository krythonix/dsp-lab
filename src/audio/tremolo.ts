import { createLabOutput, createLabSources, type LabGraphCore } from './labCommon'

export type TremoloParams = {
  rateHz: number
  depth: number
  mix: number
  output: number
}

export const defaultTremoloParams: TremoloParams = {
  rateHz: 4,
  depth: 0.7,
  mix: 1,
  output: 0.5,
}

export type TremoloGraph = LabGraphCore & { setParams: (params: TremoloParams) => void }

export function createTremoloGraph(): TremoloGraph {
  const ctx = new AudioContext()
  let params = { ...defaultTremoloParams }
  const input = ctx.createGain()
  const dryGain = ctx.createGain()
  const wetGain = ctx.createGain()
  const modGain = ctx.createGain()
  const lfo = ctx.createOscillator()
  const lfoDepth = ctx.createGain()
  const lfoOffset = ctx.createConstantSource()
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  lfo.type = 'sine'
  lfoOffset.offset.value = 1
  lfo.connect(lfoDepth)
  lfoDepth.connect(modGain.gain)
  lfoOffset.connect(modGain.gain)
  lfoOffset.start()
  lfo.start()

  input.connect(dryGain)
  input.connect(modGain)
  modGain.connect(wetGain)
  dryGain.connect(outputGain)
  wetGain.connect(outputGain)

  function applyParams(next: TremoloParams) {
    params = next
    lfo.frequency.setTargetAtTime(next.rateHz, ctx.currentTime, 0.02)
    lfoDepth.gain.setTargetAtTime(next.depth * 0.5, ctx.currentTime, 0.02)
    lfoOffset.offset.setTargetAtTime(1 - next.depth * 0.5, ctx.currentTime, 0.02)
    dryGain.gain.setTargetAtTime(1 - next.mix, ctx.currentTime, 0.02)
    wetGain.gain.setTargetAtTime(next.mix, ctx.currentTime, 0.02)
    outputGain.gain.value = next.output
  }

  applyParams(params)

  return {
    analyser,
    setParams: applyParams,
    startDemoSong: sources.startDemoSong,
    startGuitarInput: sources.startGuitarInput,
    stop: sources.stopSource,
    dispose() {
      lfo.stop()
      lfoOffset.stop()
      sources.dispose()
      void ctx.close()
    },
  }
}
