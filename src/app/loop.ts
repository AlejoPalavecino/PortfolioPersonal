/**
 * One requestAnimationFrame loop for the whole app. Subscribers get the clock and the
 * elapsed time; each one can ask to be throttled. The loop sleeps when nobody listens
 * and while the tab is hidden, so a background tab does no audiovisual work.
 */
export type FrameFn = (time: number, elapsedMs: number) => void
type Options = { intervalMs?: number }

export function createLoop() {
  const subscribers = new Map<FrameFn, { interval: number; carried: number }>()
  let raf = 0, last = 0
  const tick = (time: number) => {
    raf = 0
    if (document.hidden) { last = 0; return }
    const elapsed = last ? Math.min(time - last, 100) : 0
    last = time
    for (const [fn, slot] of [...subscribers]) {
      slot.carried += elapsed
      if (slot.carried < slot.interval) continue
      const due = slot.carried; slot.carried = 0
      fn(time, due)
    }
    if (subscribers.size) raf = requestAnimationFrame(tick)
  }
  const wake = () => { if (!raf && subscribers.size && !document.hidden) { last = 0; raf = requestAnimationFrame(tick) } }
  const onVisibility = () => { if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0 } else wake() }
  document.addEventListener('visibilitychange', onVisibility)
  return {
    /** Subscribe; returns the unsubscribe function. Adding the same function twice replaces it. */
    add(fn: FrameFn, options: Options = {}): () => void {
      subscribers.set(fn, { interval: options.intervalMs ?? 0, carried: 0 })
      wake()
      return () => { subscribers.delete(fn) }
    },
    get size() { return subscribers.size },
    dispose() { subscribers.clear(); if (raf) cancelAnimationFrame(raf); raf = 0; document.removeEventListener('visibilitychange', onVisibility) },
  }
}
export type Loop = ReturnType<typeof createLoop>
