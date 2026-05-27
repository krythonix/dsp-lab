export function HarmonicSeriesDiagram() {
  const rows = [
    { n: '1st (fundamental)', hz: 110, mult: '1×', note: 'A', isA: true },
    { n: '2nd', hz: 220, mult: '2×', note: 'A', isA: true },
    { n: '3rd', hz: 330, mult: '3×', note: 'E', isA: false },
    { n: '4th', hz: 440, mult: '4×', note: 'A', isA: true },
    { n: '5th', hz: 550, mult: '5×', note: 'C♯', isA: false },
    { n: '6th', hz: 660, mult: '6×', note: 'E', isA: false },
    { n: '7th', hz: 770, mult: '7×', note: 'G', isA: false },
    { n: '8th', hz: 880, mult: '8×', note: 'A', isA: true },
  ]

  return (
    <figure className="diagram-card">
      <table className="compare-table harmonic-table">
        <thead>
          <tr>
            <th>Harmonic</th>
            <th>Frequency</th>
            <th>Multiple of 110 Hz</th>
            <th>Note name</th>
            <th>Also “A”?</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.n}>
              <td>{r.n}</td>
              <td>{r.hz} Hz</td>
              <td>{r.mult}</td>
              <td>{r.note}</td>
              <td>{r.isA ? 'Yes — octave of A' : 'No — other pitch class'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption>
        All rows belong to the harmonic series of A — but only octave harmonics (2nd, 4th, 8th…) are the letter A
      </figcaption>
    </figure>
  )
}

export function HarmonicStackDiagram() {
  const width = 420
  const rowH = 36
  const barMax = 120
  const fundamental = 110

  const bars = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
    n,
    hz: fundamental * n,
    amp: n === 1 ? 1 : 1 / n,
  }))

  const height = bars.length * rowH + 40

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Harmonic amplitudes">
        {bars.map((b, i) => {
          const y = 24 + i * rowH
          const w = b.amp * barMax
          return (
            <g key={b.n}>
              <text x={8} y={y + 14} fill="#78716c" fontSize={10}>
                {b.n === 1 ? 'fund.' : `H${b.n}`} {b.hz} Hz
              </text>
              <rect x={100} y={y} width={w} height={18} rx={3} fill={b.n === 1 ? '#60a5fa' : b.n % 2 === 0 ? '#34d399' : '#fbbf24'} opacity={0.85} />
            </g>
          )
        })}
        <text x={100} y={height - 8} fill="#78716c" fontSize={10}>
          relative strength (natural string: strong low harmonics, weaker high ones)
        </text>
      </svg>
      <figcaption>Real notes contain many harmonics at different levels — timbre is this recipe</figcaption>
    </figure>
  )
}

export function HarmonicFusionDiagram() {
  const width = 400
  const height = 100
  const midY = height / 2

  function wave(t: number, harmonics: { n: number; a: number }[]) {
    return harmonics.reduce((sum, h) => sum + h.a * Math.sin(t * Math.PI * 2 * h.n), 0)
  }

  const clean = (t: number) => wave(t, [{ n: 1, a: 1 }])
  const rich = (t: number) =>
    wave(t, [
      { n: 1, a: 1 },
      { n: 2, a: 0.45 },
      { n: 3, a: 0.35 },
      { n: 4, a: 0.2 },
      { n: 5, a: 0.15 },
    ])

  function path(fn: (t: number) => number, yOffset: number) {
    return Array.from({ length: 201 }, (_, i) => {
      const t = i / 200
      const x = t * width
      const y = yOffset - fn(t) * 32
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
  }

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height * 2 + 16}`} width="100%" height={height * 2 + 16} role="img">
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" />
        <path d={path(clean, midY)} fill="none" stroke="#60a5fa" strokeWidth={2} />
        <text x={8} y={16} fill="#60a5fa" fontSize={11}>
          Pure tone — mostly fundamental
        </text>
        <line x1={0} y1={height + midY} x2={width} y2={midY + height} stroke="#2a2724" />
        <path d={path(rich, height + midY)} fill="none" stroke="#fbbf24" strokeWidth={2} />
        <text x={8} y={height + 16} fill="#fbbf24" fontSize={11}>
          Rich harmonics — same pitch A, different timbre (brain hears one note)
        </text>
      </svg>
      <figcaption>Extra harmonics change the shape without changing which note you perceive</figcaption>
    </figure>
  )
}

export function OddEvenHarmonicsDiagram() {
  const width = 400
  const height = 90
  const midY = height / 2

  function oddWave(t: number) {
    let v = Math.sin(t * Math.PI * 2)
    v += 0.4 * Math.sin(t * Math.PI * 2 * 3)
    v += 0.25 * Math.sin(t * Math.PI * 2 * 5)
    return v * 0.65
  }

  function evenWave(t: number) {
    let v = Math.sin(t * Math.PI * 2)
    v += 0.5 * Math.sin(t * Math.PI * 2 * 2)
    v += 0.3 * Math.sin(t * Math.PI * 2 * 4)
    return v * 0.55
  }

  function path(fn: (t: number) => number, yOff: number) {
    return Array.from({ length: 201 }, (_, i) => {
      const t = i / 200
      const x = t * width
      const y = yOff - fn(t) * 30
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
  }

  return (
    <figure className="diagram-card">
      <svg viewBox={`0 0 ${width} ${height * 2 + 16}`} width="100%" height={height * 2 + 16} role="img">
        <line x1={0} y1={midY} x2={width} y2={midY} stroke="#2a2724" />
        <path d={path(oddWave, midY)} fill="none" stroke="#f87171" strokeWidth={2} />
        <text x={8} y={16} fill="#f87171" fontSize={11}>
          Odd-heavy (3rd, 5th…) — edgy, fuzz-like
        </text>
        <line x1={0} y1={height + midY} x2={width} y2={height + midY} stroke="#2a2724" />
        <path d={path(evenWave, height + midY)} fill="none" stroke="#34d399" strokeWidth={2} />
        <text x={8} y={height + 16} fill="#34d399" fontSize={11}>
          Even-heavy (2nd, 4th…) — sweeter, vocal
        </text>
      </svg>
      <figcaption>Clipping symmetry affects which harmonics dominate — part of why fuzz ≠ overdrive</figcaption>
    </figure>
  )
}
