import { createLabOutput, createLabSources, msToSeconds, type LabGraphCore } from './labCommon'

export type ModMode = 'phaser' | 'flanger'

export type PhaserParams = {
  mode: ModMode
  rateHz: number
  depth: number
  centerHz: number
  feedback: number
  mix: number
  output: number
}

export const defaultPhaserParams: PhaserParams = {
  mode: 'phaser',
  rateHz: 0.5,
  depth: 0.7,
  centerHz: 700,
  feedback: 0.35,
  mix: 0.5,
  output: 0.5,
}

export type PhaserGraph = LabGraphCore & { setParams: (params: PhaserParams) => void }

export function createPhaserGraph(): PhaserGraph {
  const ctx = new AudioContext()
  let params = { ...defaultPhaserParams }

  const input = ctx.createGain()
  const dryGain = ctx.createGain()
  const phaserWet = ctx.createGain()
  const flangerWet = ctx.createGain()
  const lfo = ctx.createOscillator()
  const phaserLfoDepth = ctx.createGain()
  const flangerLfoDepth = ctx.createGain()
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  const allpasses = Array.from({ length: 4 }, () => {
    const f = ctx.createBiquadFilter()
    f.type = 'allpass'
    f.Q.value = 0.7
    return f
  })

  let phaserNode: AudioNode = input
  for (const ap of allpasses) {
    phaserNode.connect(ap)
    phaserLfoDepth.connect(ap.frequency)
    phaserNode = ap
  }
  phaserNode.connect(phaserWet)

  const flangerDelay = ctx.createDelay(0.02)
  const flangerFeedback = ctx.createGain()
  input.connect(flangerDelay)
  flangerDelay.connect(flangerFeedback)
  flangerFeedback.connect(flangerDelay)
  flangerDelay.connect(flangerWet)
  flangerLfoDepth.connect(flangerDelay.delayTime)

  lfo.type = 'sine'
  lfo.connect(phaserLfoDepth)
  lfo.connect(flangerLfoDepth)
  lfo.start()

  input.connect(dryGain)
  dryGain.connect(outputGain)
  phaserWet.connect(outputGain)
  flangerWet.connect(outputGain)

  function applyParams(next: PhaserParams) {
    params = next
    lfo.frequency.setTargetAtTime(next.rateHz, ctx.currentTime, 0.02)

    const phaserDepthHz = 200 + next.depth * 800
    phaserLfoDepth.gain.setTargetAtTime(phaserDepthHz, ctx.currentTime, 0.02)
    for (const ap of allpasses) {
      ap.frequency.setTargetAtTime(next.centerHz, ctx.currentTime, 0.02)
    }

    flangerDelay.delayTime.setTargetAtTime(msToSeconds(2 + next.depth * 5), ctx.currentTime, 0.02)
    flangerLfoDepth.gain.setTargetAtTime(msToSeconds(0.5 + next.depth * 3), ctx.currentTime, 0.02)
    flangerFeedback.gain.setTargetAtTime(Math.min(0.85, next.feedback), ctx.currentTime, 0.02)

    const wet = next.mix
    dryGain.gain.setTargetAtTime(1 - wet, ctx.currentTime, 0.02)
    if (next.mode === 'phaser') {
      phaserWet.gain.setTargetAtTime(wet, ctx.currentTime, 0.02)
      flangerWet.gain.setTargetAtTime(0, ctx.currentTime, 0.02)
    } else {
      phaserWet.gain.setTargetAtTime(0, ctx.currentTime, 0.02)
      flangerWet.gain.setTargetAtTime(wet, ctx.currentTime, 0.02)
    }
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
      sources.dispose()
      void ctx.close()
    },
  }
}
