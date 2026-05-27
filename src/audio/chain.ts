import { createLabOutput, createLabSources, msToSeconds, type LabGraphCore } from './labCommon'
import { pointsToWaveshaperCurve, presetCurvePoints } from './distortion'

export type ChainBlock = 'drive' | 'filter' | 'delay' | 'chorus'

export type ChainParams = {
  order: ChainBlock[]
  bypass: Record<ChainBlock, boolean>
  drive: number
  filterCutoff: number
  delayMs: number
  delayMix: number
  chorusMix: number
  output: number
}

export const defaultChainParams: ChainParams = {
  order: ['drive', 'filter', 'delay', 'chorus'],
  bypass: { drive: false, filter: false, delay: false, chorus: false },
  drive: 6,
  filterCutoff: 2200,
  delayMs: 280,
  delayMix: 0.25,
  chorusMix: 0.35,
  output: 0.45,
}

export const chainBlockLabels: Record<ChainBlock, string> = {
  drive: 'Drive',
  filter: 'Tone filter',
  delay: 'Delay',
  chorus: 'Chorus',
}

type BlockShell = { input: GainNode; out: GainNode; effectSend: GainNode; bypass: GainNode }

export type ChainGraph = LabGraphCore & { setParams: (params: ChainParams) => void }

export function createChainGraph(): ChainGraph {
  const ctx = new AudioContext()
  let params = { ...defaultChainParams }
  const input = ctx.createGain()
  const { outputGain, analyser } = createLabOutput(ctx)
  const sources = createLabSources(ctx, input)

  const drive = ctx.createWaveShaper()
  drive.oversample = '2x'
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'

  const delayNode = ctx.createDelay(1)
  const delayFeedback = ctx.createGain()
  const delayWet = ctx.createGain()
  const delayDry = ctx.createGain()
  const delayMerge = ctx.createGain()

  const chorusDelay = ctx.createDelay(0.08)
  const chorusLfo = ctx.createOscillator()
  const chorusLfoDepth = ctx.createGain()
  chorusLfo.type = 'sine'
  chorusLfo.connect(chorusLfoDepth)
  chorusLfoDepth.connect(chorusDelay.delayTime)
  chorusLfo.start()
  const chorusWet = ctx.createGain()
  const chorusDry = ctx.createGain()
  const chorusMerge = ctx.createGain()

  function makeShell(wireEffect: (from: GainNode, to: GainNode) => void): BlockShell {
    const blockInput = ctx.createGain()
    const out = ctx.createGain()
    const effectSend = ctx.createGain()
    const bypass = ctx.createGain()
    blockInput.connect(bypass)
    bypass.connect(out)
    blockInput.connect(effectSend)
    wireEffect(effectSend, out)
    return { input: blockInput, out, effectSend, bypass }
  }

  const driveShell = makeShell((from, to) => {
    from.connect(drive)
    drive.connect(to)
  })

  const filterShell = makeShell((from, to) => {
    from.connect(filter)
    filter.connect(to)
  })

  const delayShell = makeShell((from, to) => {
    from.connect(delayDry)
    from.connect(delayNode)
    delayDry.connect(delayMerge)
    delayNode.connect(delayWet)
    delayWet.connect(delayMerge)
    delayNode.connect(delayFeedback)
    delayFeedback.connect(delayNode)
    delayMerge.connect(to)
  })

  const chorusShell = makeShell((from, to) => {
    from.connect(chorusDry)
    from.connect(chorusDelay)
    chorusDry.connect(chorusMerge)
    chorusDelay.connect(chorusWet)
    chorusWet.connect(chorusMerge)
    chorusMerge.connect(to)
  })

  const blockMap: Record<ChainBlock, BlockShell> = {
    drive: driveShell,
    filter: filterShell,
    delay: delayShell,
    chorus: chorusShell,
  }

  let tail: AudioNode = input
  const links: ChainBlock[] = []

  function rebuildChain() {
    for (const id of links) {
      try {
        tail.disconnect(blockMap[id].input)
      } catch {
        /* ok */
      }
    }
    try {
      tail.disconnect(outputGain)
    } catch {
      /* ok */
    }
    links.length = 0
    tail = input
    for (const id of params.order) {
      tail.connect(blockMap[id].input)
      tail = blockMap[id].out
      links.push(id)
    }
    tail.connect(outputGain)
  }

  function applyBlockBypass(shell: BlockShell, isBypass: boolean) {
    shell.effectSend.gain.setTargetAtTime(isBypass ? 0 : 1, ctx.currentTime, 0.01)
    shell.bypass.gain.setTargetAtTime(isBypass ? 1 : 0, ctx.currentTime, 0.01)
  }

  function applyParams(next: ChainParams) {
    const orderChanged =
      next.order.length !== params.order.length || next.order.some((b, i) => b !== params.order[i])
    params = next

    drive.curve = pointsToWaveshaperCurve(presetCurvePoints('soft', next.drive)) as Float32Array<ArrayBuffer>
    filter.frequency.setTargetAtTime(next.filterCutoff, ctx.currentTime, 0.02)
    delayNode.delayTime.setTargetAtTime(msToSeconds(next.delayMs), ctx.currentTime, 0.02)
    delayFeedback.gain.setTargetAtTime(0.35, ctx.currentTime, 0.02)
    delayDry.gain.setTargetAtTime(1 - next.delayMix, ctx.currentTime, 0.02)
    delayWet.gain.setTargetAtTime(next.delayMix, ctx.currentTime, 0.02)
    chorusDelay.delayTime.setTargetAtTime(msToSeconds(22), ctx.currentTime, 0.02)
    chorusLfo.frequency.setTargetAtTime(0.6, ctx.currentTime, 0.02)
    chorusLfoDepth.gain.setTargetAtTime(msToSeconds(8), ctx.currentTime, 0.02)
    chorusDry.gain.setTargetAtTime(1 - next.chorusMix, ctx.currentTime, 0.02)
    chorusWet.gain.setTargetAtTime(next.chorusMix, ctx.currentTime, 0.02)

    for (const id of next.order) {
      applyBlockBypass(blockMap[id], next.bypass[id])
    }

    outputGain.gain.value = next.output
    if (orderChanged) rebuildChain()
  }

  driveShell.effectSend.gain.value = 1
  driveShell.bypass.gain.value = 0
  filterShell.effectSend.gain.value = 1
  filterShell.bypass.gain.value = 0
  delayShell.effectSend.gain.value = 1
  delayShell.bypass.gain.value = 0
  chorusShell.effectSend.gain.value = 1
  chorusShell.bypass.gain.value = 0

  rebuildChain()
  applyParams(params)

  return {
    analyser,
    setParams: applyParams,
    startDemoSong: sources.startDemoSong,
    startGuitarInput: sources.startGuitarInput,
    stop: sources.stopSource,
    dispose() {
      chorusLfo.stop()
      sources.dispose()
      void ctx.close()
    },
  }
}

export function moveBlock(order: ChainBlock[], block: ChainBlock, dir: -1 | 1): ChainBlock[] {
  const idx = order.indexOf(block)
  if (idx < 0) return order
  const next = idx + dir
  if (next < 0 || next >= order.length) return order
  const copy = [...order]
  ;[copy[idx], copy[next]] = [copy[next], copy[idx]]
  return copy
}
