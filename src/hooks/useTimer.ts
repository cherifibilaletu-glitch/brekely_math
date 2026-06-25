import { useCallback, useEffect, useRef, useState } from "react"

export type TimerState = "idle" | "running" | "paused" | "finished"

export function useTimer(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [state, setState] = useState<TimerState>("idle")
  const ref = useRef<number | null>(null)
  const onFinishRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setRemaining(totalSeconds)
  }, [totalSeconds])

  const clear = () => {
    if (ref.current) {
      window.clearInterval(ref.current)
      ref.current = null
    }
  }

  const start = useCallback(() => setState("running"), [])
  const pause = useCallback(() => setState("paused"), [])
  const reset = useCallback(() => {
    clear()
    setState("idle")
    setRemaining(totalSeconds)
  }, [totalSeconds])

  const onFinish = useCallback((cb: () => void) => {
    onFinishRef.current = cb
  }, [])

  useEffect(() => {
    if (state === "running") {
      ref.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clear()
            setState("finished")
            onFinishRef.current?.()
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return clear
  }, [state])

  const elapsed = totalSeconds - remaining
  return { remaining, elapsed, state, start, pause, reset, onFinish }
}
