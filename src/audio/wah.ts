import { createLabOutput, createLabSources, hzToLabel, type LabGraphCore } from './labCommon'

export type WahParams = {
  frequency: number
  q: number
  output: number
}

export const defaultWahParams: WahParams = {
  frequency: 800,
  q: 4.5,
  output: 0.5,
}

export type WahGraph = LabGraphCore & { setParams: (params: WahParams) => void }

export function createWahGraph(): WahGraph {
  const ctx = new AudioContext()
  let params = { ...defaultWahParams }
  const input = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  input.connect(filter)
  filter.connect(outputGain)

  function applyParams(next: WahParams) {
    params = next
    filter.frequency.setTargetAtTime(next.frequency, ctx.currentTime, 0.015)
    filter.Q.setTargetAtTime(next.q, ctx.currentTime, 0.015)
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

export { hzToLabel }
