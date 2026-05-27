import { createLabOutput, createLabSources, hzToLabel, msToSeconds, type LabGraphCore } from './labCommon'

export type HighPassParams = {
  frequency: number
  q: number
  output: number
}

export const defaultHighPassParams: HighPassParams = {
  frequency: 90,
  q: 0.7,
  output: 0.5,
}

export type HighPassGraph = LabGraphCore & { setParams: (params: HighPassParams) => void }

export function createHighPassGraph(): HighPassGraph {
  const ctx = new AudioContext()
  let params = { ...defaultHighPassParams }
  const input = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  input.connect(filter)
  filter.connect(outputGain)

  function applyParams(next: HighPassParams) {
    params = next
    filter.frequency.setTargetAtTime(next.frequency, ctx.currentTime, 0.02)
    filter.Q.setTargetAtTime(next.q, ctx.currentTime, 0.02)
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

export { hzToLabel, msToSeconds }
