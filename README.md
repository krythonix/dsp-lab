# DSP Lab

Interactive guitar DSP learning app — visual guides, concept deep-dives, and hands-on Web Audio labs. Built with React, TypeScript, and Vite.

**Repository:** [github.com/krythonix/dsp-lab](https://github.com/krythonix/dsp-lab)

## What’s inside

### Concept map (`#/`)

A guided path through the core ideas behind guitar tone:

- 10 core concepts (sample, signal flow, clipping, harmonics, filters, delay, dry/wet, LFO, and more)
- Bonus guides (compressor, noise gate, high-pass filter)
- Effect lookup table — which concepts each pedal family needs
- Click any concept for a full page with diagrams and guitar-focused examples

### Visual guides

| Route | Page |
| --- | --- |
| `#/overdrive` | Overdrive — soft clipping and tone shaping |
| `#/fuzz-chorus` | Fuzz & chorus — extreme clipping and modulation |
| `#/harmonics` | Harmonics — why clipped guitar sounds “full” |

### Interactive labs

**Distortion Lab** (`#/distortion-lab`)

- Live Web Audio waveshaper with soft, hard, and fuzz clip types
- **Draggable transfer curve** — drag handles to shape the waveshaper in real time
- Drive, tone, and output controls; bypass mode
- Clean guitar demo loop or live mic/interface input
- Live waveform scope and signal-flow diagram

**Delay Lab** (`#/delay-lab`)

- Delay time, feedback, mix, and output
- Dry/wet flow diagram and echo timeline visualization
- Same demo sample or live input

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and use the hash routes above (e.g. `#/distortion-lab`).

### Other scripts

```bash
npm run build    # production build to dist/
npm run preview  # preview production build
npm run lint     # ESLint
```

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **Web Audio API** — `WaveShaperNode`, `DelayNode`, analysers, live input
- Hash-based client routing (no server-side routes required)

## Project layout

```
src/
  audio/          # Web Audio graphs (distortion, delay, sample player)
  components/     # Draggable transfer curve, waveform scope
  content/        # Concept articles and metadata
  diagrams/       # SVG diagrams for guides and labs
  hooks/          # useDistortionEngine, useDelayEngine
  pages/          # Route pages
  navigation.ts   # Hash routing
public/
  audio/          # Clean guitar demo MP3 for labs
```

## Audio demo

Labs loop a clean guitar sample from `public/audio/clean-guitar-demo.mp3`. Live input requires microphone permission in the browser.

## License

Private project — see repository owner for usage terms.
