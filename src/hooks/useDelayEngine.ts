import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createDelayGraph,
  defaultDelayParams,
  type DelayGraph,
  type DelayParams,
} from '../audio/delay'

export function useDelayEngine() {
  const graphRef = useRef<DelayGraph | null>(null)
  const [params, setParamsState] = useState<DelayParams>(defaultDelayParams)
  const [isActive, setIsActive] = useState(false)
  const [source, setSource] = useState<'none' | 'demo' | 'input'>('none')
  const [error, setError] = useState<string | null>(null)

  const ensureGraph = useCallback(() => {
    if (!graphRef.current) {
      graphRef.current = createDelayGraph()
    }
    return graphRef.current
  }, [])

  const setParams = useCallback((partial: Partial<DelayParams>) => {
    setParamsState((prev) => {
      const next = { ...prev, ...partial }
      graphRef.current?.setParams(next)
      return next
    })
  }, [])

  const startDemoSong = useCallback(async () => {
    setError(null)
    try {
      const graph = ensureGraph()
      await graph.startDemoSong()
      graph.setParams(params)
      setIsActive(true)
      setSource('demo')
    } catch {
      setError('Could not load the guitar sample. Make sure the dev server is running and try again.')
    }
  }, [ensureGraph, params])

  const startGuitarInput = useCallback(async () => {
    setError(null)
    try {
      const graph = ensureGraph()
      await graph.startGuitarInput()
      graph.setParams(params)
      setIsActive(true)
      setSource('input')
    } catch {
      setError('Microphone / interface access denied or unavailable.')
    }
  }, [ensureGraph, params])

  const stop = useCallback(() => {
    graphRef.current?.stop()
    setIsActive(false)
    setSource('none')
  }, [])

  useEffect(() => {
    graphRef.current?.setParams(params)
  }, [params])

  useEffect(() => {
    return () => graphRef.current?.dispose()
  }, [])

  const getAnalyser = useCallback(() => graphRef.current?.analyser ?? null, [])

  return {
    params,
    setParams,
    isActive,
    source,
    error,
    getAnalyser,
    startDemoSong,
    startGuitarInput,
    stop,
  }
}
