# DSP Lab

Interactive guitar DSP learning app — visual guides, concept deep-dives, and hands-on Web Audio labs. Built with React, TypeScript, and Vite.

**Live site:** [krythonix.github.io/dsp-lab](https://krythonix.github.io/dsp-lab/)  
**Repository:** [github.com/krythonix/dsp-lab](https://github.com/krythonix/dsp-lab)

**Related repos (separate git projects):** `dsp-lab-desktop`, `dsp-lab-mobile`, `dsp-lab-shared` — see [Related projects](#related-projects) below.

Use the **Menu** in the top-right to navigate. All routes are hash-based (e.g. `#/distortion-lab`), which works on GitHub Pages without a server.

## What’s inside

### Concept map (`#/`)

A guided path through the core ideas behind guitar tone:

- 10 core concepts (sample, signal flow, clipping, harmonics, filters, delay, dry/wet, LFO, and more)
- Bonus guides (compressor, noise gate, high-pass filter)
- Comparison guide cards and interactive lab cards on the home page
- Effect lookup table — which concepts each pedal family needs
- Click any concept for a full page with diagrams and guitar-focused examples

### Comparison guides

| Route | Page |
| --- | --- |
| `#/overdrive` | Overdrive & distortion — soft/hard clipping, transfer curves, waveforms |
| `#/harmonics` | Harmonics — series, odd/even content, and drive |
| `#/fuzz-chorus` | Fuzz & chorus — extreme clipping vs delay, mix, and LFO |

### Interactive labs

Each lab runs real Web Audio in the browser: clean guitar sample loop or live mic/interface input, tweakable controls, and a live waveform scope.

| Route | Lab | Highlights |
| --- | --- | --- |
| `#/distortion-lab` | Distortion | Draggable waveshaper, soft/hard/fuzz, drive & tone |
| `#/delay-lab` | Delay | Delay time, feedback, dry/wet mix, echo timeline |
| `#/chorus-lab` | Chorus | LFO-modulated short delay, depth & rate |
| `#/filter-lab` | Filter / EQ | Biquad types, frequency, Q, shelf/peaking gain |
| `#/highpass-lab` | High-pass | Cut low-end rumble before drive |
| `#/tremolo-lab` | Tremolo | LFO on amplitude — rate, depth, mix |
| `#/compressor-lab` | Compressor | Threshold, ratio, attack, release, makeup gain |
| `#/gate-lab` | Noise gate | Threshold-based muting between notes |
| `#/wah-lab` | Wah | Band-pass sweep — frequency & resonance |
| `#/phaser-lab` | Phaser & flanger | Mode toggle — all-pass notches or flanger sweep |
| `#/reverb-lab` | Reverb | Convolution ambience, pre-delay, decay, mix |
| `#/chain-lab` | Signal chain | Reorder drive, filter, delay, chorus — hear how order matters |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and use hash routes (e.g. [localhost:5173/#/distortion-lab](http://localhost:5173/#/distortion-lab)).

### Other scripts

```bash
npm run build    # production build to dist/
npm run preview  # preview production build (open /dsp-lab/ path)
npm run lint     # ESLint
```

## Deploy to GitHub Pages

The repo builds with `base: '/dsp-lab/'` and deploys the **`dist/`** folder to the **`gh-pages`** branch on every push to `main`.

1. In the repo go to **Settings → Pages → Build and deployment**
2. Set **Source** to **Deploy from a branch**
3. Set **Branch** to **`gh-pages`** and folder **`/ (root)`**
4. Push to `main` (or run **Actions → Deploy to GitHub Pages → Run workflow**)
5. Site URL: **https://krythonix.github.io/dsp-lab/**

Do **not** deploy from the `main` branch root — that serves the dev `index.html` and causes a `404` on `/src/main.tsx`.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for dev and build
- **Web Audio API** — waveshapers, delays, biquad filters, dynamics, convolution, analysers, live input
- Hash-based client routing (no server-side routes required)

## Project layout

```
src/
  audio/          # Web Audio graphs (distortion, delay, chorus, filter, …)
  components/     # Site nav, waveform scope, draggable curve, lab UI
  content/        # Concept articles and metadata
  diagrams/       # SVG diagrams for guides and labs
  hooks/          # Lab engine hooks (useLabEngine, useDistortionEngine, …)
  pages/          # Route pages (guides, labs, concept detail)
  navigation.ts   # Hash routing and menu config
public/
  audio/          # Clean guitar demo MP3 for labs
.github/
  workflows/      # GitHub Pages deploy
```

## Audio demo

Labs loop a clean guitar sample from `public/audio/clean-guitar-demo.mp3`. Live input requires microphone permission in the browser (HTTPS required — works on GitHub Pages).

## Related projects

This repo is **web only**. Native apps are separate repositories:

| Repo | Purpose |
| --- | --- |
| **dsp-lab** (this) | Browser learning app |
| **dsp-lab-desktop** | JUCE live app (Mac/Windows) |
| **dsp-lab-mobile** | iOS/Android (planned) |
| **dsp-lab-shared** | C++ DSP core for desktop + mobile |

For local development, clone all four into one parent folder and open `dsp-lab.code-workspace` — see the workspace README in your `dsp-lab-workspace` checkout.

## License

Private project — see repository owner for usage terms.
