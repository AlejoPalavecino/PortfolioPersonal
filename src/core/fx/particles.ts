/**
 * Fixed-capacity particle pool. Objects are allocated once and reused: spawning never
 * allocates and can never exceed `max` (a full pool drops the request), so repeated
 * effects cannot pile up or trigger garbage collection mid-walk.
 */
export type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number; kind: number; size: number }
export type ParticleInit = Partial<Particle> & { life: number }

export function createParticlePool(initialMax: number) {
  let max = Math.max(0, Math.floor(initialMax))
  const slots: Particle[] = []
  let alive = 0
  const fresh = (): Particle => ({ x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 0, kind: 0, size: 1 })
  return {
    get count() { return alive },
    get max() { return max },
    spawn(init: ParticleInit): boolean {
      if (alive >= max) return false
      const particle = slots[alive] ??= fresh()
      Object.assign(particle, { x: 0, y: 0, vx: 0, vy: 0, age: 0, kind: 0, size: 1 }, init)
      alive++
      return true
    },
    /** Velocities are in px per second; `dragPerSecond` damps them (0 = none). */
    step(elapsedMs: number, dragPerSecond = 0) {
      const dt = Math.max(0, elapsedMs) / 1000, keep = Math.exp(-dragPerSecond * dt)
      for (let i = alive - 1; i >= 0; i--) {
        const p = slots[i]!
        p.age += elapsedMs
        if (p.age >= p.life) { const last = slots[alive - 1]!; slots[alive - 1] = p; slots[i] = last; alive--; continue }
        p.x += p.vx * dt; p.y += p.vy * dt
        if (dragPerSecond) { p.vx *= keep; p.vy *= keep }
      }
    },
    forEach(visit: (particle: Particle, progress: number) => void) {
      for (let i = 0; i < alive; i++) { const p = slots[i]!; visit(p, p.age / p.life) }
    },
    /** Lowering the capacity drops the excess immediately (used when the budget degrades). */
    setMax(value: number) { max = Math.max(0, Math.floor(value)); if (alive > max) alive = max },
    clear() { alive = 0 },
  }
}
export type ParticlePool = ReturnType<typeof createParticlePool>
