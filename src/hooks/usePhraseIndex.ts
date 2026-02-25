import { useSyncExternalStore, useCallback, useRef, useEffect } from 'react'

export function usePhraseIndex(
  active: boolean,
  count: number,
  intervalMs: number
): number {
  const indexRef = useRef(0)
  const listenersRef = useRef(new Set<() => void>())

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener)
    return () => { listenersRef.current.delete(listener) }
  }, [])

  const getSnapshot = useCallback(() => indexRef.current, [])

  useEffect(() => {
    if (!active) {
      if (indexRef.current !== 0) {
        indexRef.current = 0
        listenersRef.current.forEach((l) => l())
      }
      return
    }

    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % count
      listenersRef.current.forEach((l) => l())
    }, intervalMs)

    return () => clearInterval(id)
  }, [active, count, intervalMs])

  return useSyncExternalStore(subscribe, getSnapshot)
}
