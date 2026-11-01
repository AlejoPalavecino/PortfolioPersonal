import { createParticlePool } from '../../core/fx/particles'

/** Palette sampled from the camp art: ember reds, lantern oranges, warm cream. */
export const FIRE_COLORS = { outer: '#c9432a', mid: '#f08a24', inner: '#ffd25c', core: '#fff1b3' } as const
const SMOKE = ['#efe6d6', '#cfc4b4', '#a99f93'] as const

/**
 * Draws one flame on a pixel canvas. `size` 0-1 maps real progress (or intensity) to height;
 * `frame` selects the flicker pose. All coordinates are whole pixels so it stays crisp when the
 * canvas is scaled with image-rendering: pixelated.
 */
export function drawFlame(ctx: CanvasRenderingContext2D, cx: number, baseY: number, size: number, frame: number, max = { height: 11, half: 4.2 }): void {
  const s = Math.max(0, Math.min(1, size))
  const height = Math.round(3 + max.height * s), half = 1.5 + max.half * s
  for (let row = 0; row < height; row++) {
    const t = row / height, hw = Math.max(0.5, half * (1 - t) ** 0.85)
    const sway = Math.round(Math.sin(frame * 1.9 + row * 0.8) * (0.4 + 1.3 * t))
    const y = baseY - row - 1
    const band = (width: number, color: string) => {
      const w = Math.round(width)
      if (w < 1) return
      ctx.fillStyle = color
      ctx.fillRect(Math.round(cx + sway - w), y, w * 2, 1)
    }
    band(hw, FIRE_COLORS.outer)
    band(hw * 0.68, FIRE_COLORS.mid)
    if (t < 0.7) band(hw * 0.38, FIRE_COLORS.inner)
    if (t < 0.36) band(hw * 0.18, FIRE_COLORS.core)
  }
}

/** Embers and smoke for a fire, built on the shared pool. Spawns only while `active`. */
export function createFireParticles(maxSmoke: number, maxEmbers = 5, random: () => number = Math.random) {
  const smoke = createParticlePool(maxSmoke), embers = createParticlePool(maxEmbers)
  let smokeTimer = 0, emberTimer = 0
  return {
    step(elapsedMs: number, x: number, y: number, size: number, active: boolean) {
      smoke.step(elapsedMs); embers.step(elapsedMs)
      if (!active || size < 0.2) return
      smokeTimer += elapsedMs; emberTimer += elapsedMs
      if (smokeTimer > 520 / Math.max(0.35, size)) { smokeTimer = 0; smoke.spawn({ x: x + (random() - 0.5) * 3, y: y - 12 * size, vx: (random() - 0.2) * 4, vy: -(7 + random() * 4), life: 2600, size: 2 }) }
      if (emberTimer > 700 && size > 0.45) { emberTimer = 0; embers.spawn({ x: x + (random() - 0.5) * 6, y: y - 6, vx: (random() - 0.5) * 9, vy: -(14 + random() * 10), life: 900, size: 1 }) }
    },
    draw(ctx: CanvasRenderingContext2D) {
      smoke.forEach((p, progress) => {
        ctx.globalAlpha = 0.5 * (1 - progress)
        ctx.fillStyle = SMOKE[Math.min(2, Math.floor(progress * 3))]!
        const grow = progress > 0.5 ? 3 : 2
        ctx.fillRect(Math.round(p.x), Math.round(p.y), grow, grow)
      })
      ctx.globalAlpha = 1
      embers.forEach((p, progress) => {
        ctx.fillStyle = progress < 0.5 ? FIRE_COLORS.inner : progress < 0.8 ? FIRE_COLORS.mid : FIRE_COLORS.outer
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1)
      })
    },
    clear() { smoke.clear(); embers.clear(); smokeTimer = 0; emberTimer = 0 },
    setMaxSmoke(value: number) { smoke.setMax(value) },
    get count() { return smoke.count + embers.count },
  }
}
