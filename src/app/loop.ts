/**
 * One animation clock for the whole app. Covered world layers and hidden tabs
 * sleep until they become visible or an active welcome animation subscribes.
 */
export type FrameFn = (time: number, elapsedMs: number) => void
type Options = { intervalMs?: number; duringIntro?: boolean }

export function createLoop(root?: HTMLElement) {
  const subscribers = new Map<FrameFn, { interval: number; carried: number; duringIntro: boolean }>()
  const intro = root?.querySelector<HTMLElement>('.intro')
  const menu = root?.querySelector<HTMLElement>('.mobile-menu')
  let worldVisible = true, ticking = false
  let raf = 0, last = 0
  const hasWork = () => {
    if (document.hidden) return false
    if (worldVisible) return subscribers.size > 0
    for (const slot of subscribers.values()) if (slot.duringIntro) return true
    return false
  }
  const schedule = () => {
    if (!hasWork()) {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      last = 0
    } else if (!raf && !ticking) {
      raf = requestAnimationFrame(tick)
    }
  }
  const tick = (time: number) => {
    raf = 0
    if (!hasWork()) { last = 0; return }
    const elapsed = last ? Math.min(time - last, 100) : 0
    last = time
    ticking = true
    try {
      for (const [fn, slot] of [...subscribers]) {
        if (!worldVisible && !slot.duringIntro) continue
        slot.carried += elapsed
        if (slot.carried < slot.interval) continue
        const due = slot.carried; slot.carried = 0
        fn(time, due)
      }
    } finally {
      ticking = false
      schedule()
    }
  }
  const sync = () => {
    worldVisible = intro?.hidden !== false && menu?.hidden !== false && root?.dataset.reading !== 'true'
    schedule()
  }
  const observer = root ? new MutationObserver(sync) : null
  if (root) observer?.observe(root, { attributes: true, attributeFilter: ['data-reading'] })
  for (const overlay of [intro, menu]) if (overlay) observer?.observe(overlay, { attributes: true, attributeFilter: ['hidden'] })
  document.addEventListener('visibilitychange', sync)
  sync()
  return {
    /** Adding the same function twice replaces its subscription. */
    add(fn: FrameFn, options: Options = {}): () => void {
      subscribers.set(fn, { interval: options.intervalMs ?? 0, carried: 0, duringIntro: options.duringIntro ?? false })
      schedule()
      return () => { subscribers.delete(fn); schedule() }
    },
    get size() { return subscribers.size },
    dispose() {
      subscribers.clear()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', sync)
      schedule()
    },
  }
}
export type Loop = ReturnType<typeof createLoop>
