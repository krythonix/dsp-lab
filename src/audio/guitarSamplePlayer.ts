/** Clean guitar sample bundled in /public/audio/ */
export const CLEAN_GUITAR_SAMPLE_URL = `${import.meta.env.BASE_URL}audio/clean-guitar-demo.mp3`

let cachedBuffer: AudioBuffer | null = null

async function loadSample(ctx: AudioContext): Promise<AudioBuffer> {
  if (cachedBuffer) return cachedBuffer

  const response = await fetch(CLEAN_GUITAR_SAMPLE_URL)
  if (!response.ok) {
    throw new Error(`Failed to load guitar sample (${response.status})`)
  }

  const data = await response.arrayBuffer()
  cachedBuffer = await ctx.decodeAudioData(data)
  return cachedBuffer
}

export class GuitarSamplePlayer {
  private source: AudioBufferSourceNode | null = null
  private level: GainNode
  private ctx: AudioContext

  constructor(ctx: AudioContext, destination: AudioNode) {
    this.ctx = ctx
    this.level = ctx.createGain()
    this.level.gain.value = 1.15
    this.level.connect(destination)
  }

  async start() {
    const buffer = await loadSample(this.ctx)
    this.stop()

    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(this.level)
    source.start(0)
    this.source = source
  }

  stop() {
    if (!this.source) return
    try {
      this.source.stop()
    } catch {
      /* already stopped */
    }
    this.source.disconnect()
    this.source = null
  }
}
