import { LabCodeSteps } from '../components/LabCodeSteps'
import { LabTransport } from '../components/LabTransport'
import { PedalSlider } from '../components/PedalSlider'
import { WaveformScope } from '../components/WaveformScope'
import { chainBlockLabels, createChainGraph, defaultChainParams, moveBlock, type ChainBlock } from '../audio/chain'
import { useLabEngine } from '../hooks/useLabEngine'

export function ChainLabPage() {
  const { params, setParams, isActive, source, error, startDemoSong, startGuitarInput, stop, getAnalyser } =
    useLabEngine(createChainGraph, defaultChainParams)

  const toggleBypass = (block: ChainBlock) => {
    setParams({ bypass: { ...params.bypass, [block]: !params.bypass[block] } })
  }

  return (
    <main className="page">
      <header className="hero">
        <h1>Signal Chain Lab</h1>
        <p>Reorder blocks and hear how signal flow changes tone — drive before delay vs delay before drive, and so on.</p>
      </header>
      <section className="section">
        <h2>Chain order</h2>
        <ol className="chain-order">
          {params.order.map((block, i) => (
            <li key={block} className={params.bypass[block] ? 'chain-order__item chain-order__item--bypass' : 'chain-order__item'}>
              <span className="chain-order__num">{i + 1}</span>
              <span className="chain-order__label">{chainBlockLabels[block]}</span>
              <div className="chain-order__actions">
                <button type="button" className="pedal-btn pedal-btn--small" disabled={i === 0} onClick={() => setParams({ order: moveBlock(params.order, block, -1) })}>↑</button>
                <button type="button" className="pedal-btn pedal-btn--small" disabled={i === params.order.length - 1} onClick={() => setParams({ order: moveBlock(params.order, block, 1) })}>↓</button>
                <button type="button" className="pedal-btn pedal-btn--small" onClick={() => toggleBypass(block)}>
                  {params.bypass[block] ? 'Enable' : 'Bypass'}
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="section">
        <h2>Play it</h2>
        <div className="pedal-panel">
          <div className="pedal-panel__controls">
            <LabTransport
              isActive={isActive}
              source={source}
              error={error}
              hint="Try drive → delay → chorus, then swap drive and delay — same blocks, different tone."
              onDemo={startDemoSong}
              onInput={startGuitarInput}
              onStop={stop}
            />
            <PedalSlider label="Drive" value={params.drive} min={1} max={14} step={0.5} display={params.drive.toFixed(1)} onChange={(drive) => setParams({ drive })} />
            <PedalSlider label="Filter cutoff" value={params.filterCutoff} min={400} max={6000} step={50} display={`${params.filterCutoff} Hz`} onChange={(filterCutoff) => setParams({ filterCutoff })} />
            <PedalSlider label="Delay time" value={params.delayMs} min={80} max={500} step={10} display={`${params.delayMs} ms`} onChange={(delayMs) => setParams({ delayMs })} />
            <PedalSlider label="Delay mix" value={params.delayMix} min={0} max={0.6} step={0.01} display={`${Math.round(params.delayMix * 100)}%`} onChange={(delayMix) => setParams({ delayMix })} />
            <PedalSlider label="Chorus mix" value={params.chorusMix} min={0} max={0.7} step={0.01} display={`${Math.round(params.chorusMix * 100)}%`} onChange={(chorusMix) => setParams({ chorusMix })} />
            <PedalSlider label="Output" value={params.output} min={0} max={1} step={0.01} display={`${Math.round(params.output * 100)}%`} onChange={(output) => setParams({ output })} />
          </div>
          <div className="pedal-panel__visuals">
            <WaveformScope getAnalyser={getAnalyser} isActive={isActive} color="#f87171" />
          </div>
        </div>
      </section>
      <section className="section">
        <LabCodeSteps steps={[
          { title: 'Serial chain', body: 'Each block output feeds the next — order is not commutative.', formula: 'out = blockN(…block2(block1(in)))' },
          { title: 'Bypass', body: 'Skip a block without removing it from the chain — compare A/B quickly.', formula: 'bypass → dry through block' },
          { title: 'Drive placement', body: 'Drive before time effects: distorted echoes. Delay before drive: each repeat clips again.', formula: 'order changes harmonics + repeats' },
        ]} />
      </section>
    </main>
  )
}
