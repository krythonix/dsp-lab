import { createLabOutput, createLabSources, type LabGraphCore } from './labCommon'

export type CompressorParams = {
  threshold: number
  ratio: number
  attack: number
  release: number
  makeup: number
  output: number
}

export const defaultCompressorParams: CompressorParams = {
  threshold: -24,
  ratio: 4,
  attack: 0.01,
  release: 0.2,
  makeup: 6,
  output: 0.5,
}

export type CompressorGraph = LabGraphCore & { setParams: (params: CompressorParams) => void }

export function createCompressorGraph(): CompressorGraph {
  const ctx = new AudioContext()
  let params = { ...defaultCompressorParams }
  const input = ctx.createGain()
  const compressor = ctx.createDynamicsCompressor()
  const makeupGain = ctx.createGain()
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  input.connect(compressor)
  compressor.connect(makeupGain)
  makeupGain.connect(outputGain)

  function applyParams(next: CompressorParams) {
    params = next
    compressor.threshold.setTargetAtTime(next.threshold, ctx.currentTime, 0.02)
    compressor.ratio.setTargetAtTime(next.ratio, ctx.currentTime, 0.02)
    compressor.knee.setTargetAtTime(6, ctx.currentTime, 0.02)
    compressor.attack.setTargetAtTime(next.attack, ctx.currentTime, 0.02)
    compressor.release.setTargetAtTime(next.release, ctx.currentTime, 0.02)
    makeupGain.gain.setTargetAtTime(Math.pow(10, next.makeup / 20), ctx.currentTime, 0.02)
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
      sources.dispose()
      void ctx.close()
    },
  }
}
