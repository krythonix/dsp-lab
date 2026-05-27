import { createLabOutput, createLabSources, hzToLabel, type LabGraphCore } from './labCommon'

export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'peaking' | 'lowshelf' | 'highshelf'

export type FilterParams = {
  filterType: FilterType
  frequency: number
  q: number
  gainDb: number
  output: number
}

export const defaultFilterParams: FilterParams = {
  filterType: 'lowpass',
  frequency: 1200,
  q: 1.2,
  gainDb: 6,
  output: 0.5,
}

export type FilterGraph = LabGraphCore & { setParams: (params: FilterParams) => void }

export function createFilterGraph(): FilterGraph {
  const ctx = new AudioContext()
  let params = { ...defaultFilterParams }
  const input = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  input.connect(filter)
  filter.connect(outputGain)

  function applyParams(next: FilterParams) {
    params = next
    filter.type = next.filterType
    filter.frequency.setTargetAtTime(next.frequency, ctx.currentTime, 0.02)
    filter.Q.setTargetAtTime(next.q, ctx.currentTime, 0.02)
    filter.gain.setTargetAtTime(next.gainDb, ctx.currentTime, 0.02)
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
