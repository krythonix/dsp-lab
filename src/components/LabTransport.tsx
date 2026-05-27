type LabTransportProps = {
  isActive: boolean
  source: 'none' | 'demo' | 'input'
  error: string | null
  hint: string
  onDemo: () => void
  onInput: () => void
  onStop: () => void
}

export function LabTransport({ isActive, source, error, hint, onDemo, onInput, onStop }: LabTransportProps) {
  return (
    <>
      <div className="pedal-actions">
        <button type="button" className="pedal-btn" onClick={onDemo} disabled={source === 'demo'}>
          Clean guitar sample
        </button>
        <button type="button" className="pedal-btn" onClick={onInput} disabled={source === 'input'}>
          Guitar / mic in
        </button>
        <button type="button" className="pedal-btn pedal-btn--stop" onClick={onStop} disabled={!isActive}>
          Stop
        </button>
      </div>
      {error && <p className="pedal-error">{error}</p>}
      {isActive && (
        <p className="pedal-status">
          Playing: <strong>{source === 'demo' ? 'Clean guitar recording (loops)' : 'Live input'}</strong>
        </p>
      )}
      {!isActive && <p className="pedal-hint">{hint}</p>}
    </>
  )
}
