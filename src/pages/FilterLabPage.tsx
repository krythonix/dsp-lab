import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { createFilterGraph, defaultFilterParams, hzToLabel, type FilterType } from '../audio/filter'
import { useLabEngine } from '../hooks/useLabEngine'

const filterTypes: { id: FilterType; label: string }[] = [
  { id: 'lowpass', label: 'Low-pass' },
  { id: 'highpass', label: 'High-pass' },
  { id: 'bandpass', label: 'Band-pass' },
  { id: 'peaking', label: 'Peaking' },
  { id: 'lowshelf', label: 'Low shelf' },
  { id: 'highshelf', label: 'High shelf' },
]

export function FilterLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createFilterGraph, defaultFilterParams)
  const showGain = params.filterType === 'peaking' || params.filterType.includes('shelf')

  return (
    <main className="page">
      <header className="hero">
        <h1>Filter / EQ Lab</h1>
        <p>Shape tone by letting some frequencies through and cutting others — the same idea as amp tone stacks and pedal EQ.</p>
      </header>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Start the sample and sweep cutoff — hear highs or lows roll off."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <fieldset className="pedal-fieldset">
              <legend>Filter type</legend>
              {filterTypes.map((t) => (
                <label key={t.id} className="pedal-radio">
                  <input
                    type="radio"
                    name="filterType"
                    checked={params.filterType === t.id}
                    onChange={() => setParams({ filterType: t.id })}
                  />
                  {t.label}
                </label>
              ))}
            </fieldset>
            <PedalSlider label="Frequency" value={params.frequency} min={80} max={8000} step={10} display={hzToLabel(params.frequency)} onChange={(frequency) => setParams({ frequency })} />
            <PedalSlider label="Q (resonance)" value={params.q} min={0.3} max={12} step={0.1} display={params.q.toFixed(1)} onChange={(q) => setParams({ q })} />
            {showGain && (
              <PedalSlider label="Gain" value={params.gainDb} min={-12} max={12} step={0.5} display={`${params.gainDb > 0 ? '+' : ''}${params.gainDb} dB`} onChange={(gainDb) => setParams({ gainDb })} />
            )}
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#a78bfa" />
          </div>
        </div>
      </section>
      <section className="section">
        <h2>What the code does</h2>
        <LabCodeSteps steps={[
          { title: 'Biquad filter', body: 'Web Audio BiquadFilterNode applies one EQ stage per sample.', formula: 'out = biquad(in, type, freq, Q)' },
          { title: 'Cutoff / center', body: 'Frequency sets where the filter starts rolling off or where a peak sits.', formula: 'lowpass: keep below freq' },
          { title: 'Q', body: 'Higher Q = sharper, more resonant slope — wah and synth filters use high Q.', formula: 'Q ↑ → narrower band' },
          { title: 'Shelf / peaking', body: 'Boost or cut a band without removing everything above/below.', formula: 'peaking: bell curve at freq' },
        ]} />
      </section>
    </main>
  )
}
