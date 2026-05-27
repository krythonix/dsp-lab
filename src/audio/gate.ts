import { createLabOutput, createLabSources, type LabGraphCore } from './labCommon'

export type GateParams = {
  threshold: number
  attackMs: number
  releaseMs: number
  output: number
}

export const defaultGateParams: GateParams = {
  threshold: 0.015,
  attackMs: 5,
  releaseMs: 120,
  output: 0.5,
}

export type GateGraph = LabGraphCore & { setParams: (params: GateParams) => void }

export function createGateGraph(): GateGraph {
  const ctx = new AudioContext()
  let params = { ...defaultGateParams }
  const input = ctx.createGain()
  const gateGain = ctx.createGain()
  const meter = ctx.createAnalyser()
  meter.fftSize = 512
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  input.connect(meter)
  input.connect(gateGain)
  gateGain.connect(outputGain)

  let raf = 0
  let open = 1

  function tick() {
    const data = new Float32Array(meter.fftSize)
    meter.getFloatTimeDomainData(data)
    let sum = 0
    for (let i = 0; i < data.length; i++) sum += data[i] * data[i]
    const rms = Math.sqrt(sum / data.length)
    const target = rms >= params.threshold ? 1 : 0.001
    if (target !== open) {
      open = target
      const time = target > 0.5 ? params.attackMs / 1000 : params.releaseMs / 1000
      gateGain.gain.setTargetAtTime(target, ctx.currentTime, Math.max(0.001, time * 0.35))
    }
    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)

  function applyParams(next: GateParams) {
    params = next
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
      cancelAnimationFrame(raf)
      sources.dispose()
      void ctx.close()
    },
  }
}
