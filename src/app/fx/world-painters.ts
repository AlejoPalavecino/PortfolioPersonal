import type { Point, Section } from '../../core/domain'

/** Exact pixel coordinates on the 1000x650 world (measured on tools/world_grid.png). */
export const CAMPFIRE: Point = { x: 248, y: 272 }

export const LANTERNS: readonly { x: number; y: number; r: number; phase: number; section: Section }[] = [
  { x: 179, y: 237, r: 11, phase: 0.0, section: 'about' },
  { x: 521, y: 229, r: 9, phase: 1.3, section: 'projects' },
  { x: 547, y: 229, r: 9, phase: 2.7, section: 'projects' },
  { x: 583, y: 229, r: 9, phase: 4.1, section: 'projects' },
  { x: 635, y: 184, r: 12, phase: 0.8, section: 'projects' },
  { x: 695, y: 318, r: 12, phase: 3.4, section: 'contact' },
]

const WATER_SPOTS: readonly { x: number; y: number; w: number; h: number; vertical?: boolean; phase: number }[] = [
  { x: 882, y: 270, w: 2, h: 6, vertical: true, phase: 0.0 },
  { x: 889, y: 280, w: 2, h: 7, vertical: true, phase: 1.6 },
  { x: 885, y: 304, w: 8, h: 2, phase: 0.8 },
  { x: 904, y: 336, w: 6, h: 2, phase: 2.2 },
  { x: 928, y: 356, w: 5, h: 2, phase: 3.5 },
  { x: 960, y: 404, w: 6, h: 2, phase: 1.1 },
  { x: 830, y: 512, w: 6, h: 2, phase: 2.9 },
  { x: 882, y: 566, w: 2, h: 6, vertical: true, phase: 0.4 },
  { x: 798, y: 604, w: 2, h: 6, vertical: true, phase: 1.9 },
]

export function drawHalo(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rgba: string) {
  const r = Math.max(2, Math.round(radius))
  ctx.fillStyle = rgba
  for (let dy = -r; dy <= r; dy += 2) {
    const half = Math.round(r * Math.sqrt(Math.max(0, 1 - (dy / r) ** 2)))
    ctx.fillRect(Math.round(cx - half), Math.round(cy + dy), half * 2, 2)
  }
}

export function drawPixelRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string, alpha = 1) {
  ctx.save()
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
  ctx.fillStyle = color
  const steps = 20
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const x = Math.round(cx + Math.cos(a) * rx), y = Math.round(cy + Math.sin(a) * ry)
    ctx.fillRect(x - 1, y - 1, 2, 2)
  }
  ctx.restore()
}

export function drawWater(ctx: CanvasRenderingContext2D, clockMs: number, limit: number) {
  const count = Math.min(limit, WATER_SPOTS.length)
  for (let i = 0; i < count; i++) {
    const spot = WATER_SPOTS[i]!
    const wave = Math.sin(clockMs / 460 + spot.phase)
    if (wave < -0.15) continue
    const shift = Math.round(((clockMs / 180 + spot.phase * 3) % 4))
    ctx.fillStyle = wave > 0.45 ? 'rgba(255,255,255,0.68)' : 'rgba(216,246,255,0.48)'
    const x = spot.x + (spot.vertical ? 0 : shift), y = spot.y + (spot.vertical ? shift : 0)
    ctx.fillRect(x, y, spot.w, spot.h)
  }
}

/**
 * Draws the distinct visual response for each of the four destinations:
 * - projects (Taller): warm interior doorway & window light + gable lantern boost.
 * - about (Carpa): tent interior warm glow & lantern highlight.
 * - journey (Bitácora): open notebook page highlight, bookmark ribbon & compass glint.
 * - contact (Radio): transceiver indicator LED & concentric pixel signal arcs at the antenna.
 */
export function drawDestinationResponse(
  ctx: CanvasRenderingContext2D,
  section: Section,
  intensity: number,
  clockMs: number,
  staticOnly: boolean,
) {
  const power = Math.max(0, Math.min(1, intensity))
  if (power <= 0.02) return
  const pulse = staticOnly ? 1 : 0.85 + 0.15 * Math.sin(clockMs / 240)
  const a = power * pulse
  if (section === 'projects') {
    drawHalo(ctx, 643, 252, 22, `rgba(255,204,112,${(0.24 * a).toFixed(3)})`)
    ctx.fillStyle = `rgba(255,225,148,${(0.32 * a).toFixed(3)})`
    ctx.fillRect(593, 242, 12, 16)
    ctx.fillRect(635, 240, 16, 22)
    ctx.fillRect(686, 246, 13, 16)
    drawHalo(ctx, 635, 184, 15, `rgba(255,214,122,${(0.3 * a).toFixed(3)})`)
  } else if (section === 'about') {
    drawHalo(ctx, 238, 232, 20, `rgba(255,196,108,${(0.24 * a).toFixed(3)})`)
    drawHalo(ctx, 179, 237, 16, `rgba(255,220,136,${(0.34 * a).toFixed(3)})`)
    ctx.fillStyle = `rgba(255,236,178,${(0.75 * a).toFixed(3)})`
    ctx.fillRect(177, 235, 4, 5)
  } else if (section === 'journey') {
    drawHalo(ctx, 344, 384, 20, `rgba(255,226,150,${(0.25 * a).toFixed(3)})`)
    ctx.fillStyle = `rgba(255,246,214,${(0.42 * a).toFixed(3)})`
    ctx.fillRect(326, 375, 16, 12)
    ctx.fillRect(344, 376, 16, 12)
    ctx.fillStyle = `rgba(196,68,45,${(0.85 * a).toFixed(3)})`
    const markY = staticOnly ? 386 : 385 + Math.round(Math.sin(clockMs / 220))
    ctx.fillRect(341, markY, 3, 7)
    ctx.fillStyle = `rgba(255,238,168,${(0.8 * a).toFixed(3)})`
    ctx.fillRect(300, 379, 3, 3)
  } else if (section === 'contact') {
    drawHalo(ctx, 768, 342, 16, `rgba(143,240,164,${(0.2 * a).toFixed(3)})`)
    ctx.fillStyle = `rgba(143,240,164,${(0.9 * a).toFixed(3)})`
    ctx.fillRect(761, 340, 3, 3)
    ctx.fillStyle = `rgba(255,214,110,${(0.85 * a).toFixed(3)})`
    ctx.fillRect(767, 340, 6, 3)
    const rings = staticOnly ? [7, 12] : [5 + ((clockMs / 90) % 9), 5 + (((clockMs / 90) + 4.5) % 9)]
    for (const r of rings) {
      const fade = staticOnly ? 0.55 * power : (1 - (r - 5) / 9) * 0.7 * power
      drawPixelRing(ctx, 816, 256, r, Math.max(3, r * 0.65), '#ffe6a3', fade)
    }
  }
}
