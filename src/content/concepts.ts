export type ConceptSection = {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export type Concept = {
  slug: string
  num: number | null
  name: string
  tagline: string
  category: 'core' | 'bonus'
  diagram: string
  related: string[]
  sections: ConceptSection[]
  formula?: string
  guitarExamples: string[]
  commonMistakes?: string[]
}

export const concepts: Concept[] = [
  {
    slug: 'sample',
    num: 1,
    name: 'Sample',
    tagline: 'One tiny slice of audio at a single moment in time.',
    category: 'core',
    diagram: 'sample',
    related: ['signal-flow', 'sample-rate-buffers', 'delay-line'],
    guitarExamples: [
      'Every note you play becomes thousands of numbers per second in a DAW.',
      'A digital pedal runs the same process: input sample → math → output sample.',
      'When people say “digital sound,” they often mean how those samples are processed — not the sample idea itself.',
    ],
    sections: [
      {
        title: 'What it is',
        paragraphs: [
          'Sound in the real world is a continuous pressure wave. Computers cannot store infinity — they measure the wave at regular intervals and store each measurement as a number. That one number is a sample.',
          'Think of a flipbook: each page is a snapshot. Play them fast enough and you hear motion. Audio works the same way at roughly 44,100 snapshots per second (CD quality).',
        ],
      },
      {
        title: 'How DSP uses it',
        paragraphs: [
          'Almost every guitar effect is a function that runs on each sample (or small groups called buffers):',
        ],
        bullets: [
          'Input: read one sample from the guitar',
          'Process: multiply, clip, delay, filter…',
          'Output: write one sample to the amp or next pedal',
        ],
      },
      {
        title: 'Why it matters for guitar',
        paragraphs: [
          'Once you think in samples, effects stop being magic boxes. Overdrive is “change this number using a curve.” Delay is “play back an old number.” Chorus is “mix today’s number with a slightly late copy.”',
        ],
      },
    ],
    formula: 'audio[n] = value at time step n',
    commonMistakes: [
      'Thinking “digital” means low quality — sample rate and processing matter more than the word digital.',
      'Confusing sample (one value) with sample rate (how many per second).',
    ],
  },
  {
    slug: 'signal-flow',
    num: 2,
    name: 'Signal flow',
    tagline: 'The order effects sit in your chain — and why that order changes the sound.',
    category: 'core',
    diagram: 'signal-flow',
    related: ['sample', 'dry-wet', 'clipping', 'delay-line'],
    guitarExamples: [
      'Drive → delay → reverb: distorted echoes that stay musical.',
      'Delay → drive: each echo hit gets clipped again — often messy.',
      'Compressor before drive: evens picking so drive responds consistently.',
      'Gate after high-gain fuzz: kills hiss between notes.',
    ],
    sections: [
      {
        title: 'What it is',
        paragraphs: [
          'Signal flow is the path audio takes from guitar to speaker. Each block receives the output of the previous block. The chain is serial unless an effect explicitly splits the signal (chorus, delay with mix, etc.).',
        ],
      },
      {
        title: 'Why order matters',
        paragraphs: [
          'Effects interact. A waveshaper (drive) creates new harmonics; a filter after it shapes those harmonics. Put filter before drive and you change what gets clipped. Same blocks, different order = different tone.',
        ],
        bullets: [
          'Gain staging: how loud each stage is affects how hard the next stage works.',
          'Serial clipping: multiple drives stack saturation.',
          'Time effects usually after drive so echoes repeat the distorted tone, not clean tone into distortion.',
        ],
      },
      {
        title: 'Typical starting chains',
        paragraphs: ['There are no absolute rules, but these orders are common starting points:'],
        bullets: [
          'Tuner → wah → compressor → drive → modulation → delay → reverb → amp',
          'Amp effects loop: send delay/reverb after amp preamp distortion',
          'Four-cable method: pre effects into amp input, time effects in loop',
        ],
      },
    ],
    commonMistakes: [
      ' Putting reverb before heavy drive (often turns to mush).',
      'Ignoring amp input level — hot pickups can make a clean amp clip at the input.',
    ],
  },
  {
    slug: 'linear-nonlinear',
    num: 3,
    name: 'Linear vs nonlinear',
    tagline: 'Volume scales the wave; nonlinear processing reshapes it.',
    category: 'core',
    diagram: 'linear-nonlinear',
    related: ['clipping', 'filter-eq', 'compressor'],
    guitarExamples: [
      'Clean boost pedal: linear — louder, same character.',
      'Overdrive: nonlinear — same note, new timbre.',
      'Treble knob on amp: mostly linear frequency scaling (via filter).',
      'Turning master volume down: linear level change.',
    ],
    sections: [
      {
        title: 'Linear processing',
        paragraphs: [
          'Output is proportional to input: if you double the input, output doubles. Clean volume changes, balance knobs, and simple boosts are (mostly) linear. The waveform shape stays the same — only size changes.',
        ],
        bullets: ['y = gain × x', 'No new harmonics from pure linear gain', 'Superposition works: mixing two inputs behaves predictably'],
      },
      {
        title: 'Nonlinear processing',
        paragraphs: [
          'Output is not proportional. Small inputs might stay clean while large inputs saturate — or the curve is always bent. This reshapes the wave and creates harmonics. All drive, fuzz, and amp breakup is nonlinear.',
        ],
        bullets: ['y = f(x) where f is a curve, not a straight line', 'Harmonics appear because the shape changes', 'Harder picking → more saturation (dynamic response)'],
      },
      {
        title: 'The gray area',
        paragraphs: [
          'Compressors multiply by a changing gain — level-dependent, but usually not “tone” distortion. Filters are linear in the small-signal sense but change different frequencies by different amounts. For guitar, the useful split is: “Does this mainly change level/shape of the same wave, or bend the wave into something new?”',
        ],
      },
    ],
    formula: 'Linear: y = g·x  |  Nonlinear: y = f(x)',
  },
  {
    slug: 'clipping',
    num: 4,
    name: 'Clipping / waveshaping',
    tagline: 'Limiting how high the signal can go — the heart of overdrive, distortion, and fuzz.',
    category: 'core',
    diagram: 'clipping',
    related: ['linear-nonlinear', 'harmonics', 'filter-eq'],
    guitarExamples: [
      'Tube amp edge of breakup: soft clip.',
      'Boss DS-1: hard clip distortion.',
      'Big Muff: extreme clip + heavy filter.',
      'Amp input clipping: hitting preamp too hard with boost pedal.',
    ],
    sections: [
      {
        title: 'What clipping is',
        paragraphs: [
          'Clipping is when the processor runs out of headroom. Peaks that would go higher get flattened. That flattening changes the wave shape and adds harmonics. Waveshaping is the general term: any function that maps input level to output level via a curve.',
        ],
      },
      {
        title: 'Soft vs hard vs fuzz',
        paragraphs: ['Severity of the flattening defines the family:'],
        bullets: [
          'Soft clip (overdrive): rounded knees — tanh-style curves, warm breakup.',
          'Hard clip (distortion): flat tops — clamp at ±1, aggressive but defined.',
          'Fuzz: stays at the ceiling longer — near-square wave, buzzy and compressed.',
        ],
      },
      {
        title: 'Transfer function view',
        paragraphs: [
          'Plot input on X and output on Y. Linear is a straight line. Clipper curves bend and flatten at the top. The steeper the bend and the earlier the flat part, the dirtier the sound.',
        ],
      },
      {
        title: 'In a pedal or plugin',
        paragraphs: [
          'Usually: input gain pushes the signal into the curve, tone filter shapes highs after clipping, output gain sets level. Same structure as a real tube stage: amplify → saturate → EQ.',
        ],
      },
    ],
    formula: 'Soft: y = tanh(g·x)  |  Hard: y = clamp(g·x, −1, 1)  |  Fuzz: y ≈ sign(x)·(1 − e^−|x|)',
    commonMistakes: [
      'Thinking fuzz is not clipping — it is the hardest clipping.',
      'Using too much drive before time effects and wondering why it sounds chaotic.',
    ],
  },
  {
    slug: 'harmonics',
    num: 5,
    name: 'Harmonics',
    tagline: 'Extra frequencies created when a wave is reshaped — the “grit” and “buzz.”',
    category: 'core',
    diagram: 'harmonics',
    related: ['clipping', 'filter-eq', 'linear-nonlinear'],
    guitarExamples: [
      'Clean sine-like tone: mostly fundamental (the note you fingered).',
      'Crunchy overdrive: strong 2nd and 3rd harmonics — sounds full and warm.',
      'Fuzz: rich odd harmonics (3rd, 5th, 7th…) — buzzy, violin-like on single notes.',
      'Tone knob after drive: cuts harsh upper harmonics.',
    ],
    sections: [
      {
        title: 'What they are',
        paragraphs: [
          'Play an A (110 Hz). Harmonics are energy at 220 Hz, 330 Hz, 440 Hz… — integer multiples of the fundamental. Your ear still hears A, but the balance of harmonics defines timbre: bright, warm, hollow, buzzy.',
        ],
      },
      {
        title: 'Why clipping creates them',
        paragraphs: [
          'A perfect sine wave has one frequency. Flatten the peaks and the wave is no longer a pure sine — Fourier analysis says it contains many sine waves added together. More clipping → stronger harmonics → more perceived distortion.',
        ],
      },
      {
        title: 'Odd vs even',
        paragraphs: [
          'Symmetric clipping (same on positive and negative swings) emphasizes odd harmonics — square-ish fuzz. Asymmetric clipping (one side different) adds even harmonics — often described as warmer or smoother. Tube stages are often slightly asymmetric.',
        ],
        bullets: [
          'Odd harmonics (3rd, 5th): edgy, hollow, aggressive',
          'Even harmonics (2nd, 4th): sweet, vocal, creamy',
        ],
      },
      {
        title: 'EQ after drive',
        paragraphs: [
          'Distortion generates harmonics across the spectrum. A tone control or low-pass filter after the clipper removes harsh high harmonics. Many “muff” sounds are clip + strong high cut.',
        ],
      },
    ],
  },
  {
    slug: 'filter-eq',
    num: 6,
    name: 'Filter / EQ',
    tagline: 'Boost or cut different frequencies — tone knobs, wah, and mud control.',
    category: 'core',
    diagram: 'filter-eq',
    related: ['harmonics', 'clipping', 'high-pass-filter'],
    guitarExamples: [
      'Amp treble/middle/bass: three-band EQ on your tone.',
      'Wah: a peak filter sweeping up and down.',
      'Big Muff tone knob: low-pass after fuzz — dark wool.',
      'Tele bridge pickup + bright amp: naturally less low end.',
    ],
    sections: [
      {
        title: 'What filters do',
        paragraphs: [
          'Filters change how much each frequency passes through. Low-pass lets lows through and rolls off highs. High-pass does the opposite. Band-pass emphasizes a range — wah is a moving band-pass/peaking filter.',
        ],
      },
      {
        title: 'Common types',
        paragraphs: [],
        bullets: [
          'Low-pass: treble roll-off, warmer/darker',
          'High-pass: rumble removal, thinner/brighter',
          'Peaking/shelf: boost or cut a band (mid scoop, presence boost)',
          'Notch: cut a narrow band (60 Hz hum in studio, rarely on stage)',
        ],
      },
      {
        title: 'Placement in the chain',
        paragraphs: [
          'Filter before drive: shapes what gets clipped — less highs in means less fizz out. Filter after drive: tames harmonics already created. Wah before drive = filtered distortion; wah after drive = distorted wah (different character).',
        ],
      },
      {
        title: 'Simple mental model',
        paragraphs: [
          'You do not need biquad math to use EQ. Think: which part of the spectrum is too much or too little? Mud = cut lows. Harsh = cut highs. Can’t cut through the mix = try mids.',
        ],
      },
    ],
    formula: 'Example low-pass idea: keep lows, attenuate highs above cutoff',
  },
  {
    slug: 'delay-line',
    num: 7,
    name: 'Delay line',
    tagline: 'A buffer of past samples played back later — echo, width, and ambience.',
    category: 'core',
    diagram: 'delay-line',
    related: ['dry-wet', 'lfo', 'sample'],
    guitarExamples: [
      'Slapback echo: one repeat ~80–120 ms — rockabilly.',
      'Dotted-eighth delay: U2-style rhythmic repeats.',
      'Chorus: very short delay (10–30 ms) modulated by LFO.',
      'Reverb: many short delays in a network simulating a room.',
    ],
    sections: [
      {
        title: 'What it is',
        paragraphs: [
          'A delay line stores recent samples in a buffer. To create an echo, read from the buffer at an index that is N samples behind the current write position. N depends on delay time and sample rate: at 44.1 kHz, 441 samples ≈ 10 ms.',
        ],
      },
      {
        title: 'Basic echo algorithm',
        paragraphs: [],
        bullets: [
          'Write each incoming sample into the buffer.',
          'Read sample from (current position − delay in samples).',
          'Optional feedback: mix read sample back into write for repeats.',
          'Mix dry + delayed for output level control.',
        ],
      },
      {
        title: 'From echo to reverb',
        paragraphs: [
          'One delay = echo. Modulate delay time slightly = chorus/flanger. Many delays + filters + feedback web = reverb. Same building block, different architecture.',
        ],
      },
    ],
    formula: 'delaySamples = delayTimeSeconds × sampleRate',
  },
  {
    slug: 'dry-wet',
    num: 8,
    name: 'Dry / wet mix',
    tagline: 'Blend the untouched signal with the processed copy.',
    category: 'core',
    diagram: 'dry-wet',
    related: ['delay-line', 'signal-flow', 'lfo'],
    guitarExamples: [
      'Delay mix at 30%: mostly direct guitar, hints of echo.',
      'Chorus at 50/50: maximum shimmer; 100% wet can sound thin alone.',
      'Reverb mix: low for subtle room, high for ambient wash.',
      'Parallel compression: blend squashed signal with dry for punch + body.',
    ],
    sections: [
      {
        title: 'What it is',
        paragraphs: [
          'Dry = original signal path. Wet = path through the effect. Mix combines them. Most time-based and ambient effects need both paths; 100% wet chorus or reverb often sounds unnatural alone because you lose attack and body.',
        ],
      },
      {
        title: 'The math',
        paragraphs: [
          'Simple mix: output = dry × (1 − mix) + wet × mix, where mix is 0 to 1. Some pedals use parallel internal routing even when you only see one output jack.',
        ],
      },
      {
        title: 'Serial vs parallel',
        paragraphs: [
          'Serial: entire signal goes through the effect (classic drive — no dry unless blended internally). Parallel: split, process one branch, recombine — common in studio compression and some modern reverbs/delays.',
        ],
      },
    ],
    formula: 'out = dry × (1 − m) + wet × m',
  },
  {
    slug: 'lfo',
    num: 9,
    name: 'LFO',
    tagline: 'A slow cyclic control signal that makes effects move over time.',
    category: 'core',
    diagram: 'lfo',
    related: ['delay-line', 'dry-wet', 'filter-eq'],
    guitarExamples: [
      'Chorus: LFO wiggles delay time — pitch shimmer.',
      'Tremolo: LFO moves volume — pulsing.',
      'Phaser: LFO sweeps notch filters.',
      'Vibrato: LFO modulates pitch (short delay modulation).',
    ],
    sections: [
      {
        title: 'What it is',
        paragraphs: [
          'LFO = Low-Frequency Oscillator. It produces a slow wave (sine, triangle, square…) typically between 0.1 Hz and 20 Hz — below musical pitch. You usually do not hear the LFO directly; it controls another parameter.',
        ],
      },
      {
        title: 'What it modulates',
        paragraphs: [],
        bullets: [
          'Delay time → chorus, flanger, vibrato',
          'Gain → tremolo',
          'Filter cutoff → auto-wah, phaser',
          'Pan position → stereo motion',
        ],
      },
      {
        title: 'Rate and depth',
        paragraphs: [
          'Rate: how fast the cycle runs (Hz or BPM sync). Depth: how far the parameter swings. Slow rate + moderate depth = lush chorus. Fast tremolo rate = choppy square-wave chop.',
        ],
      },
    ],
    formula: 'parameter(t) = base + depth × sin(2π × rate × t)',
  },
  {
    slug: 'sample-rate-buffers',
    num: 10,
    name: 'Sample rate & buffers',
    tagline: 'How fast audio is measured, and why processors work in chunks.',
    category: 'core',
    diagram: 'sample-rate',
    related: ['sample', 'delay-line'],
    guitarExamples: [
      '44.1 kHz: standard CD/streaming — 44,100 samples per second per channel.',
      '48 kHz: common in video/live sound.',
      'Buffer size 128 at 48 kHz ≈ 2.7 ms latency — tradeoff vs CPU load.',
      'Digital pedal or Helix: same principles, optimized hardware.',
    ],
    sections: [
      {
        title: 'Sample rate',
        paragraphs: [
          'Sample rate is how many samples per second. Higher rates capture ultrasonic content and ease filter design; 44.1/48 kHz is enough for guitar. Double sample rate = double memory for same delay time in seconds.',
        ],
      },
      {
        title: 'Buffers',
        paragraphs: [
          'Instead of processing one sample at a time, systems process blocks (64, 128, 512 samples…) for efficiency. Larger buffer = more latency but less CPU stress. Live playing wants small buffers; mixing can use large ones.',
        ],
      },
      {
        title: 'Latency',
        paragraphs: [
          'Total delay through ADC → processing → DAC. Small buffers reduce it but increase glitch risk if CPU spikes. Amp sims and interfaces expose buffer size in settings — the guitar DSP “feel” lives here.',
        ],
      },
    ],
    formula: 'latency ≈ bufferSize / sampleRate (+ conversion overhead)',
  },
  {
    slug: 'compressor',
    num: null,
    name: 'Compressor',
    tagline: 'Automatic volume control — loud parts down, quiet parts up.',
    category: 'bonus',
    diagram: 'compressor',
    related: ['linear-nonlinear', 'signal-flow', 'sample'],
    guitarExamples: [
      'Country chicken-pickin: fast compressor, snappy attack.',
      'Sustain for slide: slow attack, high ratio, makeup gain.',
      'Funk: Dyna Comp squashing transients for percussive rhythm.',
      'Always-on low ratio glue before amp in studio rigs.',
    ],
    sections: [
      {
        title: 'What it does',
        paragraphs: [
          'A compressor reduces dynamic range. When input exceeds a threshold, gain is reduced by a ratio (4:1 means 4 dB in → 1 dB out above threshold). Makeup gain brings overall level back up, so quiet parts sound louder relative to peaks.',
        ],
      },
      {
        title: 'Key controls',
        paragraphs: [],
        bullets: [
          'Threshold: level where compression starts',
          'Ratio: how strongly peaks are reduced',
          'Attack: how fast gain reduction engages',
          'Release: how fast gain recovers',
          'Makeup gain: boost after compression',
        ],
      },
      {
        title: 'Not the same as clipping',
        paragraphs: [
          'Compression changes gain over time using an envelope follower — the wave shape stays smooth unless you hit extreme settings. Clipping flattens peaks instantly via a static curve. Comps control dynamics; drives create harmonics.',
        ],
      },
    ],
    formula: 'above threshold: outIncrease ≈ inIncrease / ratio',
  },
  {
    slug: 'noise-gate',
    num: null,
    name: 'Noise gate',
    tagline: 'Mute the signal when you are not playing — kills hiss and hum.',
    category: 'bonus',
    diagram: 'noise-gate',
    related: ['compressor', 'signal-flow', 'clipping'],
    guitarExamples: [
      'After high-gain fuzz: silences amp hiss between phrases.',
      'Metal rhythm: tight chugs without noise floor bleeding.',
      'Boss NS-2: common placement with send/return loop for clarity.',
    ],
    sections: [
      {
        title: 'What it does',
        paragraphs: [
          'Compare signal level to a threshold. Below threshold → output attenuated (often −80 dB or hard mute). Above threshold → pass through. When you stop playing, the gate closes; when you pick, it opens.',
        ],
      },
      {
        title: 'Controls',
        paragraphs: [],
        bullets: [
          'Threshold: sensitivity — too high cuts off sustain tails',
          'Decay/release: how long before gate closes after signal drops',
          'Hysteresis sometimes prevents flutter at the boundary',
        ],
      },
      {
        title: 'Placement',
        paragraphs: [
          'Usually after gain stages that create noise. Putting gate before drive can stop soft picking from opening the drive — usually wrong place. Some gates track the raw input while muting the processed chain (loop methods).',
        ],
      },
    ],
  },
  {
    slug: 'high-pass-filter',
    num: null,
    name: 'High-pass filter',
    tagline: 'Roll off low-end rumble and mud — frequency “noise” control.',
    category: 'bonus',
    diagram: 'high-pass',
    related: ['filter-eq', 'noise-gate'],
    guitarExamples: [
      'Bass cut on amp: tighten low end before it muds the mix.',
      'High-pass at 80 Hz in DAW on guitar bus: cleans mix.',
      'Bright switch on Tele: less low-end thump.',
    ],
    sections: [
      {
        title: 'What it does',
        paragraphs: [
          'Attenuates frequencies below a cutoff. Sub-bass rumble, handling noise, and boomy room energy live down there. Cutting lows can clarify a dense mix without touching pick attack (which lives in mids).',
        ],
      },
      {
        title: 'Not a noise gate',
        paragraphs: [
          'High-pass removes low frequencies always — it does not wait for silence. A gate removes everything when quiet. Use both for different problems: rumble vs hiss.',
        ],
      },
      {
        title: 'When to use',
        paragraphs: [],
        bullets: [
          'Multi-layered heavy mixes — tighten rhythm guitars',
          'Acoustic or mic bleed with low rumble',
          'After fuzz that adds sub content',
        ],
      },
    ],
  },
]

export function getConcept(slug: string): Concept | undefined {
  return concepts.find((c) => c.slug === slug)
}

export function getConceptNav(slug: string): { prev: Concept | null; next: Concept | null } {
  const idx = concepts.findIndex((c) => c.slug === slug)
  return {
    prev: idx > 0 ? concepts[idx - 1] : null,
    next: idx < concepts.length - 1 ? concepts[idx + 1] : null,
  }
}

export const coreConcepts = concepts.filter((c) => c.category === 'core')
export const bonusConcepts = concepts.filter((c) => c.category === 'bonus')
